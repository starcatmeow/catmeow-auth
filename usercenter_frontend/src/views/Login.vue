<template>
    <v-card>
        <v-card-title>
            未登录
        </v-card-title>
        <v-card-text>
            您必须登录后才能使用 Catmeow 用户中心
        </v-card-text>
        <v-card-actions>
           <v-btn text color="primary accent-4" @click="login">
               使用 Catmeow 登录
           </v-btn>
           <v-btn text color="primary accent-4" @click="register">
               注册账户
           </v-btn>
        </v-card-actions>
        <v-overlay
            absolute
            :value="loading"
        >
            <v-progress-circular indeterminate
                color="indigo"
                size="50" />
        </v-overlay>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '../config'
import axios from 'axios'
import { isAuthenticated } from '../utils/auth'
import router from '../router'
export default Vue.extend({
    props: {
        code: {
            type: String
        }
    },
    methods: {
        login: function() {
            window.location.href = config.backendURL + '/auth/login'
        },
        register: function() {
            router.push('/auth/register').catch(()=>{})
        }
    },
    data(){
        return {
            loading: false
        }
    },
    mounted: function() {
        if(isAuthenticated()){
            router.push('/user/profile').catch(()=>{})
            return
        }
        if(this.code == null) return
        this.loading = true
        axios.get('/auth/callback?code='+this.code)
        .then(res => {
            if(res.data.statusCode != "200"){
                throw res.data
            }
            return res.data.data.jwt
        })
        .then(jwt => {
            localStorage.setItem('token',jwt)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
        })
        .then(() => axios.get('/admin/check'))
        .then(res => {
            if(res.data.statusCode == '200'){
                this.$emit('update-admin', true)
                localStorage.setItem('admin', 'true')
            }else throw new Error('NO_ADMIN_PERMISSION')
        })
        .catch(() => {
            this.$emit('update-admin',false)
            localStorage.setItem('admin', 'false')
        })
        .then(() => {
            this.loading = false
            router.push('/user/profile').catch(()=>{})
        })
    }
})
</script>