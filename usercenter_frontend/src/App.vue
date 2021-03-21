<template>
  <v-app>
    <v-app-bar color="indigo" flat dark app>
      <v-app-bar-nav-icon @click="navBarIconClick">
        <template v-slot:default>
          <v-icon v-text="navBarIcon" />
        </template>
      </v-app-bar-nav-icon>
      <v-app-bar-title>Catmeow 用户中心</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-container v-for="group in enabledEntrys" :key="group.groupid">
      <v-subheader v-text="group.groupname"/>
      <v-list-item-group>
        <v-list-item
          v-for="entry in group.entrys"
          :key="entry.url"
          :to="entry.url"
          link
        >
          <v-list-item-icon>
            <v-icon v-text="entry.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ entry.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
      </v-container>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout"> 登出 </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view v-on:update-admin="updateAdmin"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
</style>

<script>
import config from './config';
import router from "./router";
export default {
  data() {
    return {
      entrys: [
        {
          groupid: "user",
          groupname: "用户",
          enabled: true,
          entrys: [
            {
              name: "用户资料",
              url: "/user/profile",
              icon: "mdi-account"
            },
            {
              name: "访问记录",
              url: "/user/accesslog",
              icon: "mdi-clipboard-text"
            },
            {
              name: "修改密码",
              url: "/user/changepassword",
              icon: "mdi-key"
            }
          ],
        },
        {
          groupid: "admin",
          groupname: "管理",
          enabled: false,
          entrys: [
            {
              name: "用户列表",
              url: "/admin/userlist",
              icon: "mdi-account-multiple"
            },
            {
              name: "OpenID 客户端列表",
              url: "/admin/clientlist",
              icon: "mdi-console"
            }
          ],
        },
      ],
      drawer: null,
      navBarIcon: "mdi-home",
    };
  },
  computed: {
    enabledEntrys: function () {
      return this.entrys.filter(function (group) {
        return group.enabled
      })
    }
  },
  methods: {
    logout: () => {
      localStorage.removeItem("token");
      window.location.href = config.backendURL + '/auth/logout'
    },
    navBarIconClick: function () {
      if (this.navBarIcon === "mdi-menu") {
        this.drawer = true;
      } else {
        router.push("/").catch(() => {});
      }
    },
    updateAdmin: function(newstatus){
      this.entrys = this.entrys.map((group) => {
        if(group.groupid == 'admin'){
          group.enabled = newstatus
        }
        return group
      })
    }
  },
  mounted: function () {
    if(localStorage['admin'] == 'true'){
      this.updateAdmin(true)
    }else{
      this.updateAdmin(false)
    }
    for (const group of this.entrys) {
      if(!group.enabled) continue
      for(const entry of group.entrys) {
        if (entry.url == router.currentRoute.path) {
          this.navBarIcon = "mdi-menu";
        }
      }
    }
    router.afterEach((to) => {
      let newIcon = "mdi-home";
      for (const group of this.entrys) {
        if(!group.enabled) continue
        for(const entry of group.entrys) {
          if (entry.url == to.path) {
            newIcon = "mdi-menu";
          }
        }
      }
      this.navBarIcon = newIcon;
    });
  },
};
</script>