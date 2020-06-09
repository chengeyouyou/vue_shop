import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

Vue.use(VueRouter)

const login = () => import('components/Login.vue');
const Home = () => import('components/Home.vue');

const routes = [
  {
    path:'/',
    redirect:{name:'login'}
  },
  {
    name:'login',
    path: '/login',
    component: login,
  },
  {
    name:'home',
    path: '/home',
    component: Home,
    beforeEnter(to, from, next){
      if(window.sessionStorage.getItem('TOKEN')){
        next(true);
      }else{
        next(false)
      }
     
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
