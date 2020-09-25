import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 修改全局样式
import "@/style/ant.scss";
//全局 引入 ant 组件
import ant from "./utils/ant";
import 'default-passive-events'
createApp(App).use(store).use(router).use(ant).mount('#app')
