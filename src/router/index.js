import { createRouter, createWebHashHistory } from 'vue-router';
// 自动加载home目录下的文件，作为 path / 的子路由
const loadRoutes = files =>
  files
    .keys()
    .reduce((arr, key) => {
      const routes = files(key).default;
      return typeof routes === "object" ? arr.concat(routes) : arr;
    }, [])
    .sort((prev, next) => (prev.sort || 0) - (next.sort || 0));
const children = loadRoutes(require.context("./home", false, /\.js$/));
// 把拿到的路由存到本地
localStorage.setItem("router", JSON.stringify(children));

let routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "首页",
      keepAlive: true,
    },
    redirect: "/home",
    component: () => import("../views/Home.vue"),
    children,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("views/user/login.vue"),
    meta: {
      title: "登陆",
      keepAlive: false,
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("views/404.vue"),
    meta: {
      title: "404",
      keepAlive: true,
    },
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,

});
export default router;
