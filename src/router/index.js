import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('components/Login.vue');
const Home = () => import('components/Home.vue');
const Welcome = () => import('components/children/Welcome.vue');
const User = () => import('components/children/User.vue');
const Role = () => import('components/children/Role.vue');
const Right = () => import('components/children/Right.vue');
const Goods = () => import('components/children/Goods.vue');
const Param = () => import('components/children/Param.vue');
const Category = () => import('components/children/Category.vue');
const Order = () => import('components/children/Order.vue');
const Report = () => import('components/children/Report.vue');

const routes = [
  {
    path: '/',
    redirect: { name: 'login' }
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
  {
    name: 'home',
    path: '/home',
    component: Home,
    redirect: {
      name: 'welcome'
    },
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        component: Welcome
      },
      {
        name: 'user',
        path: '/users',
        component: User
      },
      {
        name: 'role',
        path: '/roles',
        component: Role
      },
      {
        name: 'right',
        path: '/rights',
        component: Right
      },
      {
        name: 'goods',
        path: '/goods',
        component: Goods
      },
      {
        name: 'param',
        path: '/params',
        component: Param
      },
      {
        name: "category",
        path: '/categories',
        component: Category
      },
      {
        name: "order",
        path: '/orders',
        component: Order
      },
      {
        name: "report",
        path: '/reports',
        component: Report
      },
    ],
    beforeEnter(to, from, next) {

      console.log(to);
      if (window.sessionStorage.getItem('TOKEN')) {
        next(true);
      } else {
        next({
          name: 'login'
        });
      }
    },
  },
]

const router = new VueRouter({
  routes
})

export default router
