<template>
    <v-card>
        <v-card-title>邮箱验证</v-card-title>
        <v-container class="px-4 my-0 text-center">
        <v-progress-circular indeterminate
            color="indigo"
            size="50"
            v-if="loading"/>
        <v-alert :type="alerttype" v-text="alertmsg" v-if="showalert"/>
        </v-container>
    </v-card>
</template>
<script>
import config from '../config'
import axios from 'axios'
export default {
    props: {
        token: {
            type: String
        }
    },
    data(){
        return {
            loading: false,
            showalert: false,
            alerttype: 'success',
            alertmsg: ''
        }
    },
    mounted: function(){
        this.loading = true
        if(this.token == null){
            this.alerttype = "error"
            this.alertmsg = "无效 Token"
            this.loading = false
            this.showalert = true
            return
        }
        axios.get('/user/emailchallenge?token='+this.token)
        .then( res => {
            if(res.data.statusCode != '200')throw new Error(res.data.error)
            this.alerttype = "success"
            this.alertmsg = "验证成功，3 秒后自动跳转至登录页"
            setInterval(function(){
                window.location.href = config.backendURL + '/auth/login'
            },3000)
        })
        .catch( err => {
            this.alerttype = "error"
            this.alertmsg = err.message
        })
        .then(() => {
            this.loading = false
            this.showalert = true
        })
    }
}
</script>