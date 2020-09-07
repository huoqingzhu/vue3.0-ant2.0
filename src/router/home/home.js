export default [
  {
    path: "/home",
    name: "Home",
    component: () => import("../../views/home/home.vue"),
    meta: {
      auth: true,
      title: "首页",
      keepAlive: true,
      iocn: "AppstoreOutlined",
    }
  }
];
