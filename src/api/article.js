import request from "../utils/request.js";

// 文章列表
export function article() {
  return request({
    url: "/profile ",
    method: "get",
  });
}
