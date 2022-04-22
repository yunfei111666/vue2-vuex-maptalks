<template>
  <Layout>
    <Sider
      class="sider"
      width="360"
      v-model="isClose"
      collapsible
      :collapsed-width="64"
    >
      <MenuItem name="/dashboard">
        <img
          src="../assets/logo.png"
          alt="logo"
          v-show="!this.isClose"
          class="logo"
        />
        <!-- <h1 v-show="!this.isClose" class="logo">
          <img src="../assets/logo.jpg" />
          <div class="logoName">舟山甬舟集装箱码头有限公司</div>
        </h1> -->
        <div v-show="this.isClose" class="t">T</div>
      </MenuItem>
      <Menu
        theme="dark"
        width="auto"
        :open-names="['1', '2']"
        :active-name="activeName"
        :class="{ 'sider-hide': isClose }"
      >
        <!-- <Submenu name="1">
          <template slot="title">
            <span
              class="iconfont iconjiankongguanli"
              style="margin-right: 5px; font-size: 14px"
            ></span>
            <span>监控管理</span>
          </template>
          <MenuItem name="/monitor" to="/Monitor">
            <div
              class="iconfont iconshishijiankong"
              style="margin-right: 5px; font-size: 14px; display: inline-block"
            ></div>
            <span>实时监控</span></MenuItem
          >
        </Submenu> -->
        <Submenu name="2">
          <template slot="title">
            <span
              class="iconfont iconcheliangguanli"
              style="margin-right: 5px; font-size: 14px"
            ></span>
            <span>车辆管理</span>
          </template>
          <MenuItem name="/overview" to="/overview">
            <div
              class="iconfont iconcheliangguanli"
              style="margin-right: 5px; font-size: 14px; display: inline-block"
            ></div>
            <span>总览</span></MenuItem
          >
          <MenuItem name="/vehicles" to="/vehicles">
            <div
              class="iconfont iconcheliangxinxi1"
              style="margin-right: 5px; font-size: 14px; display: inline-block"
            ></div>
            <span>车辆信息</span></MenuItem
          >
          <MenuItem name="/historySearch" to="/historySearch">
            <div
              class="iconfont iconlishichaxun"
              style="margin-right: 5px; font-size: 14px; display: inline-block"
            ></div>
            <span>历史查询</span></MenuItem
          >
          <!-- <MenuItem name="/working" to="/working">
            <span>车辆运行查询</span></MenuItem
          > -->
        </Submenu>
      </Menu>
    </Sider>
    <Layout>
      <Header class="header">
        <div style="float: right; position: relative" class="menuIcon">
          <Dropdown>
            <Icon type="md-person" style="margin-right: 50px" />
            <span style="position: absolute; top: 0px; right: 0px">admin</span>
            <DropdownMenu slot="list">
              <DropdownItem>
                <p @click="logOut">退出</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Header>
      <Content class="content" :class="{ 'content-close': isClose }">
        <router-view />
      </Content>
      <Footer style="padding-top: 10px"
        >©2019 北京主线科技有限公司 京ICP备19025226号-1</Footer
      >
    </Layout>
    <!-- <Drawer width="500" title="Ajax接口统计" :closable="true" v-model="logs">
      <template slot="close">
        <Button to="/apimonitor">
          <Icon size="20" type="ios-list" />
          详情
        </Button>
      </template>

      <Card style="margin-bottom: 20px">
        <ChartColumn :column="columnData" :type="1"></ChartColumn>
      </Card>

      <Card>
        <ChartPie :pie="pieData" :type="1"></ChartPie>
      </Card>
    </Drawer> -->
  </Layout>
</template>

