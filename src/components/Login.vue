<template>
  <div class="wp">
    <div class="logo">
      <span
        class="iconfont icontrunk-03"
        style="font-size: 92px; color: white"
      ></span>
    </div>
    <div id="polina">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem class="title">账号密码登录</FormItem>
        <FormItem prop="user">
          <i-Input
            type="text"
            size="large"
            v-model="formInline.user"
            placeholder="Username"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <FormItem prop="password">
          <i-Input
            type="password"
            size="large"
            v-model="formInline.password"
            placeholder="Password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-Input>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            size="large"
            v-on:keyup.enter="alert(1)"
            @click="init('formInline')"
            >登录</Button
          >
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import $ from "../libs/utils.js";
export default {
  name: "login",
  data() {
    return {
      formInline: {
        user: "",
        password: "",
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 5,
            message: "请输入正确的账号密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    localStorage.login = "";
    // 回车事件
    var me = this;
    document.onkeydown = function (e) {
      var key = window.event.keyCode;
      if (key == 13) {
        me.init("formInline");
      }
    };
  },
  mounted() {},
  methods: {
    init(name) {
      $.ajax({
        url: "/api/login",
        method: "post",
        data: {
          username: this.formInline.user,
          password: this.formInline.password,
        },
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          sessionStorage.login = "admin";
          this.$Message.success(res.message);
          this.$router.push("/");
        } else {
          this.$Message.error(res.message);
        }
      });
      // this.$refs[name].validate((valid) => {
      //   sessionStorage.login = "admin";
      //   if (valid) {
      //     this.$Message.success("Success!");
      //     setTimeout(() => {
      //       localStorage.login = 1;
      //       this.$router.push("/");
      //     }, 1000);
      //   } else {
      //     this.$Message.error("Fail!");
      //   }
      // });
    },
  },
};
</script>

<style lang="less" scoped>
.wp {
  height: 100%;
  position: relative;
  background: url("../assets/login1.png") no-repeat;
  background-size: 100% 100%;
}
.title {
  width: 96px;
  height: 24px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 24px;
}
video {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -100;
  transform: translateX(-50%) translateY(-50%);
  background: url("../assets/background.png") no-repeat;
  background-size: cover;
  transition: 1s opacity;
}
.stopfade {
  opacity: 0.5;
}
.logo {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -250px 0 0 -225px;
}
#polina {
  background: rgba(255, 255, 255, 0.7);
  width: 466px;
  height: 365px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 2rem;
  margin: 2rem;
  font-size: 1.2rem;
  box-shadow: 0px 2px 4px 0px rgba(186, 186, 186, 0.5);
  border-radius: 8px;
  margin: -112px 0 0 -233px;
}
h1 {
  font-size: 3rem;
  text-transform: uppercase;
  margin-top: 0;
  letter-spacing: 0.3rem;
  margin-bottom: 50px;
}
h1 img {
  width: 435px;
}
#polina button {
  display: block;
  width: 100%;
  border: none;
  // background: rgba(255, 255, 255, 0.23);
  color: #fff;
  border-radius: 3px;
  transition: 0.3s background;
  margin-top: 2rem;
}
#polina button:hover {
  background: rgba(24, 144, 255, 0.7);
}

.ivu-input {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

a {
  display: inline-block;
  color: #fff;
  text-decoration: none;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem;
  transition: 0.6s background;
}
a:hover {
  background: rgba(0, 0, 0, 0.9);
}
@media screen and (max-width: 500px) {
  div {
    width: 70%;
  }
}
</style>