import { createRouter, createWebHistory } from "vue-router";
import ErrorPage from "./components/views/Error.vue";

import Home from "./components/views/Home.vue";
import Login from "./components/views/Login.vue";
import Join from "./components/views/Join.vue";

import SingleGame from "./components/views/SingleGame.vue";
import MultiGame from "./components/views/MultiGame.vue";
import GameRooms from "./components/views/GameRooms.vue";
import Test from "./components/views/Test.vue";
import Test2 from "./components/views/Test2.vue";
import Test3 from "./components/views/Test3.vue";
import store from "./store"; // Vuex 스토어 import
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/join",
      component: Join,
    },
    {
      path: "/singleGame",
      component: SingleGame,
      meta: { requiresAuth: true },
    },
    {
      path: "/multiGame/room/:roomId",
      component: MultiGame,
      meta: { requiresAuth: true },
    },
    {
      path: "/gameRooms",
      component: GameRooms,
      meta: { requiresAuth: true },
    },
    {
      path: "/test",
      component: Test,
    },
    {
      path: "/test2",
      component: Test2,
    },
    {
      path: "/test3",
      component: Test3,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "error",
      component: ErrorPage,
      query: { errorCode: "404", errorMessage: "페이지를 찾을 수 없습니다." },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    try {
      await store.dispatch("checkAuth"); // Vuex 스토어에서 로그인 상태 확인
      next(); // 인증이 되었으면 다음 단계로 진행
    } catch (error) {
      alert("로그인이 필요합니다.");
      next("/login"); // 로그인 페이지로 리디렉션
    }
  } else {
    next(); // 인증이 필요하지 않은 경우 그냥 진행
  }
});
export default router;
