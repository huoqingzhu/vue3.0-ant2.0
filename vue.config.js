

const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const port = process.env.port || process.env.npm_config_port || 8888;
const name = "Blog"; // page title
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const webpack = require('webpack');
const cdn = {
  css: [],
  js: [
    // "https://cdn.bootcss.com/vue/2.6.11/vue.min.js",
    // "https://cdn.bootcss.com/vue-router/3.2.0/vue-router.min.js",
    // "https://cdn.bootcss.com/vuex/3.4.0/vuex.min.js",
    // "https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js",
  ],
};
// const host = window.location.host;
const externals = {
  // vue: "Vue",
  // "vue-router": "VueRouter",
  // vuex: "Vuex",
  // axios: "axios",
};

function resolve(dir) {
  return path.join(__dirname, dir);
}
console.log(IS_PRODUCTION);
module.exports = {
  publicPath: IS_PRODUCTION ? "./" : "./",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port,
    open: true,
    //proxy:{'/api':{}},代理器中设置/api,项目中请求路径为/api的替换为target
    proxy: {
      '/api': {
        target: "http://localhost:8080",//代理地址，这里设置的地址会代替axios中设置的baseURL http://123.56.85.24:5000/process.env.BASE_URL
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
  configureWebpack: {
    name,
    resolve: {
      alias: {
        "@": resolve("src"), // 主目录
        views: resolve("src/views"), // 页面
        components: resolve("src/components"), // 组件
        api: resolve("src/api"), // 接口
        utils: resolve("src/utils"), // 通用功能
        assets: resolve("src/assets"), // 静态资源
        style: resolve("src/style"), // 通用样式
      },
    },
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    // set preserveWhitespace
    // config.module
    //   .rule("vue")
    //   .use("vue-loader")
    //   .loader("vue-loader")
    //   .tap(options => {
    //     options.compilerOptions.preserveWhitespace = true;
    //     return options;
    //   })
    //   .end();
    config
      .plugin('ignore')
      // 忽略/moment/locale下的所有文件
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );


    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
    if (IS_PRODUCTION) {
      // config.plugin('analyzer').use(BundleAnalyzerPlugin)
      config.plugin("html").tap(args => {
        args[0].cdn = cdn;
        return args;
      });
      config.externals(externals);
      config.plugin("html").tap(args => {
        args[0].minify.minifyCSS = true; // 压缩html中的css
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
