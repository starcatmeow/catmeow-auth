<template>
  <v-card>
    <v-card-title>用户列表</v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
      :expanded.sync="expanded"
      show-expand
      item-key="._id"
      :options.sync="options"
      :server-items-length="totalusers"
      :loading="loading"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-container>
            <p>用户 ID: {{ item._id }}</p>
            <v-btn color="primary" @click="showDialog(item)">修改密码</v-btn>
          </v-container>
        </td>
      </template>
      <template v-slot:[`item.emailVerified`]="{ item }">
        <v-switch
          v-model="item.emailVerified"
          @click="changeEmailVerified(item)"
          :disabled="item.emailVerified == null"
        />
      </template>
      <template v-slot:[`item.admin`]="{ item }">
        <v-switch
          v-model="item.admin"
          @click="changeAdmin(item)"
          :disabled="item.admin == null"
        />
      </template>
      <template v-slot:[`header.admin`]="{ header }">
        {{ header.text }}
        <v-progress-circular
          indeterminate
          color="indigo"
          size="14"
          width="2"
          v-if="adminLoading"
        />
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          修改用户 {{ editingUser.name }} ({{ editingUser._id }})
        </v-card-title>
        <v-container class="px-6">
          <v-text-field
            label="新密码"
            :rules="passwordRules"
            v-model="newpassword"
            type="password"
            hide-details="auto"
            class="mb-4"
          />
          <v-btn color="primary" @click="changePassword">修改</v-btn>
          <v-btn class="mx-4" @click="dialog = false">取消</v-btn>
        </v-container>
        <v-overlay absolute :value="changing">
          <v-progress-circular indeterminate color="indigo" size="50" />
        </v-overlay>
      </v-card>
    </v-dialog>
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
  </v-card>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      expanded: [],
      headers: [
        {
          text: "用户名",
          value: "name",
          sortable: false,
        },
        {
          text: "电子邮件地址",
          value: "email",
          sortable: false,
        },
        {
          text: "邮箱已验证",
          value: "emailVerified",
          sortable: false,
        },
        {
          text: "管理员",
          value: "admin",
          sortable: false,
        },
      ],
      users: [],
      options: {},
      totalusers: 0,
      loading: true,
      adminLoading: true,
      dialog: false,
      changing: false,
      newpassword: "",
      editingUser: {
        _id: "",
        name: "",
      },
      passwordRules: [
        (value) => !!value || "必须填写",
        (value) =>
          (value && value.length >= 8 && value.length <= 20) ||
          "密码长度需为8-20",
      ],
      showalert: false,
      alerttype: "success",
      alertmsg: "",
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchUserList();
      },
      deep: true,
    },
  },
  methods: {
    fetchUserList() {
      this.loading = true;
      this.adminLoading = true;
      const { page, itemsPerPage } = this.options;
      axios
        .get("/user?limit=" + itemsPerPage + "&page=" + page)
        .then((res) => {
          if (res.data.statusCode != "200") throw new Error(res.data.error);
          if (page == 1) {
            this.totalusers = res.data.length;
          }
          this.users = res.data.data.map((user) => {
            user.admin = null;
            return user;
          });
          this.loading = false;
          return res.data.data;
        })
        .then((users) => {
          let promiseList = [];
          for (const user of users) {
            promiseList.push(axios.get("/user/" + user._id + "/permission"));
          }
          return Promise.all(promiseList);
        })
        .then((res) => {
          res.forEach((result, i) => {
            if (result.data.statusCode != "200")
              throw new Error(result.data.error);
            this.users[i].admin = result.data.data.admin;
          });
          this.adminLoading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.alerttype = "error";
          this.alertmsg = err.message;
          this.showalert = true;
        });
    },
    showDialog(item) {
      this.editingUser = item;
      this.dialog = true;
    },
    changePassword() {
      this.changing = true;
      axios
        .put("/user/" + this.editingUser._id + "/password", {
          password: this.newpassword,
        })
        .then((res) => {
          if (res.data.statusCode != "200") throw new Error(res.data.error);
          this.changing = false;
          this.newpassword = "";
          this.dialog = false;
          this.alerttype = "success";
          this.alertmsg =
            this.editingUser.name + "(" + this.editingUser._id + ") 修改成功";
          this.showalert = true;
        })
        .catch((err) => {
          this.changing = false;
          this.alerttype = "error";
          this.alertmsg =
            this.editingUser.name +
            "(" +
            this.editingUser._id +
            ") 修改失败: " +
            err.message;
          this.showalert = true;
        });
    },
    changeAdmin(item) {
      let admin = item.admin;
      item.admin = null;
      axios
        .put("/user/" + item._id + "/permission", {
          admin: admin,
        })
        .then((res) => {
          if (res.data.statusCode != "200") throw new Error(res.data.error);
          item.admin = admin;
        })
        .catch((err) => {
          this.alerttype = "error";
          this.alertmsg =
            item.name + "(" + item._id + ") 修改失败: " + err.message;
          this.showalert = true;
          item.admin = !admin;
        });
    },
    changeEmailVerified(item) {
      let emailVerified = item.emailVerified;
      item.emailVerified = null;
      axios
        .put("/user/" + item._id + "/emailstatus", {
          verified: emailVerified,
        })
        .then((res) => {
          if (res.data.statusCode != "200") throw new Error(res.data.error);
          item.emailVerified = emailVerified;
        })
        .catch((err) => {
          this.alerttype = "error";
          this.alertmsg =
            item.name + "(" + item._id + ") 修改失败: " + err.message;
          this.showalert = true;
          item.emailVerified = !emailVerified;
        });
    },
  },
  mounted: function () {
    this.fetchUserList();
  },
};
</script>