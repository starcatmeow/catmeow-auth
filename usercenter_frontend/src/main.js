import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import axios from 'axios';
import config from './config';

Vue.config.productionTip = false
axios.defaults.baseURL = config.backendURL
if(localStorage['token'] != null){
  axios.defaults.headers.common['Authorization'] = 
    'Bearer ' + localStorage['token']
}
new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
