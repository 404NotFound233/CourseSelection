import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/authorization/Login.vue')
const Signin = () => import('../views/authorization/Signin.vue')
const Page401 = () => import('../views/authorization/Page401.vue')
const Page404 = () => import('../views/authorization/Page404.vue')
const ValidateEmail = () => import('../views/authorization/ValidateEmail.vue')
const Home = () => import('../views/home/Home.vue')
const Activity = () => import('../views/home/Activity.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/act',
    component: Activity
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },  {
    path: '/signin',
    name: 'signin',
    component: Signin
  },
  {
    path: '/unauthenticated',
    name: 'unauthenticated',
    component: Page401
  },
  {
    path: '/validate',
    component: ValidateEmail
  },
  {
    path: '/notfound',
    name: 'notfound',
    component: Page404
  },
  {
    path: '/(.+)',
    redirect: '/notfound'
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
