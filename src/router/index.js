import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 修复重复点击相同路由的报错问题
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
  return routerPush.call(this, location).catch(() => {})
}
// 引入vue-router
Vue.use(VueRouter)

let dashboardVue = process.env.VUE_APP_DASHBOARD
let staticRoute = [
  { name: 'dashboard', path: '/', component: () => import(`@/views/dashboard/${dashboardVue}`) },
  { name: 'map', path: '/map', component: () => import('@/views/map/index.vue') },
]
import dynamicRoute from './dynamic'

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    meta: { requiresAuth: true },
    children: [...staticRoute, ...dynamicRoute],
  },
  { path: '/map/amap', meta: { requiresAuth: true }, component: () => import('@/views/map/amap.vue') },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '*',
    component: () => import('@/views/404.vue'),
  },
]

const router = new VueRouter({
  routes,
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  const userInfo = store.getters.getUserInfo
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !userInfo) {
    store.dispatch('saveMenu', '/login')
    next('/login')
  } else {
    if (to.fullPath == '/login' && userInfo) {
      store.dispatch('saveMenu', '/')
      next('/')
    } else {
      store.dispatch('saveMenu', to.fullPath)
      next()
    }
  }
})

export default router
