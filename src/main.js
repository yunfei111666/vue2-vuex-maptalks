import Vue from "vue";
import App from "./App.vue";
import "./plugins/iview.js";
import router from "./router";
import _ from "lodash";
import './assets/iconfont/iconfont.css'
import './assets/iconfont/iconfont.js'


import VeLine from 'v-charts/lib/line.common'

Vue.component(VeLine.name, VeLine)


// 全局配置
import global from "./plugins/global";

// vuex
// import store from "./store";

// lodash
Vue.prototype._ = _;

Vue.prototype.global = global;

Vue.config.productionTip = false;
// Vue.component("dev-article", devArticle);

new Vue({
  router,
  // store,
  render: (h) => h(App),
}).$mount("#app");
