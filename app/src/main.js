import App from "./App.vue";
import { createApp } from "vue";
import router from "./router";
import store from "./store";
import Vue3Toasity from "vue3-toastify";

import "./scss/styles.scss";
import "vue3-toastify/dist/index.css";
import "./assets/main.css";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as Icons from "oh-vue-icons/icons";
import * as bootstrap from "bootstrap";

const app = createApp(App);

app.component("v-icon", OhVueIcon);
const Icon = Object.values({ ...Icons });
addIcons(...Icon);

app.use(router);
app.use(store);
app.use(Vue3Toasity, {
  autoClose: 3000,
  theme: "colored",
  transition: "flip",
  closeButton: false,
});

app.mount("#app");
