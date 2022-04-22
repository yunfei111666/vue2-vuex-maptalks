<template>
  <div>
    <div style="padding: 24px; padding-bottom: 0">
      <Card>
        <div class="title top">
          <div class="type">
            <Tag type="dot" checkable style="width: 120px" color="primary"
              >车辆总数 {{ this.total }}</Tag
            >
            <Tag type="dot" checkable style="width: 120px" color="success"
              >在线车辆 {{ this.normal }}</Tag
            >
            <Tag type="dot" checkable style="width: 110px" color="error"
              >故障车辆 {{ this.error }}</Tag
            >
          </div>
        </div>
        <div class="tools">
          <div class="left">
            <Input
              v-model="vehid"
              placeholder="请输入车辆编号"
              style="width: 200px; margin-right: 5px; zindex: 9999"
            />
            <Button
              type="primary"
              icon="ios-search"
              style="float: right"
              @click="getData()"
              >查询</Button
            >
            <Button type="primary" @click="AddVehicle()">
              <Icon type="md-add" /> 创建车辆</Button
            >
          </div>
        </div>
        <Table ref="table" :columns="columns" :data="data" :max-height="reqParams.tableHeight" style="z-index:9" stripe>
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <a
              style="margin-right: 20px; color: rgba(50, 107, 230, 1)"
              @click="control(index, row)"
              >车辆监控</a
            >
            <a
              style="margin-right: 20px; color: rgba(50, 107, 230, 1)"
              @click="show(index, row)"
              >查看硬件详情</a
            >
            <a style="color: rgba(208, 2, 27, 1)" @click="remove(index, row)"
              >删除</a
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
        <!-- 查看详情 -->
        <Modal v-model="modal1" title="车辆信息详情" @on-ok="ok()">
          <Form :model="form1" label-position="right" :label-width="100">
            <FormItem label="车辆编号:">
              <i-input
                id="vehicleId"
                v-model="form1.name"
                style="width: 98%"
              ></i-input>
            </FormItem>
            <FormItem label="车辆IP:">
              <i-input
                id="IP"
                v-model="form1.address"
                style="width: 98%"
              ></i-input>
            </FormItem>
            <!-- <FormItem label="车辆总里程:">
              <i-input
                id="mileage"
                v-model="form1.mileage"
                style="width: 98%"
                type="number"
              ></i-input>
            </FormItem> -->
            <FormItem label="车牌号:">
              <i-input v-model="form1.number" style="width: 98%"> </i-input>
            </FormItem>
            <FormItem label="车辆型号:">
              <i-input v-model="form1.truck_type" style="width: 98%"></i-input>
            </FormItem>
            <FormItem label="创建日期:">
              <i-input
                v-model="form1.create_date"
                style="width: 98%"
                :disabled="true"
              ></i-input>
            </FormItem>
            <FormItem label="车辆状态:">
              <i-input
                v-model="form1.state"
                style="width: 98%"
                :disabled="true"
              ></i-input>
            </FormItem>
            <FormItem label="车辆作业状态:">
              <i-input
                v-model="form1.job_status"
                style="width: 98%"
                :disabled="true"
              ></i-input>
            </FormItem>
          </Form>
        </Modal>
        <!-- 创建车辆 -->
        <Modal v-model="modal2" title="创建车辆" @on-ok="createok">
          <i-form
            :model="form"
            label-position="right"
            :label-width="120"
            :rules="ruleValidate"
          >
            <FormItem label="车辆编号" prop="name">
              <i-input v-model="form.name" style="width: 90%"></i-input>
            </FormItem>
            <FormItem label="车辆IP" prop="address">
              <i-input v-model="form.address" style="width: 90%"></i-input>
            </FormItem>
            <FormItem label="车牌号" prop="number">
              <i-input v-model="form.number" style="width: 90%"></i-input>
            </FormItem>
            <FormItem label="车辆型号" prop="truck_type">
              <i-input v-model="form.truck_type" style="width: 90%"></i-input>
            </FormItem>
            <FormItem label="车架号" prop="frame_number">
              <i-input v-model="form.frame_number" style="width: 90%"></i-input>
            </FormItem>
            <!-- <FormItem label="创建日期" prop="created_time">
              <DatePicker
                v-model="form.created_time"
                type="datetime"
                placeholder="请选择日期和时间"
                style="width: 90%"
              ></DatePicker>
            </FormItem> -->
          </i-form>
        </Modal>
      </Card>
    </div>
  </div>
