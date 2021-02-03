<template>
  <v-card class="pb-2">
    <v-card-title>访问记录</v-card-title>
    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th
              class="text-left"
              v-for="col in columns"
              :key="col.id"
              v-text="col.name"
            />
          </tr>
        </thead>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate color="indigo" size="50" />
        </v-overlay>
        <tbody>
          <tr v-for="row in data" :key="row.id">
            <td v-for="col in columns" :key="col.id" v-text="row[col.id]" />
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-pagination
      v-model="page"
      class="my-2"
      :length="maxpage"
      :total-visible="7"
    ></v-pagination>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
export default Vue.extend({
  data() {
    return {
      columns: [
        {
          id: "clientName",
          name: "服务名称",
        },
        {
          id: "clientId",
          name: "服务ID",
        },
        {
          id: "scope",
          name: "请求权限",
        },
        {
          id: "date",
          name: "时间",
        },
      ],
      page: 1,
      maxpage: 5,
      loading: true,
      data: [
        {
          id: "123",
          clientName: "testname",
          clientId: "testid",
          scope: "scopeoo",
          date: "123-123-123",
        },
      ],
      clientNameMapping: Map,
    };
  },
  methods: {
    fetchData() {
      axios
        .get("/user/accesslog?limit=10&page=" + this.page)
        .then((res) => {
          if (res.data.statusCode != "200") throw new Error("Unable to fetch");
          if (this.page == 1) {
            this.maxpage = Math.ceil((res.data.length + 9) / 10);
          }
          let fetchIdList = [],
            fetchList = [];
          this.data = res.data.data.map((item, i) => {
            const options = {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            };
            item.date = Intl.DateTimeFormat("zh", options).format(
              new Date(item.authTime * 1000)
            );
            item.id = 10 * (this.page - 1) + i;
            item.clientName = "";
            if (this.clientNameMapping[item.clientId] == null) {
              this.clientNameMapping[item.clientId] = "";
              fetchIdList.push(item.clientId);
              fetchList.push(axios.get("/client/" + item.clientId + "/name"));
            }
            return item;
          });
          fetchList.push(
            new Promise((resolve) => {
              resolve(fetchIdList);
            })
          );
          return Promise.all(fetchList);
        })
        .then((results) => {
          for (let i = 0; i < results.length - 1; i++) {
            if (results[i].data.statusCode != "200") {
              this.clientNameMapping[results[results.length - 1][i]] =
                "Error to fetch";
            } else {
              this.clientNameMapping[results[results.length - 1][i]] =
                results[i].data.data;
            }
          }
          this.data.forEach((item) => {
            item.clientName = this.clientNameMapping[item.clientId];
          });
          this.loading = false;
        });
    },
  },
  mounted: function () {
    this.fetchData();
  },
  watch: {
    page: function () {
      this.loading = true;
      this.fetchData();
    },
  },
});
</script>