<script>
// import ChartPie from "./charts/Chart-pie.vue";
// import ChartColumn from "./charts/Chart-column.vue";
export default {
  name: "",
  data() {
    return {
      activeName: this.$route.path,
      isClose: true,
      logs: false,
      // pieData: [
      //   { type: "正常", value: 19 },
      //   { type: "异常", value: 10 },
      // ],
      // columnData: [
      //   { type: "get", value: 16 },
      //   { type: "post", value: 15 },
      //   { type: "put", value: 24 },
      //   { type: "delete", value: 10 },
      // ],
    };
  },
  computed: {
    menuitemClasses: function() {
      return ["menu-item", this.isClose ? "collapsed-menu" : ""];
    },
  },
  // components: {
  //   ChartPie,
  //   ChartColumn,
  // },
  methods: {
    logOut() {
      sessionStorage.login = "";
      this.$router.push("/login");
    },
  },
  created() {},
  mounted() {
    // console.log(this.$route.path);
    // console.log(this.activeName);
  },
  watch: {
    // 按需加载路由，监听路由变化逻辑处理
    $route(to) {
      this.activeName = to.fullPath;
    },
  },
};
</script>

<style lang="less">
body,
html,
#app,
.ivu-layout {
  height: 100%;
}
.header {
  background-color: #ffffff !important;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.12);
}
// .sider {
//   background: rgba(0, 11, 150, 1) !important;
// }
// .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
//   background: rgba(0, 11, 150, 1);
// }
// .ivu-menu {
//   background: rgba(8, 25, 87, 1);
// }
.sider {
  background: rgb(0, 6, 20) !important;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
  background: rgb(0, 6, 20);
}
.ivu-menu {
  background: #0c0d0e;
}

// .logo {
//   width: 300px;
//   img {
//     width: 100%;
//     margin-right: 20px;
//   }
//   .logoName {
//     font-size: 20px;
//     line-height: 30px;
//     padding: 0 20px;
//     padding-bottom: 10px;
//     font-weight: 400;
//     color: #fff;
//   }
// }
.logo {
  margin: 10px;
  margin-top: 20px;
  width: 330px;
  font-size: 40px;
  color: #fff;
  padding: 0 20px;
  line-height: 50px;
  img {
    float: left;
    width: 50px;
    margin-right: 20px;
  }
}

.none {
  margin: 10px;
  width: 50px;
  margin-top: 20px;
}

.ivu-menu-horizontal.ivu-menu-light:after {
  display: none;
  transition: width 0.2s ease;
}
.sider-hide span {
  display: none;
  transition: width 0.2s ease;
}
.sider-hide .ivu-menu-submenu-title {
  display: none;
  transition: width 0.2s ease;
}

.sider-hide.ivu-menu-vertical .ivu-menu-item {
  padding: 0 !important;
  width: 64px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
// .sider-hide.ivu-menu-dark.ivu-menu-vertical
//   .ivu-menu-submenu
//   .ivu-menu-item-active,
// .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
//   color: rgba(24, 109, 255, 1) !important;
// }
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title {
  color: #fff;
}
// .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
//   background: rgba(0, 11, 150, 1) !important;
// }
.ivu-layout-footer {
  text-align: center;
}

/* 工具栏统一样式 */
.title {
  height: 60px;
  .type {
    float: right;
    line-height: 40px;
  }
}
// .tools {
//   margin-bottom: 15px;
//   height: 30px;
//   .left {
//     float: left;
//   }
//   .right {
//     float: right;
//   }
//   button {
//     margin-right: 5px;
//   }
// }
.menuIcon {
  margin-right: -10px;
  .ivu-icon {
    font-size: 30px;
    line-height: 60px;
    cursor: pointer;
    margin-left: 40px;
  }
}
ul {
  list-style: none;
}
.btn {
  background-color: white;
  height: 32px;
  margin-right: 5px;
}
.hover {
  background-color: #2d8cf0 !important;
  color: #fff !important;
  margin-right: 5px;
}
.content {
  // padding: 24px;
  padding-bottom: 0;
  overflow: hidden;
}
.t {
  font-size: 30px;
  height: 70px;
  line-height: 60px;
  color: white;
  font-weight: bold;
  text-align: center;
}
</style>
