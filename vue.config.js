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


  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  indexPath: "index.html",
  productionSourceMap: false, // 关闭sourceMap
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
  lintOnSave: false,
  configureWebpack: {
    // Webpack配置
    devtool: "none", // webpack内关闭sourceMap
    optimization: {
      // 优化配置
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          // 拆分Vue
          vue: {
            test: /[\\/]node_modules[\\/]vue[\\/]/,
            name: "chunk-vue",
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve("src"), // 主目录
        "views": resolve("src/views"), // 页面
        'components': resolve("src/components"), // 组件
        'api': resolve("src/api"), // 接口
        'utils': resolve("src/utils"), // 通用功能
        'assets': resolve("src/assets"), // 静态资源
        'style': resolve("src/style"), // 通用样式
      },
    },
  },
  chainWebpack(config) {
    if (IS_PRODUCTION) {
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        return args;
      });
      config.externals(externals);
      config.plugin("html").tap(args => {
        args[0].minify.minifyCSS = true;
        return args;
      });
      // gzip需要nginx进行配合
      config
        .plugin("compression")
        .use(CompressionWebpackPlugin)
        .tap(() => [
          {
            test: /\.js$|\.html$|\.css/, // 匹配文件名
            threshold: 10240, // 超过10k进行压缩
            deleteOriginalAssets: false, // 是否删除源文件
          }
        ]);
    }
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: !!IS_PRODUCTION,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    // 启用 CSS modules for all css / pre-processor files.
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
