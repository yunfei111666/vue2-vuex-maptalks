<!--
 * @Author: JackFly
 * @since: 2020-06-19 17:44:59
 * @lastTime: 2020-10-16 13:22:56
 * @文件相对于项目的路径: /TrunkAdmin/src/App.vue
 * @message: 
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import devArticle from "./components/dev-article.vue";
export default {
  data() {
    return {
      isLogin: false,
    };
  },
  components: {
    // devArticle
  },
  created() {
    // this.localSocket();
  },
  methods: {
    localSocket() {
      var me = this;
      if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");

        this.ws = new WebSocket(
          "ws://" + "192.168.3.164" + ":20518/api/car/get-carprofile-ws/"
        );
        this.global.setWs(this.ws);
        this.ws.onopen = function () {
          // 连接
          console.log("连接成功");
        };

        this.ws.onclose = function () {
          // 关闭 websocket
          console.log("连接已关闭...");
          setTimeout(() => {
            me.localSocket();
          }, 2000);
        };
        this.ws.onmessage = function (data) {
          // 消息
          // console.log(data);
        };
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
      }
    },
  },
};
</script>
