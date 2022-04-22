<template>
  <div>
    <div class="title">
      <h1>API接口监控</h1>
    </div>
    <div class="tools">
      <div class="left">
        <Button type="primary">
          <Icon type="md-refresh" />刷新
        </Button>
        <Button type="error">
          <Icon type="md-trash" />清空
        </Button>
      </div>
      <div class="right">
        <Button type="default"
                @click="exportData(1)">
          <Icon type="ios-download-outline"></Icon>导出数据
        </Button>
      </div>
    </div>
    <Row></Row>
    <Card>
      <Row style="height:300px">
        <Col span="16">
        <ChartColumn :column="columnData"></ChartColumn>
        </Col>
        <Col span="4"
             offset="3">
        <ChartPie :pie="pieData"></ChartPie>
        </Col>
      </Row>
    </Card>
    <Table :columns="columns"
           :data="data"
           style="margin-top:20px"
           height="500"
           ref="table"></Table>
  </div>
</template>
<script>
import ChartPie from "../components/charts/Chart-pie.vue";
import ChartColumn from "../components/charts/Chart-column.vue";
import $ from "../libs/utils";

export default {
  name: "Home",
  components: {
    ChartPie,
    ChartColumn
  },
  data () {
    return {
      columns: [
        {
          title: "序号",
          type: "index",
          width: "150",
          align: "center"
        },
        {
          title: "请求路径",
          key: "url"
        },
        {
          title: "请求类型",
          key: "type",
          width: 200
        },
        {
          title: "请求状态",
          key: "status",
          width: 200
        },
        {
          title: "请求时间",
          key: "time",
          sortable: true,
          render: (h, params) => {
            // return $.dateFormat(params.row.time)

            return h("div", [$.dateFormat(params.row.time)]);
          }
        }
      ],
      data: [],
      pieData: [],
      columnData: []
    };
  },
  mounted () {
    this.global
      .readData()
      .then(data => {
        // 表格数据
        this.data = data;

        // 饼图数据
        var zc = 0;
        var yc = 0;
        _.dropRightWhile(data, function (o) {
          if (o.status == 200) {
            console.log(o.status == 200);
            zc++;
          } else {
            yc++;
          }
          return o.status == 200;
        });
        var pie = [
          {
            type: "正常",
            value: zc
          },
          {
            type: "异常",
            value: yc
          }
        ];
        this.pieData = pie;

        // 柱状图数据

        var getn = 0;
        var postn = 0;
        var putn = 0;
        var deleten = 0;
        _.dropRightWhile(data, function (o) {
          var type = o.type;
          switch (type) {
            case "get":
              getn++;

              break;

            case "post":
              postn++;

              break;
            case "put":
              putn++;

              break;
            case "delete":
              deleten++;

              break;
            default:
              break;
          }
          return o.status == 200;
        });
        var column = [
          { type: "get", value: getn },
          { type: "post", value: postn },
          { type: "put", value: putn },
          { type: "delete", value: deleten }
        ];
        console.log(column);
        this.columnData = column;
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    exportData (type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: "The original data"
        });
      } else if (type === 2) {
        this.$refs.table.exportCsv({
          filename: "Sorting and filtering data",
          original: false
        });
      } else if (type === 3) {
        this.$refs.table.exportCsv({
          filename: "Custom data",
          columns: this.columns8.filter((col, index) => index < 4),
          data: this.data7.filter((data, index) => index < 4)
        });
      }
    },
    handdleMsg (msg) {
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
    }
  },
  created () {
    //页面刚进入时开启长连接
    this.handdleMsg("heartbeat");
  }
};
</script>
