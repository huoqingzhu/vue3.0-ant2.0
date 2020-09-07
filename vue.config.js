const CompressionWebpackPlugin = require("compression-webpack-plugin");
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const cdn = {
  css: [],
  js: [
  ],
};
// const host = window.location.host;
console.log(IS_PRODUCTION);
const externals = {

};
module.exports = {
  devServer: {
    host: 'localhost',//target host
    port: 8080,
    open: true,
    //proxy:{'/api':{}},代理器中设置/api,项目中请求路径为/api的替换为target
    proxy: {
      '/api': {
        target: process.env.BASE_URL,//代理地址，这里设置的地址会代替axios中设置的baseURL http://123.56.85.24:5000/
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
        //ws: true, // proxy websockets
        pathRewrite: {
          '^/api': '/api'
          //pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
          //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        }
      }
    }
  },

  css: {
    modules: false,
    loaderOptions: {
      sass: {
      },
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
};
