<template>
  <div style="padding: 24px; padding-bottom: 0">
    <Row :gutter="16" style="margin-bottom: 16px">
      <i-col span="8">
        <Card class="card" style="height: 191px">
          <p><Badge status="processing" /><span class="title">车辆数</span></p>
          <div class="count">
            {{ this.charData.vehicle.value }}
          </div>
          <span class="iconfont iconcheliangshu icons"></span>
          <div class="ysd">
            较昨日
            <span :class="yesterday(this.charData.vehicle.yesterday)"
              >{{ this.charData.vehicle.yesterday }}%</span
            >
          </div>
        </Card>
      </i-col>
      <i-col span="8">
        <Card class="card">
          <p>
            <Badge status="processing" /><span class="title">行驶里程</span>
          </p>
          <a href="#" slot="extra" @click.prevent="changeLimit"> </a>
          <div class="count">
            {{ this.charData.mileage.value }}
          </div>
          <span class="iconfont iconlicheng icons"></span>
          <div class="ysd">
            较昨日
            <span :class="yesterday(this.charData.mileage.yesterday)"
              >{{ this.charData.mileage.yesterday }}%</span
            >
          </div>
          <Progress
            :percent="Math.abs(this.charData.mileage.yesterday)"
            style="padding-left: 15px"
            :stroke-color="yesterday(this.charData.mileage.yesterday)"
            :stroke-width="6"
            status="active"
          />
        </Card>
      </i-col>
      <i-col span="8">
        <Card class="card">
          <p>
            <Badge status="processing" /><span class="title">接管次数</span>
          </p>
          <a href="#" slot="extra" @click.prevent="changeLimit"> </a>
          <div class="count">
            {{ this.charData.take_over_times.value }}
          </div>
          <span class="iconfont iconjieguancishu icons"></span>
          <div class="ysd">
            较昨日
            <span :class="yesterday(this.charData.take_over_times.yesterday)"
              >{{ this.charData.take_over_times.yesterday }}%</span
            >
          </div>
          <Progress
            :percent="Math.abs(this.charData.take_over_times.yesterday)"
            style="padding-left: 15px"
            :stroke-color="yesterday(this.charData.take_over_times.yesterday)"
            :stroke-width="6"
            status="active"
          />
        </Card>
      </i-col>
    </Row>
    <Row :gutter="16">
      <i-col span="8">
        <Card class="card">
          <p>
            <Badge status="processing" /><span class="title">作业量（箱）</span>
          </p>
          <a href="#" slot="extra" @click.prevent="changeLimit"> </a>
          <div class="count">
            {{ this.charData.task_num.value }}
          </div>
          <span class="iconfont iconzuoyeliangxiang icons"></span>
          <div class="ysd">
            较昨日
            <span :class="yesterday(this.charData.task_num.yesterday)">
              {{ this.charData.task_num.yesterday }}%</span
            >
          </div>
          <Progress
            :percent="Math.abs(this.charData.task_num.yesterday)"
            style="padding-left: 15px"
            :stroke-width="6"
            :stroke-color="yesterday(this.charData.task_num.yesterday)"
            status="active"
          />
        </Card>
      </i-col>
      <i-col span="8">
        <Card class="card">
          <p>
            <Badge status="processing" /><span class="title">作业量（趟）</span>
          </p>
          <a href="#" slot="extra" @click.prevent="changeLimit"> </a>
          <div class="count">
            {{ this.charData.task_cycle.value }}
          </div>
          <span class="iconfont icontang icons"></span>
          <div class="ysd">
            较昨日
            <span :class="yesterday(this.charData.task_cycle.yesterday)">
              {{ this.charData.task_cycle.yesterday }}%</span
            >
          </div>
          <Progress
            :percent="Math.abs(this.charData.task_cycle.yesterday)"
            style="padding-left: 15px"
            :stroke-color="yesterday(this.charData.task_cycle.yesterday)"
            :stroke-width="6"
            status="active"
          />
        </Card>
      </i-col>
      <i-col span="8">
        <Card class="card">
          <p>
            <Badge status="processing" /><span class="title"
              >作业量（TEU）</span
            >
          </p>
          <a href="#" slot="extra" @click.prevent="changeLimit"> </a>
          <div class="count">
            {{ this.charData.teu.value }}
          </div>
          <span class="iconfont iconbianzu icons"></span>
          <div class="ysd">
            较昨日
            <span :class="yesterday(this.charData.teu.yesterday)">
              {{ this.charData.teu.yesterday }}%</span
            >
          </div>
          <Progress
            :percent="Math.abs(this.charData.teu.yesterday)"
            style="padding-left: 15px"
            :stroke-width="6"
            :stroke-color="yesterday(this.charData.teu.yesterday)"
            status="active"
          />
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px">
      <i-col span="12">
        <Card class="card">
          <div>
            <p>
              <span class="c-title">接管效率</span
              ><span class="c-time">2020/05/11-2020/05/17</span>
            </p>
            <p class="c-bottom">(次/趟)</p>
          </div>
          <!-- <div id="canvas1"></div> -->
          <ve-line
            :data="chartData1"
            :tooltip-visible="false"
            :legend-visible="false"
            :grid="grid"
            :colors="colors1"
            height="300px"
          ></ve-line>
        </Card>
      </i-col>
      <i-col span="12">
        <Card class="card">
          <div>
            <p>
              <span class="c-title">平均作业效率</span
              ><span class="c-time">2020/05/11-2020/05/17</span>
            </p>
            <p class="c-bottom">(趟/小时)</p>
          </div>
          <ve-line
            :data="chartData"
            :tooltip-visible="false"
            :legend-visible="false"
            :grid="grid"
            :colors="colors"
            height="300px"
          ></ve-line>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { Line } from "@antv/g2plot";
