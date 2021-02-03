<template>
    <v-card>
        <v-card-title>注册</v-card-title>
        <v-container class="px-4 my-0">
        <v-text-field
            label="电子邮件地址"
            :rules="emailRules"
            v-model="email"
            hide-details="auto"
        />
        <v-text-field
            label="用户名"
            :rules="nameRules"
            v-model="name"
            hide-details="auto"
        />
        <v-text-field
            label="密码"
            :rules="passwordRules"
            v-model="password"
            type="password"
            hide-details="auto"
        />
        <v-text-field
            label="确认密码"
            :rules="confirmRules"
            v-model="confirmpassword"
            type="password"
            hide-details="auto"
        />
        <v-btn
            :disabled="!valid"
            color="primary"
            class="my-4"
            @click="register"
            block>
            注册
        </v-btn>
        <v-alert dismissible dense
            v-model="showalert"
            :type="alerttype"
            v-text="alertmsg"
            transition="scroll-y-transition"
        />
        <v-overlay
            absolute
            :value="loading"
        >
            <v-progress-circular indeterminate
                color="indigo"
                size="50" />
        </v-overlay>
        </v-container>
    </v-card>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return {
            email: '',
            name: '',
            password: '',
            confirmpassword: '',
            emailRules: [
                value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || '电子邮件地址无效'
                },
            ],
            nameRules: [
                value => {
                    const pattern = /([0-9]|[a-z]){4,20}$/
                    return pattern.test(value) || '用户名长度需为4-20'
                }
            ],
            passwordRules: [
                value => !!value || '必须填写',
                value => (value && value.length >= 8 && value.length <= 20) || '密码长度需为8-20',
            ],
            confirmRules: [
                value => value == this.password || '两次密码不匹配'
            ],
            loading: false,
            showalert: false,
            alerttype: 'success',
            alertmsg: ''
        }
    },
    computed: {
        valid: function(){
            let result = true
            this.emailRules.forEach(rule => {
                if(rule(this.email) !== true) result = false
            })
            this.nameRules.forEach(rule => {
                if(rule(this.name) !== true) result = false
            })
            this.passwordRules.forEach(rule => {
                if(rule(this.password) !== true) result = false
            })
            this.confirmRules.forEach(rule => {
                if(rule(this.confirmpassword) !== true) result = false
            })
            return result
        }
    },
    methods: {
        register: function () {
            this.loading = true
            axios.post('/user/register',{
                email: this.email,
                name: this.name,
                password: this.password
            })
            .then(res => {
                if(res.data.statusCode != '200')throw new Error(res.data.error)
                this.alertmsg = '注册成功，请验证电子邮件地址'
                this.alerttype = 'success'
                this.showalert = true
                this.loading = false
            })
            .catch(err => {
                this.alertmsg = err.message
                this.alerttype = 'error'
                this.showalert = true
                this.loading = false
            })
        }
    }
}
</script>