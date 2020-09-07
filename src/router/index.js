import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]
const router = createRouter({
  history: createWebHashHistory(),//hash模式//createWebHistory(process.env.BASE_URL) 历史模式
  routes
})
function newFunction() {
  localStorage.setItem("router", JSON.stringify(children));
}

export default router
