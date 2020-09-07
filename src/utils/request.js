import axios from "axios";
function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
let baseURL = "/api/";
if (getQueryString("ip") == 1) {
  baseURL = "http://123.56.85.24:5000/api/";
} else if (getQueryString("ip") == 2) {
  baseURL = "http://ddc.lycent.cn/api";
} else {
  baseURL = "/api/";
}
const service = axios.create({
  baseURL,
  timeout: 5000 // request timeout
});
console.log(baseURL)
// 发起请求之前的拦截器
service.interceptors.request.use(
  config => {
    // 如果有token 就携带tokon
    let token = window.localStorage.getItem("accessToken");
    if (token) {
      config.headers.common.Authorization = token;
    }
    return config;
  },
  error => Promise.reject(error)
);
// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;

    if (response.status !== 200) {
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);
export default service;
