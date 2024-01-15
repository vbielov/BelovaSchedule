import { createRouter, createWebHistory } from "vue-router"
import MainView from "../views/MainView.vue"
import StaffView from "../views/StaffView.vue"
import LoginView from "../views/LoginView.vue"

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
    },
    {
      path: "/login",
      name: "login",
      component: LoginView
    }
  ]
})

export default router
