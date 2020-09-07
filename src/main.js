import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
console.log(process.env.BASE_URL)
//全局 引入 ant 组件
import ant from "./utils/ant";
createApp(App).use(store).use(router).use(ant).mount('#app')
