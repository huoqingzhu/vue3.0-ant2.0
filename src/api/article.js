import request from "../utils/request.js";

// 文章列表
export function article() {
  return request({
    url: "/profile ",
    method: "get",
  });
}
// 地图列表
export function map(url = "/map",) {
  return request({
    url: url,
    method: "get",
    showLoading: false
  });
}
