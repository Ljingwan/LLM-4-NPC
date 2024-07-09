import { createRouter, createWebHistory } from "vue-router";
import IndexView from "../views/index/IndexView.vue";
import HomeView from "../views/home/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: IndexView,
      redirect: "home",
      children: [{ path: "home", name: "home", component: HomeView }],
    },
  ],
});

export default router;
