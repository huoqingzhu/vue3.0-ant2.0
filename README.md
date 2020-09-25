## vue3.0+ant desgin vue 2.0

# 一.安装 vue3.0

1.首先保证 vue cli 的版本,我的版本是@vue/cli 4.5.1 ,如果版本低需要升级一下。升级命令：yarn global add @vue/cli to update 2.创建项目：可以采用界面方式创建(在终端输入 vue ui)，也可以在命令行创建(在终端输入 vue create dome)，注意在创建项目的时候选择 3.x 版本

# 二 .安装 ant design vue 2.0

1. npm i --save ant-design-vue@next（Ant Design Vue）
2. 配置按需加载，npm install babel-plugin-import --save-dev 3.在 bable.config.js

```
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
    ]
  ],
};
```

4.我建议新建一个文件来配置需要引入那些组件,在 src 目录下新建 utils 文件，在 utils 文件下新建 ant.js，内容如下

```
import {
  Button,
} from "ant-design-vue";
const ant = {
  install(Vue) {
    Vue.component(Button.name, Button);
  },
};
export default ant;
```

5.安装 less-loader, 因为 ant 使用的是 less : npm install less less-loader --save-dev 6.在项目根目录创建 vue.cofing.js 输入下面内容：

```
module.exports = {

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

```

7.测试：在 HelloWorld.vue 写入（把介绍删了）：

```
<template>
<div class="hello">
  <h1>{{ msg }}</h1>
  <a-button type="primary">按钮</a-button>
</div>
</template>
```

你会看到一个按钮  
到此 vue3.0 和 ant design vue 2.0 的安装和配置就完了

# 三. 配置路由

1.在 router 目录下，index.js 写入下面代码

```
import { createRouter, createWebHashHistory } from 'vue-router';
// 自动加载home目录下的文件，作为 path / 的子路由
const loadRoutes = files =>
  files
    .keys()
    .reduce((arr, key) => {
      const routes = files(key).default;
      return typeof routes === "object" ? arr.concat(routes) : arr;
    }, [])
    .sort((prev, next) => (prev.sort || 0) - (next.sort || 0));
const children = loadRoutes(require.context("./home", false, /\.js$/));
// 把拿到的路由存到本地
localStorage.setItem("router", JSON.stringify(children));
let routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "首页",
      keepAlive: true,
    },
    redirect: "/home",
    component: () => import("../views/Home.vue"),
    children,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,

});
export default router;
```

2. 在 router 目录下新建 home 文件夹，在 home 文件夹新建 home.js,并创建路由对应的 vue 文件

```
export default [
  {
    path: "/home",
    name: "Home",
    component: () => import("../../views/home/index.vue"),
    meta: {
      auth: true,
      title: "首页",
      keepAlive: true,
    }
  }
];

```

3.views 下的 home.vue,改成

```
<template>
<div>
  <RouterView />
</div>
</template>

```

4.App.vue 改成

```
<template>
<div class="home">
  <!-- keep-alive要改成下面这样 -->
  <router-view v-slot="{ Component }">
    <transition>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</div>
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  top: 0;
  left: 0;
  margin: auto;
}
</style>

```

到现在路由自动加载就配置完了效果如下
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2252960ca5144758584ca9bd8c4f0e8~tplv-k3u1fbpfcp-zoom-1.image)
如果你要新增路由 router 目录下 home 文件下新建 js 文件并创建路由对应的页面即可，例如

```
export default [
  {
    path: "/map",
    name: "生命周期",
    component: () => import("../../views/Map/map.vue"),
    meta: {
      auth: true,
      title: "地图",
      keepAlive: true,
    },
  }
];

```

如果你要创建登陆页面，可以在 router 目录下，index.js 创建：

```
import { createRouter, createWebHashHistory } from 'vue-router';
// 自动加载home目录下的文件，作为 path / 的子路由
const loadRoutes = files =>
  files
    .keys()
    .reduce((arr, key) => {
      const routes = files(key).default;
      return typeof routes === "object" ? arr.concat(routes) : arr;
    }, [])
    .sort((prev, next) => (prev.sort || 0) - (next.sort || 0));
const children = loadRoutes(require.context("./home", false, /\.js$/));
// 把拿到的路由存到本地
localStorage.setItem("router", JSON.stringify(children));

let routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "首页",
      keepAlive: true,
    },
    redirect: "/home",
    component: () => import("../views/Home.vue"),
    children,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("views/user/login.vue"),
    meta: {
      title: "登陆",
      keepAlive: false,
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("views/404.vue"),
    meta: {
      title: "404",
      keepAlive: true,
    },
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,

});
export default router;

```

# 四.创建页面布局

页面布局写在 views 目录下 home.vue 里面,导航栏和底部菜单栏，都可以写在这.
如果你想采用 ant desgin vue 2.0 的导航组件，可能会和以前的有点不同  
这里我说一下踩的坑

1. Menu 组件的引入要使用 Vue.use(Menu);的使用  
   2.Icon 图标改成按需引入的方式了,这样之前的引用方式不一样

# 五。配置 axios

1.安装 npm i -s axios 2.封装 axios
在 utils 新建 request.js

```
import axios from "axios";
let baseURL = "/api/";
const service = axios.create({
  baseURL,
  timeout: 5000 // request timeout
});
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
    } else {在
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);
export default service;

```

在 vue.cofing.js 配置请求代理：

```
devServer: {
    host: 'localhost',//target host
    port: 8080,
    open: true,
    //proxy:{'/api':{}},代理器中设置/api,项目中请求路径为/api的替换为target
    proxy: {
      '/api': {
        target: "http://123.56.85.24:5000/",//代理地址，这里设置的地址会代替axios中设置的baseURL http://123.56.85.24:5000/
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
```

在 src 目录下，新建接口请求文件夹 api，新建 test.js 文件

```
import request from "../utils/request.js";

// 文章列表
export function article() {
  return request({
    url: "/profile ",
    method: "get",
  });
}
```

测试接口：

在组件中引入：

```
import {
  article
} from "../api/test.js";

  setup(props) {
    const getData = async () => {
      const data = await article();
      console.log(data);
    };
    getData();
  },

```

打开控制台会看到一个数组，表示接口访问成功。

# 六 .webpack 打包优化

目前为止，我们项目的基本配置都完成了，我们打包看一下实际项目有多大在终端输入 npm run build  
打开 dist 简介：![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1594de2d0b764ee7bb19e11607c68b1a~tplv-k3u1fbpfcp-zoom-1.image)
可以看到包的大小是 2.9MB
我们先看看看优化后的大小![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da1c456d2166453a834363ec1db7337e~tplv-k3u1fbpfcp-zoom-1.image)
优化代码如下：

```
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

```

cdn 里面并没有东西，是因为我没有找到最新的 vue 全家桶的 cdn。  
开启 gzip，服务器一定要配置 gzip，我推荐不要删除原来的文件。不删除源文件包的大小大概在 800k 左右。
