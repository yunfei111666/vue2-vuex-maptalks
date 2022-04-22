
<template>
  <div>
    <div style="padding: 24px; padding-bottom: 0">
      <Card style="padding-left: 15px; padding-top: 9px">
        <div class="tools" style="margin-bottom: 24px">
          <div class="left">
            <DatePicker
              v-model="time"
              type="daterange"
              placement="bottom"
              placeholder="Select date"
              transfer
              style="width: 200px; float: left; margin-right: 5px; zindex: 9999"
            ></DatePicker>
            <Button
              type="primary"
              icon="ios-search"
              style="float: right"
              @click="search"
              >查询</Button
            >
          </div>
        </div>
        <Table :columns="columns" :data="data" height="">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
        </Table>
        <div style="margin: 10px; overflow: hidden; margin-bottom: 5px">
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
      </Card>
    </div>
  </div>
</template>
<script>
import $ from "../libs/utils.js";
export default {
  data() {
    return {
      time: "",
      columns: [
        {
          title: "车辆编号",
          key: "veh_id",
          align: "center",
        },
        {
          title: "作业量（箱）",
          key: "task_num",
          align: "center",
        },
        {
          title: "作业量（TEU）",
          key: "teu",
          align: "center",
        },
        {
          title: "作业量（趟）",
          key: "task_cycle",
          align: "center",
        },
        {
          title: "作业效率（趟/小时）",
          key: "frequency",
          align: "center",
        },
        {
          title: "接管效率（次/趟）",
          key: "take_over_frequency",
          align: "center",
        },
        {
          title: "接管次数",
          key: "take_over_times",
          align: "center",
        },
        {
          title: "行驶里程（公里）",
          key: "mileage",
          align: "center",
        },
      ],
      data: [],
      reqParams: {
        page: 1,
        perPage: 12,
      },
      total: 0,
      timer: null,
    };
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data[index].name}<br>Age：${this.data[index].age}<br>Address：${this.data[index].address}`,
      });
    },
    remove(index) {
      this.data.splice(index, 1);
    },
    getData() {
      var page = this.reqParams.page;
      var perPage = this.reqParams.perPage;
      $.ajax({
        url: "/tasks/default_3_month",
        method: "get",
      })
        .then((res) => {
          console.log(res);
          this.total = res.length;
          this.tdata = res;
          this.data = res.slice((page - 1) * perPage, page * perPage);
        })
        .catch((res) => {
          console.log(res);
        });
    },
    search() {
      var page = this.reqParams.page;
      var perPage = this.reqParams.perPage;
      var start_time = $.dateFormat(this.time[0]);
      var end_time = $.dateFormat(this.time[1]);
      $.ajax({
        url: "/api/get_AD_statistic",
        method: "post",
        data: {
          start_time: start_time,
          end_time: end_time,
        },
      })
        .then((res) => {
          this.tdata = res;
          this.data = res.slice((page - 1) * perPage, page * perPage);
          this.total = res.length;
        })
        .catch((res) => {
          console.log(res);
        });
      console.log(start_time, end_time);
    },
    changePager(index) {
      this.reqParams.page = index;
      if (this.time[0] != "") {
        this.search();
      } else {
        this.getData();
      }
    },
  },
  mounted() {
    this.getData();
    this.timer = setInterval(this.getData, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
.header-title {
  width: 205px;
  height: 60px;
  font-size: 22px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 60px;
}
</style>
<style lang="less">
.ivu-table-cell {
  color: rgba(0, 0, 0, 0.85) !important;
}
.ivu-card-body {
  padding-bottom: 5px !important;
}
</style>

