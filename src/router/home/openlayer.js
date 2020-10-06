export default [
  {
    path: "/draw",
    name: "绘制地图",
    component: () => import("../../views/openlayer/index.vue"),
    meta: {
      auth: true,
      title: "地图",
      iocn: "MailOutlined",
      keepAlive: true,
    },
  }
];
