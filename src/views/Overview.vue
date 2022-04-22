<template>
  <div style="height: 100%">
    <div style="padding: 24px 0 0 24px; height: 30%">
      <Row style="height: 100%">
        <Col span="8" class="colHeight">
          <Card class="topCard">
            <div class="bgc_base bgc_img_muddy"></div>
            <div class="bgc_base bgc_img1"></div>
            <div class="dots"></div>
            <span class="titleText">作业TEU</span>
            <span class="number"> {{ cardData.teus }} </span>
            <div class="iconfont iconxiangliang iconFonts iconFontSize"></div>
          </Card>
        </Col>
        <Col span="8" class="colHeight">
          <Card class="topCard">
            <div class="bgc_base bgc_img_muddy"></div>
            <div class="bgc_base bgc_img2"></div>
            <div class="dots"></div>
            <span class="titleText">累计里程</span>
            <span class="number"> {{ cardData.mileages }} </span>
            <div class="iconfont iconlicheng1 iconFonts"></div>
          </Card>
        </Col>
        <Col span="8" class="colHeight">
          <Card class="topCard">
            <div class="bgc_base bgc_img_muddy"></div>
            <div class="bgc_base bgc_img3"></div>
            <div class="dots"></div>
            <span class="titleText">循环趟数</span>
            <span class="number"> {{ cardData.trips }} </span>
            <div class="iconfont iconjieguan iconFonts"></div>
          </Card>
        </Col>
        <!-- <Col span="6" class="colHeight">
          <Card class="topCard">
            <div class="bgc_base bgc_img_muddy"></div>
            <div class="bgc_base bgc_img4"></div>
            <div class="dots"></div>
            <span class="titleText">故障统计</span>
            <span class="number"> {{ cardData.faults }} </span>
            <div class="iconfont iconguzhang-copy iconFonts"></div>
          </Card>
        </Col> -->
      </Row>
    </div>
    <div style="padding: 24px 24px 0 24px; height: 68%">
      <Card class="colBotHeight">
        <div class="lineView"></div>
        <div class="leftView">
          <div class="tabTitle">故障信息</div>
          <div class="tableView">
            <div class="tableHeader tableLiBase">
              <Col span="4"> 故障原因 </Col>
              <Col span="16"> 接管次数(次)</Col>
              <Col span="4"> 频率(%)</Col>
            </div>
            <div
              class="tableLi tableLiBase"
              v-for="item in pieEchartData"
              :key="item.name"
            >
              <Col span="4"> {{ item.name }} </Col>
              <Col span="16"> {{ item.value }} </Col>
              <Col span="4"> {{ item.rate }} </Col>
            </div>
          </div>
        </div>
        <div class="rigthView">
          <div id="myChart" class="myChart" />
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
import $ from "../libs/utils.js";
import * as echarts from "echarts";
export default {
  data() {
    return {
      timer1: null,
      timer2: null,
      cardData: {
        teus: 0, // 箱量
        mileages: 0, // 里程
        trips: 0,//循环趟数
        // takeovers: 0, // 循环趟数
      },
      tableData: [],
      pieEchartData: [
        { value: 0, name: "定位故障", rate: 0 },
        { value: 0, name: "底盘故障", rate: 0 },
        { value: 0, name: "地图无效", rate: 0 },
        { value: 0, name: "感知无效", rate: 0 },
        { value: 0, name: "外部原因", rate: 0 },
      ],
    };
  },
  methods: {
    initPie() {
      let echartPie = echarts.init(document.getElementById("myChart"));
      let option = {
        tooltip: {
          show: false,
          trigger: "item",
        },
        legend: {
          bottom: 20,
          icon: "circle", //设置圆点
        },
        toolbox: {
          //显示导出图片按钮
          feature: {
            saveAsImage: {
              show: true,
              title: "保存",
            },
          },
        },
        series: [
          {
            // name: "定位故障",
            type: "pie",
            radius: "50%",
            color: ["#488AFF", "#91FFB2", "#FF8467", "#FFD14B", "#A9B3C8"],
            data: this.pieEchartData,
            emphasis: {
              //高亮的图形样式和标签样式
              itemStyle: {
                shadowBlur: 10, //图形阴影的模糊大小
                shadowOffsetX: 0, //阴影水平方向上的偏移距离。
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            labelLine: {
              length2: 100, //引导线的长度
              normal: {
                show: true,
                length: 15, // 第一段线 长度
                length2: 110, // 第二段线 长度
                align: "right",
              },
              emphasis: {
                show: true,
              },
            },
            label: {
              normal: {
                //控制引导线上文字颜色和位置,此处a是显示文字区域，b做一个小圆圈在引导线尾部显示
                show: true,
                //a和b来识别不同的文字区域
                color: "#b7b5b5",
                formatter: ["{a|{d}%}", "{b|}"].join("\n"), //用\n来换行
                rich: {
                  a: {
                    left: 10,
                    padding: [-30, -50, -15, -50], //参1:调整文字上下 参2:调整左侧小圆点上下参 3:调整文字，参4:调整右侧文字
                  },
                  b: {
                    height: 10,
                    width: 10,
                    lineHeight: 10,
                    marginBottom: 10,
                    padding: [0, -10],
                    borderRadius: 10,
                    backgroundColor: "auto", // 圆点颜色和饼图块状颜色一致
                  },
                },
              },
            },
          },
        ],
      };
      echartPie.setOption(option);
      window.addEventListener("resize", function () {
        echartPie.resize();
      });
    },
    getCardData() {
      $.ajax({
        url: "/api/truck/fault/overview/",
        method: "get",
      })
        .then((res) => {
          let result = res.data;
          this.cardData = result;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    getData() {
      const that = this;
      setTimeout(() => {
        //解决图表自适应
        that.initPie();
      });
      that.timer1 = setInterval(() => {
      $.ajax({
        url: "/api/truck/fault/",
        method: "get",
      })
        .then((res) => {
          let result = res.data;
          if (result.length == 0) return;
          let pieEchartData = [
            { value: 0, name: "定位故障", rate: 0 },
            { value: 0, name: "底盘故障", rate: 0 },
            { value: 0, name: "地图无效", rate: 0 },
            { value: 0, name: "感知无效", rate: 0 },
            { value: 0, name: "外部原因", rate: 0 },
          ];
          this.pieEchartData = pieEchartData; //清空
          let pieData = pieEchartData;
          for (var item in result) {
            for (var key in pieData) {
              if (result[item].fault_name == pieData[key].name) {
                this.pieEchartData[key].value = result[item].takeovers;
                this.pieEchartData[key].rate = result[item].rate;
              }
            }
          }
          that.initPie();
        })
        .catch((res) => {
          console.log(res);
        });
        }, 1000);
    },
  },
    
  mounted() {
    let that = this;
    that.timer2 = setInterval(() => {
      that.getCardData(); //获取卡片信息数据
    }, 1000);
    //获取饼图图表的信息数据
    that.getData();
  },
  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  },
};
</script>

<style lang="less" scoped>
.bgc_base {
  position: absolute;
  top: -1px;
  left: -2px;
  width: 101%;
  border-radius: 16px;
  height: 101%;
}
.bgc_img_muddy {
  z-index: 9;
  background: url(../assets/muddy.png) -16px 0px no-repeat;
  background-size: 106%;
}
.bgc_img1 {
  background: url(../assets/1.png) no-repeat;
  background-size: 100% 100%;
}
.bgc_img2 {
  background: url(../assets/2.png) no-repeat;
  background-size: 100% 100%;
}
.bgc_img3 {
  background: url(../assets/3.png) no-repeat;
  background-size: 100% 100%;
}
.bgc_img4 {
  background: url(../assets/4.png) no-repeat;
  background-size: 100% 100%;
}
.colHeight {
  height: 100%;
}
.colBotHeight {
  height: 100%;
  border-radius: 16px;
  box-shadow: 0px 4px 10px 2px rgba(185, 185, 185, 0.5);
}
.topCard {
  position: relative;
  height: 100%;
  margin-right: 24px;
  box-shadow: 0px 4px 10px 1px rgba(114, 115, 121, 0.2);
  border-radius: 16px;
  .titleText {
    position: absolute;
    width: 164px;
    height: 32px;
    top: 24px;
    left: 31px;
    font-size: 24px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #4f5051;
    line-height: 32px;
  }
  .number {
    position: absolute;
    left: 31px;
    top: 45%;
    width: 195px;
    height: 58px;
    font-size: 3rem;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #ffffff;
    line-height: 58px;
  }
  .iconFonts {
    position: absolute;
    right: 8%;
    bottom: 5%;
    font-size: 5rem;
    color: #e4ebf3;
  }
}
.leftView {
  width: 50%;
  height: 100%;
  padding-left: 17px;
  padding-right: 32px;
  display: inline-block;
}
.lineView {
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  border-right: 1px solid rgba(151, 151, 151, 0.33);
}
.rigthView {
  float: right;
  width: 50%;
  height: 100%;
  margin: 0 auto;
}
.myChart {
  width: 100%;
  height: 100%;
}
.tabTitle {
  margin-top: 1%;
  font-size: 24px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 32px;
}
.tableLiBase {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.tableView {
  height: 85%;
  margin-top: 2%;
  border-radius: 16px;
  border: 1px solid #dcdfe6;
  .tableHeader {
    height: 15%;
    font-size: 18px;
    color: #000;
    background: #f3f6f8;
    border-radius: 16px 16px 0px 0px;
  }
  .tableLi {
    height: 17%;
    font-size: 16px;
    color: #303133;
  }
}
</style>
<style lang="less">
.ivu-card-body {
  height: 100%;
}
</style>
