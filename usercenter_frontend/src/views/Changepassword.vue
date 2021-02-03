<template>
    <v-card>
        <v-card-title>修改密码</v-card-title>
        <v-container class="px-4 my-0">
        <v-form>
        <v-text-field
            label="旧密码"
            :rules="passwordRules"
            type="password"
            v-model="oldpassword"
            hide-details="auto"
        />
        <v-text-field
            label="新密码"
            :rules="passwordRules"
            type="password"
            v-model="newpassword"
            hide-details="auto"
        />
        <v-text-field
            label="确认新密码"
            :rules="confirmRules"
            type="password"
            v-model="confirmpassword"
            hide-details="auto"
        />
        </v-form>
        <v-btn
            :disabled="!valid"
            color="indigo"
            class="my-4"
            @click="change"
            block>
            修改
        </v-btn>
        <v-alert dismissible dense v-model="showalert" :type="alerttype" v-text="alertmsg" transition="scroll-y-transition"/>
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
import Vue from 'vue'
import axios from 'axios'
export default Vue.extend({
    data () {
        return {
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
            passwordRules: [
                value => !!value || '必须填写',
                value => (value && value.length >= 8 && value.length <= 20) || '密码长度需为8-20',
            ],
            confirmRules: [
                value => value == this.newpassword || '两次密码不匹配'
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
            this.passwordRules.forEach(rule => {
                if(rule(this.oldpassword) !== true) result = false
                if(rule(this.newpassword) !== true) result = false
            })
            this.confirmRules.forEach(rule => {
                if(rule(this.confirmpassword) !== true) result = false
            })
            return result
        }
    },
    methods: {
        change() {
            this.loading = true
            axios.put('/user/password',{
                oldpassword: this.oldpassword,
                newpassword: this.newpassword
            }).then(res => {
                if(res.data.statusCode != '200')throw new Error(res.data.error)
                this.oldpassword = this.newpassword = this.confirmpassword = ""
                this.alertmsg = '修改成功'
                this.alerttype = 'success'
                this.showalert = true
                this.loading = false
            }).catch(err => {
                this.alertmsg = err.message
                this.alerttype = 'error'
                this.showalert = true
                this.loading = false
            })
        }
    }
})
</script>