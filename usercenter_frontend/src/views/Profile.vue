<template>
  <v-card>
  <v-card-title>用户资料</v-card-title>
  <v-container class="flex-column text-center">
    <v-avatar size="100">
      <img :src="avatarUrl" v-if="avatarUrl != null" />
      <v-skeleton-loader min-width="100" min-height="100" type="image" v-if="avatarUrl == null" />
    </v-avatar>
    <h2 class="my-2 font-weight-regular text-center" v-if="username != null">{{username}}</h2>
    <v-skeleton-loader class="mx-auto my-4" type="text" max-width="200px" v-if="username == null" />
    <v-divider/>
    <v-list class="text-left">
      <v-list-item v-for="item in display" :key="item.id">
        <v-list-item-icon>
          <v-icon v-text="item.icon"/>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
          <v-list-item-subtitle v-if="item.subtitle == null">
            <v-skeleton-loader type="text" max-width="200px"/>
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="item.subtitle != null" v-text="item.subtitle" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
  </v-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import { getJWTPayload } from '../utils/auth'
import config from '../config'
import md5 from 'md5'
export default Vue.extend({
  data () {
    return {
      avatarUrl: null,
      username: null,
      display: [
        {
          id: 'email',
          icon: 'mdi-email',
          title: '电子邮件地址',
          subtitle: null
        },
        {
          id: 'email_verified',
          icon: 'mdi-check',
          title: '邮箱验证状态',
          subtitle: null
        },
        {
          id: 'lastlogin',
          icon: 'mdi-clock',
          title: '上次登录',
          subtitle: null
        }
      ]
    }
  },
  methods: {
    setDisplaySubtitle: function (id, subtitle) {
      this.display = this.display.map(item => {
        if(item.id == id){
          item.subtitle = subtitle
        }
        return item
      })
    }
  },
  mounted: function () {
    axios.get('/user/accesslog?limit=1&page=1').then(res => {
      if(res.data.statusCode != '200') throw new Error("Unable to fetch");
      if(res.data.data.length == 0) this.setDisplaySubtitle('lastlogin', '无')
      return res.data.data[0]
    }).then(lastlogin => Promise.all([
      axios.get('/client/'+lastlogin.clientId+'/name'),
      new Promise((resolve) => {
        resolve(lastlogin)
      })
    ])).then(results => {
      const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric'
      }
      const date = Intl.DateTimeFormat('zh',options).format(new Date(results[1].authTime*1000))
      const clientName = results[0].data.data
      this.setDisplaySubtitle('lastlogin',date+" 在 "+clientName)
    })

    let payload = getJWTPayload(localStorage['token'])
    this.username = payload.name
    this.avatarUrl = config.gravatarURL + md5(payload.email) + '?s=100&d=identicon'
    this.display = this.display.map(item => {
      switch(item.id){
        case 'email':
          item.subtitle = payload.email
          break;
        case 'email_verified':
          item.subtitle = payload.email_verified ? "已验证" : "未验证"
          break;
      }
      return item
    })
  }
})
</script>
