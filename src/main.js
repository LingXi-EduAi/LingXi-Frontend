import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import axios from 'axios';
import { BASE_API } from './config/api';
import { autoMigrate } from './utils/tokenMigration';

// 使用配置文件中的 BASE_API
axios.defaults.baseURL = BASE_API;

// 自动迁移旧的authToken到新的token格式
autoMigrate();

const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");
