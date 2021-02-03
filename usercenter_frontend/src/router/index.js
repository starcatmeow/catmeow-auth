import Vue from 'vue'
import VueRouter from 'vue-router'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import NotFound from '../views/NotFound.vue'
const Accesslog = () => import(/* webpackChunkName: "email-challenge" */ '../views/Accesslog.vue')
const Changepassword = () => import(/* webpackChunkName: "user-advanced-view" */ '../views/Changepassword.vue')
const EmailChallenge = () => import(/* webpackChunkName: "user-advanced-view" */ '../views/EmailChallenge.vue')
const UserList = () => import(/* webpackChunkName: "admin-view" */ '../views/UserList.vue')
const ClientList = () => import(/* webpackChunkName: "admin-view" */ '../views/ClientList.vue')
import { isAuthenticated } from '../utils/auth.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/'
  },
  {
    path: '/auth/login',
    component: Login
  },
  {
    path: '/auth/register',
    component: Register
  },
  {
    path: '/auth/callback',
    component: Login,
    props: (route) => ({ code: route.query.code })
  },
  {
    path: '/user/profile',
    meta: {auth: true, permission: 'user'},
    component: Profile
  },
  {
    path: '/user/accesslog',
    meta: {auth: true, permission: 'user'},
    component: Accesslog
  },
  {
    path: '/user/changepassword',
    meta: {auth: true, permission: 'user'},
    component: Changepassword
  },
  {
    path: '/user/emailchallenge',
    component: EmailChallenge,
    props: (route) => ({ token: route.query.token })
  },
  {
    path: '/admin/userlist',
    component: UserList
  },
  {
    path: '/admin/clientlist',
    component: ClientList
  },
  {
    path: '*',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path==='/'){
    if(isAuthenticated()){
      return next(from.path !== '/user/profile' ? '/user/profile' : false)
    }
    return next(from.path !== '/auth/login' ? '/auth/login' : false)
  }else if(to.matched.some(record => record.meta.auth)) {
    if(!isAuthenticated()){
      return next(from.path !== '/auth/login' ? '/auth/login' : false)
    }else{
      return next()
    }
  }else next()
})

export default router
