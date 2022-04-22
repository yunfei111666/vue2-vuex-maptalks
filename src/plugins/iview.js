import Vue from "vue";
import ViewUI from "view-design";
import locale from "view-design/dist/locale/zh-CN";

Vue.use(ViewUI, { locale });
Vue.use(ViewUI, {
  transfer: true,
  size: "small",
  capture: false, //所有带下拉的组件是否开启 capture 模式，默认为 true。
  locale: locale,
  select: {
    arrow: "md-arrow-dropdown",
    arrowSize: 20,
  },

});
Vue.prototype.$Notice.config({
  top: 100,
  duration: 0
});

import "../iview-variables.less";
