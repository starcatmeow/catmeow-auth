<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="clients"
      item-key="._id"
      :options.sync="options"
      :server-items-length="totalclients"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>OpenID 客户端列表</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">
                新建 OpenID 客户端
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">OpenID 客户端</span>
              </v-card-title>
              <v-container class="px-6">
                <v-text-field
                  v-model="editingItem.client_name"
                  label="客户端名称"
                ></v-text-field>
                <v-text-field
                  v-model="editingItem.redirect_uri"
                  label="重定向 URI"
                ></v-text-field>
                <v-btn @click="close">取消</v-btn>
                <v-btn color="primary" @click="save" class="mx-4">保存</v-btn>
              </v-container>
              <v-overlay absolute :value="saving">
                <v-progress-circular indeterminate color="indigo" size="50" />
              </v-overlay>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="headline"
                >确定要删除 OpenID 客户端
                {{ editingItem.client_name }} ？</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="closeDelete">取消</v-btn>
                <v-btn @click="deleteItemConfirm">确定</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
              <v-overlay absolute :value="deleting">
                <v-progress-circular indeterminate color="indigo" size="50" />
              </v-overlay>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <v-container v-if="showalert">
      <v-alert
        dismissible
        dense
        v-model="showalert"
        :type="alerttype"
        v-text="alertmsg"
        class="mb-0"
        transition="scroll-y-transition"
      />
    </v-container>
    <v-dialog v-model="dialogClientInfo" max-width="700px">
      <v-card>
        <v-card-title>{{newClientInfo.client_name}}</v-card-title>
        <v-list class="transparent">
          <v-list-item>
            <v-list-item-title>Client ID</v-list-item-title>
            <v-list-item-subtitle class="text-right">{{newClientInfo.client_id}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Client Secret</v-list-item-title>
            <v-list-item-subtitle class="text-right">{{newClientInfo.client_secret}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Redirect URI</v-list-item-title>
            <v-list-item-subtitle class="text-right">{{newClientInfo.redirect_uri}}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn @click="dialogClientInfo = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      editingItem: {
        client_id: '',
        client_name: '',
        redirect_uri: '',
      },
      headers: [
        { text: "名称", value: "client_name", sortable: false },
        { text: "ID", value: "client_id", sortable: false },
        { text: "重定向 URI", value: "redirect_uris[0]", sortable: false },
        { text: "操作", value: "actions", sortable: false },
      ],
      clients: [],
      dialogDelete: false,
      dialogClientInfo: false,
      loading: false,
      saving: false,
      deleting: false,
      showalert: false,
      alerttype: "success",
      alertmsg: '',
      options: {},
      totalclients: 0,
      newClientInfo: {
        client_name: '',
        client_id: '',
        client_secret: '',
        redirect_uri: '',
      }
    };
  },
  methods: {
    fetchClientList() {
      this.loading = true;
      const { page, itemsPerPage } = this.options;
      axios
        .get("/client?limit=" + itemsPerPage + "&page=" + page)
        .then((res) => {
          if (res.data.statusCode != "200") throw new Error(res.data.error);
          if (page == 1) {
            this.totalclients = res.data.length;
          }
          this.clients = res.data.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.alerttype = "error";
          this.alertmsg = err.message;
          this.showalert = true;
        });
    },
    close() {
      this.editingItem = {
        client_id: '',
        client_name: '',
        redirect_uri: '',
      }
      this.dialog = false
    },
    closeDelete() {
      this.editingItem = {
        client_id: '',
        client_name: '',
        redirect_uri: '',
      }
      this.dialogDelete = false
    },
    save() {
      this.saving = true;
      if (this.editingItem.client_id == '') {
        axios
          .post("/client", {
            clientname: this.editingItem.client_name,
            redirecturi: this.editingItem.redirect_uri
          })
          .then((res) => {
            if (res.data.statusCode != "200") throw new Error(res.data.error);
            this.dialog = false;
            this.saving = false;
            this.alerttype = 'success'
            this.alertmsg = res.data.data.payload.client_name+' ('+res.data.data.payload.client_id+') 添加成功'
            this.showalert = true
            this.editingItem = {
              client_id: '',
              client_name: '',
              redirect_uri: '',
            };
            this.fetchClientList()
            let payload = res.data.data.payload
            payload.redirect_uri = payload.redirect_uris[0]
            this.newClientInfo = payload
            this.dialogClientInfo = true
          })
          .catch(err=>{
            this.saving = false;
            this.alerttype = 'error'
            this.alertmsg = this.editingItem.client_name+' 添加失败：'+err.message
            this.showalert = true
          });
      }else{
        axios.put("/client/"+this.editingItem.client_id,{
          clientname: this.editingItem.client_name,
          redirecturi: this.editingItem.redirect_uri
        })
        .then(res => {
          if (res.data.statusCode != "200") throw new Error(res.data.error);
            this.dialog = false;
            this.saving = false
            this.alerttype = 'success'
            this.alertmsg = this.editingItem.client_name+' ('+this.editingItem.client_id+') 修改成功'
            this.editingItem = {
              client_id: '',
              client_name: '',
              redirect_uri: '',
            };
            this.showalert = true
            this.fetchClientList()
        })
        .catch(err=> {
          this.saving = false;
          this.alerttype = 'error'
          this.alertmsg = this.editingItem.client_name+' 修改失败：'+err.message
          this.showalert = true
        })
      }
    },
    deleteItemConfirm() {
      this.deleting = true
      axios.delete('/client/'+this.editingItem.client_id)
      .then(res=>{
        if (res.data.statusCode != "200") throw new Error(res.data.error);
        this.deleting = false
        this.dialogDelete = false
        this.alerttype = 'success'
        this.alertmsg = this.editingItem.client_name+' ('+this.editingItem.client_id+') 删除成功'
        this.editingItem = {
          client_id: '',
          client_name: '',
          redirect_uri: '',
        }
        this.showalert = true
        this.fetchClientList()
      })
      .catch(err=>{
        this.deleting = false;
        this.alerttype = 'error'
        this.alertmsg = this.editingItem.client_name+' 删除失败：'+err.message
        this.showalert = true
      })
    },
    editItem(item) {
      Object.assign(this.editingItem,item)
      this.editingItem.redirect_uri = this.editingItem.redirect_uris[0]
      this.dialog = true
    },
    deleteItem(item) {
      Object.assign(this.editingItem,item)
      this.dialogDelete = true
    },
  },
  mounted: function () {
    this.fetchClientList();
  },
};
</script>