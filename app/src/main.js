import App from "./App.vue";
import { createApp } from "vue";
import router from "./router";
import store from "./store";
import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(store);
app.use(Vue3Toasity, {
  autoClose: 3000,
  theme: "colored",
  transition: "flip",
  closeButton: false,
});

app.mount("#app");
