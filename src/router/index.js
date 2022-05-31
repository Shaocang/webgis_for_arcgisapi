import Vue from 'vue'
import VueRouter from 'vue-router'
import MapView from 'views/MapView.vue'

// 配置重复点击报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/onemap'
  },
  {
    path: '/onemap',
    name: 'onemap',
    component: MapView,
  },
  {
    path:'/homescreen',
    name: 'homescreen',
    component: () => import('views/HomeScreen.vue')
  },
  {
    path: '/multiscreen',
    name: 'multiscreen',
    component: () => import('views/MultiScreen.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
