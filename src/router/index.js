/*
 * @Author: yunfei
 * @since: 2020-06-19 17:45:00
 * @lastTime: 2021-08-11 11:02:50
 * @文件相对于项目的路径: /TrunkAdmin/src/router/index.js
 * @message:
 */
import Vue from "vue";
import VueRouter from "vue-router";
import ViewUI from "view-design";
//左侧菜单框架组件
import DevArticle from "@/components/dev-article";
//总览界面组件
import Overview from "@/views/Overview";
//车辆信息界面组件
import Vehicles from "@/views/Vehicles";
//历史查询界面组件
import HistorySearch from "@/views/HistorySearch";
//车辆运行查询界面组件
import Working from "@/views/Working";
//详情组件
import ApiMonitor from "@/views/ApiMonitor";
//登录组件
import Login from "@/components/Login";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/overview", hidden: true },

  {
    path: "/",
    name: "/",
    component: DevArticle,
    children: [
      // {
      //   path: "/dashboard",
      //   name: "Dashboard",
      //   component: () => import("../views/Dashboard.vue"),
      // },
      // {
      //   path: "/monitor",
      //   name: "Monitor",
      //   component: () => import("../views/Monitor.vue"),
      // },
      {
        path: "/overview",
        name: "Overview",
        component: Overview,
      },
      {
        path: "/vehicles",
        name: "Vehicles",
        component: Vehicles,
      },
      {
        path: "/historySearch",
        name: "HistorySearch",
        component: HistorySearch,
      },
      {
        path: "/working",
        name: "Working",
        component: Working,
      },
      {
        path: "/apimonitor",
        name: "ApiMonitor",
        component: ApiMonitor,
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  const type = to.name;
  if (type == "Login") {
    next();
  } else {
    if (sessionStorage.login) {
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach((route) => {
  ViewUI.LoadingBar.finish();
});

export default router;
