import { createRouter, createWebHashHistory } from 'vue-router'
import TopBar from '../components/atoms/TopBar.vue'

const routes = [
  {
    path: '/',
    name: 'TopBar',
    component: TopBar
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
