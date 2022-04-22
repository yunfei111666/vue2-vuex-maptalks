<template>
  <div>
    <div style="padding: 24px; padding-bottom: 0">
      <Card>
        <div class="tools" style="z-index: 99">
          <div class="left">
            <DatePicker
              class="datePic"
              @on-change="datePicker"
              :options="thisMaxTime"
              :start-date="new Date()"
              :value="defaultTime"
              format="yyyy-MM-dd"
              type="daterange"
              placement="bottom-start"
              :clearable="false"
              placeholder="请选择起止时间"
              transfer
            ></DatePicker>
            <Button
              type="primary"
              icon="ios-download-outline"
              @click="exportData()"
            >
              导出</Button
            >
            <Button
              type="primary"
              icon="ios-search"
              @click="getData()"
              style="float: right"
            >
              查询</Button
            >
          </div>
        </div>
        <Table
          ref="table"
          :columns="columns"
          :data="data"
          :max-height="reqParams.tableHeight"
          style="z-index: 9"
          stripe
        >
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="show(index, row)"
              >查看统计详情</a
            >
          </template>
        </Table>
        <div style="margin: 10px; overflow: hidden">
          <div style="float: right">
            <Page
              :total="total"
              :page-size="reqParams.perPage"
              :current="reqParams.page"
              @on-change="changePager"
              show-elevator
            ></Page>
          </div>
        </div>
        <!-- 查看车辆图表数据详情--折线 -->
        <Modal
          v-model="modalLine"
          :footer-hide="true"
          :title="vehid + '统计详情'"
          width="800px"
        >
          <Tabs value="name1">
            <TabPane label="数据统计" name="name1">
              <div v-if="showNoData" class="noData">暂无数据</div>
              <div
                id="myChart"
                class="charts-box"
                style="width: 770px; height: 400px"
              />
            </TabPane>
            <TabPane label="故障统计" name="name2">
              <div
                id="myChartPie"
                class="charts-box"
                style="width: 770px; height: 400px"
              />
            </TabPane>
          </Tabs>
        </Modal>
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
      //设置日期控件不能超过当天时间
      thisMaxTime: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
      },
      //列表表头字段
      columns: [
        {
          title: "车辆编号",
          key: "name",
          align: "center",
        },
        {
          title: "车辆IP",
          key: "address",
          align: "center",
        },
        {
          title: "TEU",
          key: "TEU_count_total",
          align: "center",
        },
        {
          title: "接管",
          key: "take_over_count_total",
          align: "center",
        },
        {
          title: "接管率",
          key: "take_over_rate",
          align: "center",
        },
        {
          title: "故障",
          key: "truck_error_count_total",
          align: "center",
        },
        {
          title: "故障率",
          key: "truck_error_rate",
          align: "center",
        },
        {
          title: "工作效率",
          key: "work_efficiency",
          align: "center",
        },
        // {
        //   title: "行驶总里程",
        //   key: "mileage_total",
        //   align: "center",
        // },
        {
          title: "循环趟数",
          key: "trip",
          align: "center",
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          slot: "action",
        },
      ],
      showNoData: false, //暂无数据隐藏
      data: [{ mileage_total: 1 }],
      vehid: "", //查询车辆编号
      reqParams: {
        tableHeight: 450,
        page: 1,
        perPage: 12,
      },
      total: 0,
      modalLine: false, //车辆折线图表弹框默认隐藏
      echartObj: {
        title: ["TEU数量", "箱子数量", "里程", "接管次数", "故障量"],
        date: [],
        obj: {
          TEU数量: 0,
          箱子数量: 0,
          里程: 0,
          接管次数: 0,
          故障量: 0,
        },
      },
      pieEchartData: [],
      echartLine: "", //车辆折线图表实例对象
      eachartData: [], //折线图数据
      startTime: "", //查询开始时间
      endTime: "", //查询结束时间
      defaultTime: [], //查询默认当天时间
    };
  },
  methods: {
    datePicker(date) {
      this.startTime = date[0];
      this.endTime = date[1];
      this.defaultTime = [date[0], date[1]];
    },
    setDefaultDay() {
      //折线无数据的情况下，设置默认7天的日期
      let newArr = []; //默认设置最近7天的日期
      for (var i = 0; i < 6; i++) {
        var days = $.getDay(-i); //获取日期
        newArr.push(days);
      }
      this.echartObj.date = newArr.reverse();
    },
    exportData() {
      if (this.total == 0) return this.$Message.info("无数据！");
      this.$refs.table.exportCsv({
        filename: "车辆历史数据信息",
      });
    },
    initPie() {
      let echartPie = echarts.init(document.getElementById("myChartPie"));
      let option = {
        tooltip: {
          show: true,
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
    },
    initLine() {
      var seriesObj = [];
      var serObj = this.echartObj.obj;
      for (var item in serObj) {
        let obj = {
          name: item,
          type: "line",
          stack: "总量",
          data: serObj[item],
        };
        seriesObj.push(obj);
      }
      this.echartLine = echarts.init(document.getElementById("myChart"));
      let option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: this.echartObj.title,
          left: 25,
        },
        color: ["#244FFF", "#24BFFF", "#61FF14", "#FFC617", "#FF1010"],
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: this.echartObj.date.length > 30 ? 50 : 100,
          },
          {
            start: 0,
            end: 10,
          },
        ],
        grid: {
          left: "6%",
          right: "10%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: "保存",
            },
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.echartObj.date,
        },
        yAxis: {
          type: "value",
        },
        series: seriesObj,
      };

      this.echartLine.setOption(option);
    },
    // 折线图车辆信息展示
    drawLine(index, row) {
      $.ajax({
        url:
          "/api/truck/history/" +
          row.name +
          "/?start_date=" +
          this.startTime +
          "&end_date=" +
          this.endTime,
        method: "get",
      })
        .then((res) => {
          // if (res.data.length == 0)
          //   return this.$Message.info(
          //     "当前车辆编号为:" + row.name + "无数据信息！"
          //   );
          if (res.data.length == 0) {
            this.showNoData = true;
            this.setDefaultDay();
          } else {
            this.showNoData = false;
          }
          this.vehid = row.name;
          this.modalLine = true;

          let start = {
            TEU_count: "TEU数量",
            container_count: "箱子数量",
            mileage: "里程",
            take_over_count: "接管次数",
            truck_error_count: "故障数量",
          };
          // ---------模拟数据-----------
          // let result = [
          //     {
          //         // # 当天累计 TEU 数量
          //         "TEU_count": 0,
          //         // # 当天累计箱子数量
          //         "container_count": 0,
          //         // # 日期
          //         "create_date": "2021-06-02",
          //         // # 当天累计里程
          //         "mileage": 0,
          //         // # 集卡号
          //         "name": "T502",
          //         // # 当天累计接管次数
          //         "take_over_count": 0,
          //         // # 当天累计故障量
          //         "truck_error_count": 0
          //     }
          // ]
          // ---------模拟数据-----------
          var result = res.data;

          this.echartObj.date = [];
          this.echartObj.title = [];
          for (let key in result) {
            let itemObj = result[key];
            for (let k in itemObj) {
              switch (k) {
                case "TEU_count": //当天累计 TEU 数量
                case "container_count": //当天累计箱子数量
                case "mileage": //当天累计里程
                case "take_over_count": //当天累计接管次数
                case "truck_error_count": //当天累计故障量
                  if (this.echartObj.title.indexOf(start[k]) == -1) {
                    this.echartObj.title.push(start[k]);
                    this.echartObj.obj[start[k]] = new Array();
                  }
                  this.echartObj.obj[start[k]].push(itemObj[k]);
                  break;
                case "create_date": //日期
                  if (this.echartObj.date.indexOf(k) == -1) {
                    this.echartObj.date.push(itemObj.create_date);
                  }
                  break;
                default:
              }
            }
          }
          this.initLine();
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 饼图单车故障信息显示
    drawPie(index, row) {
      $.ajax({
        url: "/api/truck/fault/" + row.name + "/",
        method: "get",
      })
        .then((res) => {
          this.vehid = row.name;
          this.modalLine = true;
          let result = res.data;
          let pieEchartData = [
            { value: 0, name: "定位故障" },
            { value: 0, name: "底盘故障" },
            { value: 0, name: "地图无效" },
            { value: 0, name: "感知无效" },
            { value: 0, name: "外部原因" },
          ];
          this.pieEchartData = pieEchartData; //清空
          let pieData = pieEchartData;
          for (var item in result) {
            for (var key in pieData) {
              if (result[item].fault_name == pieData[key].name) {
                this.pieEchartData[key].value = result[item].takeovers;
              }
            }
          }
          this.initPie();
        })
        .catch((res) => {
          console.log(res);
        });
    },
    show(index, row) {
      this.drawLine(index, row);
      this.drawPie(index, row);
    },
    getData() {
      $.ajax({
        url:
          "/api/truck/history/?start_date=" +
          this.startTime +
          "&end_date=" +
          this.endTime,
        method: "get",
      })
        .then((res) => {
          let result = res.data;
          this.data = result;
          this.total = result.TEU_count_total;
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 分页
    changePager(index) {
      this.reqParams.page = index;
      this.getData();
    },
  },
  beforeMount() {
    //默认显示一周
    // 获取当前日期
    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // var day = date.getDate();
    // if (month < 10) {
    // month = "0" + month;
    // }
    // if (day < 10) {
    // day = "0" + day;
    // }
    // var nowDate = year + "-" + month + "-" + day;
    // this.startTime = nowDate;
    // this.endTime = nowDate;

    //默认显示一周
    var myDate = new Date();
    var befordata = myDate.getTime() - 6 * 24 * 3600 * 1000;
    function timestampToTime(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return Y + M + D;
    }
    this.startTime = timestampToTime(befordata);
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate(); //获取当前日（1-31）
    if (month < 10) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      if (day == 1) {
        month = myDate.getMonth();
        if (month == 0) {
          month = 12;
          year = year - 1;
        }
        day = new Date(year, month, 0).getDate();
      } else {
        day = day < 10 ? "0" + day : day;
      }
    }
    var days = day - 6;
    days = days < 10 ? "0" + days : days;
    this.endTime = year + "-" + month + "-" + day;
    this.defaultTime = [this.startTime, this.endTime];
  },
  mounted() {
    this.getData();
    this.reqParams.tableHeight =
      window.innerHeight - this.$refs.table.$el.offsetTop - 160;
  },
};
</script>

<style lang="less" scoped>
.noData {
  position: absolute;
  top: 43%;
  left: 43%;
}
.header-title {
  width: 105px;
  height: 60px;
  font-size: 22px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 60px;
}

.ivu-tag-dot {
  border: none !important;
}

.datePic {
  width: 200px;
  margin-right: 5px;
  z-index: 9999;
}
</style>
<style lang="less">
.ivu-table-cell {
  color: rgba(0, 0, 0, 0.85) !important;
}

.top {
  height: 40px;
}

.tools {
  margin-bottom: 15px;
}

.right {
  float: right;
}
</style>