</template>
<script>
import $ from "../libs/utils.js";
export default {
  data() {
    return {
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
          title: "车辆状态",
          key: "state",
          align: "center",
          render: (h, params) => {
            if (params.row.state === "故障") {
              return h(
                "span",
                {
                  style: {
                    color: "rgba(215,41,62,1)",
                  },
                },
                params.row.state
              );
            }else if(params.row.state == undefined) {
              return h("span", {}, '-');
            } else {
              return h("span", {}, params.row.state);
            }
          },
        },
        {
          title: "TOS登录",
          key: "row.is_login",
          align: "center",
          render: (h, params) => {
            if (params.row.is_login == "1") {
              return h("div", {
                style: {
                  width: "10px",
                  height: "10px",
                  display: "inline-block",
                  marginRight: "5px",
                  background: "rgb(111,123,149)",
                  borderRadius: "50%",
                },
              });
            } else {
              return h("div", {
                style: {
                  width: "10px",
                  height: "10px",
                  display: "inline-block",
                  marginRight: "5px",
                  background: "rgb(8,240,0)",
                  borderRadius: "50%",
                },
              });
            }
          },
        },
        {
          title: "电量",
          key: "battery",
          align: "center",
          render: (h, params) => {
            if (params.row.battery <= "30%") {
              return h(
                "span",
                {
                  style: {
                    color: "rgba(215,41,62,1)",
                  },
                },
                params.row.battery
              );
            }else if(params.row.battery == "null%"){
              return h("span", {}, '-');
            }else {
              return h("span", {}, params.row.battery);
            }
          },
        },
        // {
        //   title: "行驶总里程",
        //   key: "mileage",
        //   align: "center",
        // },
        {
          title: "操作",
          slot: "action",
          width: 280,
          align: "center",
        },
      ],
      data: [],
      // 查询车辆编号
      vehid: "",
      reqParams: {
        tableHeight:450,
        page: 1,
        perPage: 12,
      },
      total: 0,
      normal: 0,
      error: 0,
      nor: 0,
      err: 0,
      modal1: false,
      modal2: false,
      sensors: [],
      defaultForm: {},
      form: {
        name: "",
        address: "192.168.1",
        number: "",
        truck_type: "",
        frame_number: "",
      },
      chuanganqit: [
        {
          type: "Camera",
          value: "摄像头",
        },
        {
          type: "Lidar 16",
          value: "16线雷达",
        },
        {
          type: "Lidar 32",
          value: "32线雷达",
        },
        {
          type: "Lidar 40",
          value: "40线雷达",
        },
        {
          type: "IMU",
          value: "惯导",
        },
      ],
      ruleValidate: {
        name: [
          { required: true, message: "车辆编号不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "车辆IP不能为空", trigger: "blur" },
        ],
        number: [
          { required: true, message: "车牌号不能为空", trigger: "blur" },
        ],
        truck_type: [
          { required: true, message: "车辆型号不能为空", trigger: "blur" },
        ],
        frame_number: [
          { required: true, message: "车架号不能为空", trigger: "blur" },
        ],
      },
      timer: null,
      form1: {},
    };
  },
  methods: {
    control(index, row) {
      let url = "http://" + row.address + ":9999";
      window.open(url, "_blank");
    },
    show(index, row) {
      this.modal1 = true;
      this.form1 = row;
    },
    ok() {
      this.modal1 = false;
      $.ajax({
        url: "/api/truck/",
        method: "put",
        data: this.form1,
      })
        .then((res) => {
          this.getData();
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 删除车辆
    remove(index, row) {
      this.$Modal.confirm({
        title: "是否确认删除？",
        onOk: () => {
          var url = "/api/truck/";
          $.ajax({
            url: url,
            method: "delete",
            data: {
              truck_id: row.name,
            },
          })
            .then((res) => {
              this.getData();
            })
            .catch((res) => {
              console.log(res);
            });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        },
      });
    },
    getData() {
      var that = this;
      var page = this.reqParams.page;
      var perPage = this.reqParams.perPage;
      const statu = {
      0: '自动驾驶',
      1: '人工驾驶',
      2: 'udp 丢失',
      3: 'can 丢失',
      5: 'cdc 丢失',
    };
      const toslist = {
      0: '登录',
      1: '登出',
    };
      // this.normal = 0
      // this.error = 0
      $.ajax({
        url: "/api/truck/",
        method: "get",
      })
        .then((res) => {
          that.tdata = res.data.vehs;
          that.data = that.tdata.slice((page - 1) * perPage, page * perPage);
          that.total = that.tdata.length;
          let nor = 0;
          let err = 0;
           const statu = {
           0: '自动驾驶',
           1: '人工驾驶',
           2: 'udp 丢失',
           3: 'can 丢失',
           5: 'cdc 丢失',
          };
          for (var i = 0; i < that.tdata.length; i++) {
            // 在线车辆
            if(that.tdata[i].is_login == 0){
              nor = nor + 1
              that.normal = nor
            } 
            // 故障车辆
            if(that.tdata[i].truck_error>0){
              err = err +1
              that.error = err
            } 
            that.tdata[i].battery = res.data.vehs[i].battery + "%"  
          }

          that.data.map((item)=>{
            item.state = statu[item.driving_state]
          })
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
    AddVehicle() {
      this.modal2 = true;
      this.form = JSON.parse(JSON.stringify(this.defaultForm));
      // 添加时间
      // this.form.created_time = $.dateFormat($.getTime());
      // 添加车辆型号
      this.form.truck_type = "TX350";
    },
    createok() {
      $.ajax({
        url: "/api/truck/",
        method: "post",
        data: this.form,
      })
        .then((res) => {
          this.getData();
        })
        .catch((res) => {
          console.log(res);
        });
    },
    update() {
      this.nor = 0;
      this.err = 0;
      this.getData();
    },
    // 新增传感器
    handleAdd() {
      this.sensors.push({
        sensor_type: "",
        sn: "",
      });
    },
    // 删除传感器
    handleRemove(item) {
      var index = this.sensors.indexOf(item);
      this.sensors.splice(index, 1);
    },
  },
  mounted() {
    this.getData();
    this.timer = setInterval(this.update, 10000);
    this.defaultForm = JSON.parse(JSON.stringify(this.form));
    this.reqParams.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 160; 
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="less" scoped>
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
</style>
