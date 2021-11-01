import { createRouter, createWebHashHistory } from 'vue-router'
import Base from '../components/Base.vue'
import LandingPage from '../components/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Base',
    component: Base
  },
  {
    path: '/landing/',
    name: 'LandingPage',
    component: LandingPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
