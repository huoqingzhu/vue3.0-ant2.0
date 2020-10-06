export default [
  {
    path: "/home",
    name: "首页",
    component: () => import("../../views/home/index.vue"),
    meta: {
      auth: true,
      title: "首页",
      keepAlive: true,
      iocn: "AppstoreOutlined",
    }
  }
];