import $ from "../libs/utils.js";
import "v-charts/lib/style.css";
export default {
  name: "dashboard",
  data() {
    this.grid = {
      show: true,
      top: 10,
      left: 10,
      // backgroundColor: '#ccc',
      borderColor: "rgba(0,0,0,0)",
    };
    this.colors = ["#B900F5"];
    this.colors1 = ["#0017D5"];
    return {
      charData: {},
      ddata: {},
      frequency: [],
      height: "200",
      take_over_frequency: [],
      chartData: {
        columns: ["day", "value"],
        // width: 200,
        rows: "",
      },
      chartData1: {
        columns: ["day", "value"],
        // width: 200,
        rows: "",
      },
    };
  },
  methods: {
    // 获取数据
    getdata() {
      $.ajax({
        url: "/monitor/dashboard",
        method: "get",
      })
        .then((res) => {
          this.charData = res;
          this.chartData.rows = res.take_over_frequency;
          this.chartData1.rows = res.frequency;
          console.log("this.chartData.rows", this.chartData.rows);
          for (var key in this.charData) {
            this.charData[key].yesterday >= 0
              ? (this.charData[key].yesterday =
                  "+" + this.charData[key].yesterday)
              : this.charData[key].yesterday;
          }
          //
          // Object.keys(res).forEach(function (key) {
          //   console.log(key, res[key].yesterday)
          // })
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 接管效率
    // getdata1 () {
    //   var canvas1 = this.$refs.canvas1
    //   const data = this.charData.frequency
    //   this.linePlot = new Line('canvas1', {
    //     width: 700,
    //     height: 280,
    //     title: {
    //       visible: true,
    //       style: {
    //       },
    //     },
    //     data: this.charData.frequency,
    //     xField: 'day',
    //     yField: 'value',
    //     point: {
    //       visible: true,
    //     },
    //     color: ["#0017D5"]
    //   });
    //   this.linePlot.render();
    // },
    // 平均作业效率
    // getdata2 () {
    //   var canvas2 = this.$refs.canvas2
    //   console.log('aaaaaaaaaaaaaaaaaaaaaaaa', this.charData.frequency)
    //   const data = this.charData.take_over_frequency
    //   this.linePlot2 = new Line('canvas2', {
    //     width: 700,
    //     height: 280,
    //     title: {
    //       visible: true,
    //       style: {
    //       }
    //     },
    //     data: this.charData.take_over_frequency,
    //     xField: 'day',
    //     yField: 'value',
    //     point: {
    //       visible: true,
    //     },
    //     color: ['#B900F5'],
    //   });
    //   this.linePlot2.render();
    // },
    // changeEchart () {
    // console.log('this.lineplot', this.linePlot)
    // this.linePlot.changeData(this.charData.frequency)
    // this.linePlot2.changeData(this.charData.take_over_frequency)
    // },
    yesterday(i) {
      if (i >= 0) {
        return "red";
      } else {
        return "green";
      }
    },
    handdleMsg(msg) {
      var me = this;
      console.log(this.global.ws);
      // if (this.global.ws && this.global.ws.readyState == 1) {
      if (this.global.ws) {
        setInterval(() => {
          this.global.ws.send(msg);
        }, 2000);
      }
      this.global.ws.onmessage = function (res) {
        if (res.data != msg) {
          var data = JSON.parse(res.data);
          console.log(data);
        }
      };
    },
  },
  created() {
    this.getdata();
    this.timer = setInterval(this.getdata, 10000);
    // this.handdleMsg("heartbeat");
  },
  mounted() {
    // setTimeout(this.getdata1, 1000)
    // setTimeout(this.getdata2, 1000)
    console.log(this.colors);
    // if (window.performance.navigation.type == 1) {
    //   console.log("页面被刷新");
    //   console.log(window.performance.navigation);
    // } else {
    //   console.log("首次被加载");
    //   this.$Modal.info({
    //     title: "Beta 1.1.1更新内容",
    //     content:""
    //   });
    // }
  },
  watch: {
    // charData (newval) {
    //   this.$nextTick(() => {
    //     // this.changeEchart()
    //   })
    // }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.count {
  padding: 5px 0 20px;
  padding-left: 15px;
  width: 76px;
  height: 44px;
  font-size: 44px;
  font-weight: bold;
  color: rgba(0, 123, 255, 1);
  line-height: 44px;
  margin-bottom: 13px;
}
.title {
  display: inline-block;
  /* width: 149px; */
  height: 29px;
  font-size: 24px;
  font-weight: 400;
  color: rgba(23, 25, 29, 1);
  line-height: 20px;
  margin-bottom: 10px;
}
.ysd {
  display: inline-block;
  padding-left: 15px;
  margin-bottom: 10px;
  /* margin-right: 10px; */
  font-size: 20px;
  color: rgba(65, 67, 70, 1);
}
.card {
  overflow: hidden;
  box-shadow: 0px 4px 10px 1px rgba(114, 115, 121, 0.2);
  border-radius: 4px;
}
.icons {
  font-size: 110px;
  position: absolute;
  top: 17px;
  right: -27px;
  color: rgba(219, 219, 219, 0.4);
}
.c-title {
  margin-left: 8px;
  height: 30px;
  font-size: 22px;
  font-weight: 500;
  color: rgba(19, 19, 21, 1);
  line-height: 30px;
  letter-spacing: 1px;
}
.c-time {
  position: absolute;
  right: 10px;
  height: 30px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(79, 79, 96, 1);
  line-height: 30px;
}
.c-bottom {
  margin-top: 10px;
  width: 141px;
  margin-left: 8px;
  height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(19, 19, 21, 1);
  line-height: 17px;
}
.red {
  color: rgba(208, 2, 27, 1);
}
.green {
  color: rgba(44, 199, 0, 1);
}
.ve-line canvas {
  height: 280px !important;
}
</style>
