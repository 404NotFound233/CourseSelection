import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/authorization/Login.vue')
const Signin = () => import('../views/authorization/Signin.vue')
const Page401 = () => import('../views/authorization/Page401.vue')
const Page404 = () => import('../views/authorization/Page404.vue')
const ValidateEmail = () => import('../views/authorization/ValidateEmail.vue')
const Home = () => import('../views/home/Home.vue')
const Choice = () => import('../views/home/Choice.vue')
const Course = () => import('../views/home/Course.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/course',
    name: 'course',
    component: Course
  },
  {
    path: '/choice',
    name: 'choice',
    component: Choice
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
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
    path: '/validateEmail',
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
