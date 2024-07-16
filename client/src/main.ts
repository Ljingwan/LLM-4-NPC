import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persistedstate";

const app = createApp(App);
// 实例化 Pinia
const pinia = createPinia();
app
  .use(ElementPlus)
  .use(pinia.use(piniaPluginPersist))
  .use(router)
  .mount("#app");

//全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
