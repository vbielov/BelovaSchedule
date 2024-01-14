import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import StaffView from '../views/StaffView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "mainView",
      component: MainView
    },
    {
      path: "/team-schedule",
      name: "team-schedule",
      component: StaffView
    }
  ]
})

export default router
