import { createRouter, createWebHashHistory } from 'vue-router'
import Base from '../components/Base.vue'

const routes = [
  {
    path: '/',
    name: 'Base',
    component: Base
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
