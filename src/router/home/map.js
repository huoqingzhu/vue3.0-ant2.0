export default [
  {
    path: "/map",
    name: "列表",
    component: () => import("../../views/Map/map.vue"),
    meta: {
      auth: true,
      title: "地图",
      iocn: "MailOutlined",
      keepAlive: true,
    },
  }
];
