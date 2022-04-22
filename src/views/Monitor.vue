<!--
 * @Author: yunfei
 * @since: 2020-10-16 12:55:39
 * @lastTime: 2020-12-30 15:59:37
 * @文件相对于项目的路径: /TrunkAdmin/src/views/Monitor.vue
 * @message: 
-->
<template>
  <div id="total">
    <div id="mapView">
      <div id="map"></div>
      <div id="errorTable">
        <Table
          :columns="errorTable"
          :data="errorData"
          id="cartable"
          :max-height="tableHeight"
        ></Table>
      </div>
      <div id="circle">
        <i-Circle
          :percent="circles"
          :size="100"
          :stroke-width="8"
          :stroke-color="['#36c2a9', '#2d78c2']"
        >
          <span class="demo-Circle-inner" style="font-size: 24px"
            >{{ this.circles }}%</span
          >
        </i-Circle>
      </div>
    </div>
    <div id="mask" v-show="mesk"></div>
    <div id="inforbox" style="display: none">
      <div class="vehicleName">{{ this.vehicle }}</div>
      <ul>
        <li>电量：{{ this.infor.battery }}</li>
        <li>速度：{{ this.infor.velocity }}</li>
        <li>目的地：{{ this.infor.to_pos }}</li>
        <li>箱号：{{ this.infor.container_id }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from "../libs/utils.js";
import "maptalks/dist/maptalks.css";
import * as maptalks from "maptalks";
import * as THREE from "three";
import { ThreeLayer } from "maptalks.three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader";

import Radar from "../components/map/threeModule/Radar.js";
import { Coordinate } from "@antv/g2plot/lib/dependents";
import { PositionalAudio } from "three";
export default {
  data() {
    return {
      zooming: false,
      tableFlag:false,
      vehicleDate: "",
      infor: {},
      vehicle: "",
      mesk: false,
      circles: 0,
      options: {
        // center: [388402.9144648426, 3318054.14004678],
        // zoom: 8.45,
        // center: [388648.9144648426, 3317906.14004678],
        center: [389600.28700449486, 3317694.9364212025],
        zoom: 6.35,
        seamlessZoom: false,
        hitDetect: false, //	是否为此地图上的光标样式启用图层命中检测，请禁用它以提高性能。
        zoomControl: false,
        scaleControl: false,
        overviewControl: false,
        attribution: false,
        pitch: 0,
        // bearing: -119.1999999999998,
        bearing: 0,
        spatialReference: {
          projection: "identity",
        },
      },
      mapConfig: {
        center: [388328.2281792933, 3318239.113994352],
        zoom: 8.3,
        pitch: 0,
        bearing: 61.00000000000002,
      },
      carList: {
        point: [],
        text: [],
      },
      title: [],
      infoWindow: "",
      posploy: [
        [388689.9853229673, 3318205.0801666407],
        [388648.7522649148, 3318279.466572268],
        [388674.4660841727, 3318293.719974844],
        [388715.6991422252, 3318219.3335692165],
      ],
      errorTable: [
        {
          title: "车辆编号",
          align: "center",
          key: "name",
          render: (h, params) => {
            return h("div", [
              h("div", {
                class: {
                  loginStatus: params.row.is_login == "0",
                },
                style: {
                  width: "10px",
                  height: "10px",
                  display: "inline-block",
                  marginRight: "5px",
                  background: "rgb(8,240,0)",
                  borderRadius: "50%",
                },
              }),
              h(
                "strong",
                {
                  style: {
                    marginLeft: "2px",
                    color: this.flag == true ? "#314dfe" : "black",
                    border: 0,
                    cursor: "pointer",
                  },
                  on: {
                    click: (value) => {
                      this.location(params.row.name);
                    },
                  },
                },
                params.row.name
              ),
            ]);
          },
        },
        // {
        //   title: "操作",
        //   key: "action",
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "span",
        //         {
        //           props: {
        //             size: "small",
        //           },
        //           style: {
        //             cursor: "pointer",
        //             color: "#2d8cf0",
        //             border: 0,
        //           },
        //           on: {
        //             click: () => {
        //               this.estop(params);
        //             },
        //           },
        //         },
        //         "estop"
        //       ),
        //     ]);
        //   },
        // },
      ],
      errorData: [],
      error: "T501错误 ",
      flag: false,
      tableHeight: 0,
    };
  },
  mounted() {
    this.creatData();
    this.getList();
    //  数据更新
    // this.time();
    this.loading();
  },
  beforeDestroy() {
    clearInterval(this.time);
  },
  methods: {
    creatData() {
      var that = this;
      for (let i = 0; i < 13; i++) {
        that.carList.point.push([0, 0]);
        if (i < 9) {
          that.carList.text.push("T50" + (i + 1));
        } else {
          that.carList.text.push("T5" + (i + 1));
        }
      }
    },
    getData() {
      var that = this;
      var errorData = [];
      var carList = [];
      carList.point = [];
      carList.text = [];
      $.ajax({
        url: "/api/truck",
        method: "get",
      }).then((res) => {
        that.vehicleDate = res.vehs;
        for (var i = 0; i < that.vehicleDate.length; i++) {
          that.vehicleDate[i].to_pos == null || that.vehicleDate[i].to_pos == 0
            ? (that.vehicleDate[i].to_pos = "无")
            : that.vehicleDate[i].to_pos;
          that.vehicleDate[i].container_id == null ||
          that.vehicleDate[i].container_id == 0
            ? (that.vehicleDate[i].container_id = "无")
            : that.vehicleDate[i].container_id;
          carList.point.push(that.vehicleDate[i].position);
          errorData.push(that.vehicleDate[i]);
          carList.text.push(that.vehicleDate[i].name);
        }
        that.errorData = errorData;
        that.carList = carList;
        that.updata();
      });
    },
    async getList() {
      let { data } = await $.api.getJson("/json/map.lan");
      // geoJson 数据重组
      for (let i = 0; i < data.length; i++) {
        data[i].type = "Feature";

        data[i].geometry.coordinates = data[i].geometry.paths;

        var num = data[i].geometry.coordinates.length;

        if (num == 1) {
          // 数组降维
          data[i].geometry.coordinates = data[i].geometry.coordinates[0];
          data[i].geometry.type = "LineString";
        } else {
          data[i].geometry.type = "MultiLineString";
        }

        // maptalks 数据重组
        data[i].properties = data[i].attributes;
        data[i].properties.type = data[i].geometry.type;
        data[i].symbol.lineColor = data[i].symbol.color;
        data[i].symbol.lineWidth = data[i].symbol.width;
      }

      this.mapData = data;

      this.initMap();
    },
    initMap() {
      var that = this;

      this.map = new maptalks.Map("map", that.options);
      // 地图绑定事件

      this.map.on("click", function (param) {
        console.log(
          "点击位置: " + param.coordinate.toFixed(5).toArray().join()
        );
        console.info("getCenter: " + JSON.stringify(that.map.getCenter()));
        console.info("getPitch: " + that.map.getPitch());
        console.info("getBearing: " + that.map.getBearing());
        console.info("getZoom: " + that.map.getZoom());
        that.vehicle = "";
        that.location("");
      });
      var collection = this.mapData;

      setTimeout(() => {
        this.map
          .setBearing(this.mapConfig.bearing)
          .setZoom(this.mapConfig.zoom)
          .setCenter(this.mapConfig.center);

        // 宽高自适应
        let mapView = document.getElementById("mapView");
        let width_map = window.getComputedStyle(mapView).width;
        let height_map = window.getComputedStyle(mapView).height;
        console.log(height_map);
        this.tableHeight = parseInt(height_map) - 50;

        let map = document.getElementById("map");
        map.style.width = "100%";
        map.style.height = "100%";
      }, 2000);

      //  图片图层
      var imageLayer = new maptalks.ImageLayer("images", [
        {
          url: "./backgroundAll.png",
          extent: [
            that.map.getExtent().xmin,
            that.map.getExtent().ymin,
            that.map.getExtent().xmax,
            that.map.getExtent().ymax,
          ],

          opacity: 1,
        },
      ]);

      this.map.addLayer(imageLayer);

      //  航拍图层图层
      var imageLayerFly = new maptalks.ImageLayer("images_fly", [
        {
          url: "./backgroundFly.png",
          extent: [
            that.map.getExtent().xmin,
            that.map.getExtent().ymin,
            that.map.getExtent().xmax,
            that.map.getExtent().ymax,
          ],

          opacity: 0,
        },
      ]);

      // this.map.addLayer(imageLayerFly);
      var vectorLayer = new maptalks.VectorLayer("mapLine.", collection)
        .addTo(this.map)
        .setStyle({
          symbol: [
            {
              lineColor: "rgba(150,150,150,0.2)",
              lineWidth: 1,
            },
          ],
        });

      //3D图层
      this.threeLayer = new ThreeLayer("threeLayer", {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        animation: true,
      });
      // this.threeLayer.setZIndex(10);
      this.threeLayer.prepareToDraw = function (gl, scene, camera) {
        var light = new THREE.AmbientLight("#fff");
        scene.add(light);

        //创建模型
        that.creatRadar();
        that.addPoint();
        that.createTool();
        that.creatBoxs();
        that.createPos();

        that.time = setInterval(() => {
          that.getData();
        }, 30);
        this.map.setMinZoom(5);
        this.map.setMaxZoom(12);
      };

      this.threeLayer.addTo(this.map);

      // 画图工具
      // var layer = new maptalks.VectorLayer("vector").addTo(this.map);

      // var drawTool = new maptalks.DrawTool({
      //   mode: "Point",
      // })
      //   .addTo(this.map)
      //   .disable();

      // drawTool.on("drawend", function (param) {
      //   console.log(param.geometry);
      //   layer.addGeometry(param.geometry);
      // });

      // var items = ["Rectangle"].map(function (value) {
      //   return {
      //     item: value,
      //     click: function () {
      //       drawTool.setMode(value).enable();
      //     },
      //   };
      // });

      // var toolbar = new maptalks.control.Toolbar({
      //   items: [
      //     {
      //       item: "Shape",
      //       children: items,
      //     },
      //     {
      //       item: "Disable",
      //       click: function () {
      //         drawTool.disable();
      //       },
      //     },
      //     {
      //       item: "Clear",
      //       click: function () {
      //         layer.clear();
      //       },
      //     },
      //   ],
      // }).addTo(this.map);

      // this.loadPointCloud();
      //   this.loadRoad();
    },
    // 车号
    addPoint() {
      var that = this;
      var carList = this.carList;
      var layer = new maptalks.VectorLayer("point", {
        enableAltitude: true,
        zIndex: 10,
      }).addTo(that.map);
      for (let i = 0; i < carList.point.length; i++) {
        that.title[i] = new maptalks.Marker(carList.point[i], {
          visible: true,
          editable: true,
          cursor: "pointer",
          shadowBlur: 0,
          shadowColor: "black",
          draggable: false,
          dragShadow: false, // display a shadow during dragging
          drawOnAxis: null, // force dragging stick on a axis, can be: x, y
          symbol: [
            {
              markerFile: "./carMini.png",
              markerWidth: 10,
              markerHeight: 30,
              markerRotation: 0,
              markerDy: 15,
            },
            {
              textFaceName: '"microsoft yahei",arial,sans-serif',
              textName: carList.text[i],
              textFill: "white",
              textHorizontalAlignment: "right",
              textSize: 12,
              textDx: -12,
              textDy: 18,
            },
          ],
        });
        that.title[i].on("mouseover mouseout", function (e) {
          if (e.type === "mouseover") {
            that.vehicle = carList.text[i];
          } else {
            that.vehicle = "";
          }
        });
        that.title[i].addTo(layer, true);
      }
    },
    // 加载3D车模型
    // creatCar() {
    //   var that = this;
    //   var loader = new GLTFLoader();

    //   loader.load(
    //     "./car.glb",
    //     function (gltf) {
    //       for (let i = 0; i < 13; i++) {
    //         // console.log(that.carList.text[i]);
    //         var model = gltf.scene;
    //         model = model.clone();
    //         model.name = that.carList.text[i];
    //         model.rotation.x = Math.PI / 2;
    //         model.rotation.y = 0 - Math.PI / 4.5;

    //         model.scale.set(3.5, 5, 5);
    //         model.position.copy(that.threeLayer.coordinateToVector3([0, 0]));

    //         // 矫正
    //         model.translateZ(5.5);
    //         // model.translateY(-100);
    //         // model.translateX(50);
    //         that.threeLayer.addMesh(model);
    //       }
    //       // console.log("加载完成");
    //     },
    //     function (xhr) {
    //       this.circles = ((xhr.loaded / xhr.total) * 100).toFixed(2);
    //       // console.log(this.circles);
    //     },
    //     function (e) {
    //       console.error(e);
    //     }
    //   );
    // },
    creatRadar() {
      var that = this;
      var SIZE = 512;
      var canvas = document.createElement("canvas");
      canvas.width = canvas.height = SIZE / 2;
      var ctx = canvas.getContext("2d");

      var color = "#08F000";

      var material;

      function getMaterial(fillColor) {
        ctx.clearRect(0, 0, SIZE / 2, SIZE / 2);
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = fillColor;
        ctx.arc(SIZE / 4, SIZE / 4, 10, 0, Math.PI * 2);

        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = fillColor;
        ctx.lineWidth = 25;
        ctx.beginPath();
        ctx.arc(SIZE / 4, SIZE / 4, 60, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();

        ctx.shadowColor = "rgba(8, 240, 0, 0.3)";
        ctx.shadowBlur = 50;
        ctx.beginPath();
        ctx.arc(SIZE / 4, SIZE / 4, 100, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();

        if (!material) {
          var texture = new THREE.Texture(canvas);
          texture.needsUpdate = true; //使用贴图时进行更新
          material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
          });
        } else {
          material.map.needsUpdate = true;
        }
        return material;
      }
      var lnglats = this.carList.point;
      var text = Math.round(Math.random() * 10000);
      material = getMaterial(color);

      that.radar = lnglats.map(function (lnglat) {
        var circle = new Radar(
          lnglat,
          {
            radius: 15,
          },
          material,
          that.threeLayer
        );
        return circle;
      });
      that.threeLayer.addMesh(that.radar);
    },
    creatBoxs() {
      this.infor = {
        battery: 0,
        velocity: 0,
        to_pos: "无",
        container_id: "无",
      };
      var options = {
        content: document.getElementById("inforbox"),
        width: 200,
        minHeight: 120,
        fontSize: "14px",
        fontWeight: 800,
        autoOpenOn: null, //set to null if not to open window when clicking on map
        //'autoCloseOn' : 'click'
      };
      this.infoWindow = new maptalks.ui.InfoWindow(options);
      this.infoWindow.addTo(this.map).hide();
    },
    createTool() {
      var that = this;

      var toolbar = new maptalks.control.Toolbar({
        position: "top-right",
        items: [
          {
            item:
              "Table",
            click: function () {
              that.tableFlag = !that.tableFlag
              if(that.tableFlag == true){
                  document.getElementById('errorTable').style.display='none'
              }else {
                  document.getElementById('errorTable').style.display='block'
              }
            },
          },
          {
            item:
              "<Icon type='md-refresh' class='ivu-icon ivu-icon-md-refresh' style='font-size:20px;'/>",
            click: function () {
              that.map.animateTo(that.mapConfig, { duration: 1000 });
            },
          }
        ],
      }).addTo(this.map);
    },
    createPos() {
      var that = this;
      var layer = new maptalks.VectorLayer("pos", {
        enableAltitude: true,
        zIndex: 5,
      }).addTo(that.map);

      var marker = new maptalks.Marker([388696.58565, 3318281.97061], {
        symbol: {
          textFaceName: "sans-serif",
          textName: "停车场",
          textFill: "#34495e",
          textHorizontalAlignment: "right",
          textSize: 14,
        },
      }).addTo(layer);
      var polygon = new maptalks.Polygon(
        [
          [
            that.posploy[0],
            that.posploy[1],
            that.posploy[2],
            that.posploy[3],
            that.posploy[0],
          ],
        ],
        {
          visible: true,
          editable: true,
          cursor: "pointer",
          shadowBlur: 0,
          shadowColor: "black",
          draggable: false,
          dragShadow: false, // display a shadow during dragging
          drawOnAxis: null, // force dragging stick on a axis, can be: x, y
          symbol: {
            lineColor: "#34495e",
            lineWidth: 1,
            polygonFill: "rgba(165,174,183,0.5)",
            polygonOpacity: 0.6,
          },
        }
      ).addTo(layer);
    },
    PointInPoly(point, poly) {
      for (var c = false, i = -1, j = 3; ++i < 4; j = i)
        ((poly[i].y <= point.y && point.y < poly[j].y) ||
          (poly[j].y <= point.y && point.y < poly[i].y)) &&
          point.x <
            ((poly[j].x - poly[i].x) * (point.y - poly[i].y)) /
              (poly[j].y - poly[i].y) +
              poly[i].x &&
          (c = !c);
      return c;
    },
    updata() {
      this.zooming = this.map.isZooming();
      var that = this;
      // 获取数据
      var point = this.carList.point;
      var point_box;
      // 更新车的位置 更新info位置
      for (let i = 0; i < that.vehicleDate.length; i++) {
        // let car = this.threeLayer
        //   .getScene()
        //   .getObjectByName(that.vehicleDate[i].name);
        // if (car) {
        //   let position = this.threeLayer.coordinateToVector3(
        //     this.carList.point[i]
        //   );
        //   car.position.copy(position);
        //   // 模型矫正
        //   car.translateZ(5);
        //   // car.translateX(-2.5);
        //   car.rotation.y = JSON.parse(that.vehicleDate[i].rotation_y) - Math.PI;
        // }
        // 组装box数据
        if (that.vehicle == that.vehicleDate[i].name) {
          that.infor = {
            battery: that.vehicleDate[i].battery,
            velocity: that.vehicleDate[i].velocity,
            to_pos: that.vehicleDate[i].to_pos,
            container_id: that.vehicleDate[i].container_id,
          };
          point_box = {
            x: that.vehicleDate[i].position[0],
            y: that.vehicleDate[i].position[1],
          };
        }
        var p;
        if (this.map.getLayer("point")) {
          for (var m = 0; m < that.title.length; m++) {
            if (that.zooming == true) {
              if (that.map.getZoom() < 12) {
                if (that.map.getZoom() > 11) {
                  that.title[m].updateSymbol({
                    markerWidth: (10 / 7.95) * that.map.getZoom() * 3,
                    markerHeight: (30 / 7.95) * that.map.getZoom() * 3,
                    textSize: (12 / 7.95) * that.map.getZoom(),
                    textDy: -30,
                    markerDy: (30 / 7.95) * that.map.getZoom() * 3,
                  });
                } else if (that.map.getZoom() < 11 && that.map.getZoom() > 9) {
                  that.title[m].updateSymbol({
                    markerWidth: (10 / 7.95) * that.map.getZoom() * 1.5,
                    markerHeight: (30 / 7.95) * that.map.getZoom() * 1.5,
                    textSize: (12 / 7.95) * that.map.getZoom(),
                    textDy: -30,
                    markerDy: (30 / 7.95) * that.map.getZoom() * 1.5,
                  });
                } else {
                  that.title[m].updateSymbol({
                    markerWidth: ((10 / 7.95) * that.map.getZoom()) / 1.5,
                    markerHeight: ((30 / 7.95) * that.map.getZoom()) / 1.5,
                    textSize: ((12 / 7.95) * that.map.getZoom()) / 1.2,
                    markerDy: 15,
                  });
                }
              }
              // console.log(that.map.getZoom());
            }

            if (
              that.title[m].getSymbol()[1].textName == that.vehicleDate[i].name
            ) {
              var poly = [
                { x: 388648.3261518857, y: 3318278.949497487 },
                { x: 388713.1784051996, y: 3318163.147466782 },
                { x: 388756.5632700984, y: 3318187.444158438 },
                { x: 388691.71101674816, y: 3318303.2461897247 },
              ];
              p = {
                x: that.vehicleDate[i].position[0],
                y: that.vehicleDate[i].position[1],
              };
              var result = that.PointInPoly(p, poly);
              that.title[m].setCoordinates(p);
              // console.log(result);
              if (result == true) {
                if (that.map.getZoom() > 7) {
                  that.title[m].updateSymbol({
                    markerRotation:
                      (that.vehicleDate[i].rotation_y * 180) / Math.PI - 30,
                    markerDx: 20,
                    markerDy: 20,
                    textDy: -20,
                  });
                } else {
                  that.title[m].updateSymbol({
                    markerRotation:
                      (that.vehicleDate[i].rotation_y * 180) / Math.PI - 30,
                    markerDx: 0,
                    textDy: 18,
                  });
                }
              } else {
                that.title[m].updateSymbol({
                  markerRotation:
                    (that.vehicleDate[i].rotation_y * 180) / Math.PI - 30,
                  markerDx: 0,
                  markerDy: 15,
                  textDy: 18,
                });
              }
            }
          }
        }
      }
      // 更新雷达位置
      this.radar.forEach(function (mesh, i) {
        if (that.vehicleDate[i]) {
          if (
            that.vehicleDate[i].velocity != 0.0 ||
            that.vehicleDate[i].velocity != 0
          ) {
            point[i].push(0);
            let position = that.threeLayer.coordinateToVector3(point[i]);
            mesh.getObject3d().position.copy(position);
          } else {
            let position = that.threeLayer.coordinateToVector3([0, 0, 1]);
            mesh.getObject3d().position.copy(position);
          }
        }
      });

      // 更新box位置
      if (that.vehicle == "") {
        that.infoWindow.hide();
      } else {
        document.getElementById("inforbox").style.display = "block";
        that.infoWindow.show(point_box);
        document.getElementsByClassName("maptalks-close")[0].style.display =
          "none";
      }
    },
    // 定位
    location(vehicle) {
      var that = this;
      var cell = document
        .getElementById("cartable")
        .getElementsByTagName("table")[1];
      for (var i = 0; i < this.errorData.length; i++) {
        cell.rows[i].cells[0].getElementsByTagName("strong")[0].className =
          "nothing";
      }
      if (this.vehicle == vehicle) {
        this.vehicle = "";
        that.map.animateTo(
          {
            center: that.mapConfig.center,
            zoom: that.mapConfig.zoom,
          },
          { duration: 1000 }
        );
      } else {
        var position;
        var index;
        for (var j = 0; j < that.vehicleDate.length; j++) {
          if (that.vehicleDate[j].name == vehicle) {
            position = that.vehicleDate[j].position;
            index = j;
          }
        }
        if (position[0] != 0) {
          console.log(position);
          this.vehicle = vehicle;
          cell.rows[index].cells[0].getElementsByTagName(
            "strong"
          )[0].className = "select";
          that.map.animateTo(
            {
              center: position,
              zoom: 9,
            },
            { duration: 1000 }
          );
        }
      }
    },
    estop(data) {
      console.log(data.row.ip);
    },
    // 错误提示
    time() {
      this.$Notice.open({
        name: "demo1",
        desc: "T501错误",
        render: (h) => {
          return h(
            "span",
            {
              style: {
                color: "#FF3333",
              },
            },
            [this.error, h("a", "查看详情")]
          );
        },
      });
    },
    // 进度条加载
    loading() {
      // var circles = 0;
      var that = this;
      var add = function () {
        that.mesk = true;
        that.circles = that.circles + 1;
        // console.log(that.circles);
        if (that.circles > 100) {
          clearInterval(time);
          document.getElementById("circle").style.display = "none";
          that.mesk = false;
        }
      };
      var time = setInterval(add, 40);
    },
  },
};
</script>

<style lang="less">
.ivu-layout-content {
  width: 100%;
  height: 100%;
}
.ivu-table .demo-table-row td {
  background-color: #2db7f5;
  color: #fff;
}

#total {
  width: 100%;
  height: 100%;
  position: relative;
  .ivu-table-wrapper {
    box-shadow: 10px 10px 5px rgba(82, 82, 82, 0.3);
  }
  .ivu-table {
    background: rgba(237, 237, 237, 1);
  }
  .maptalks-toolbar-horizonal li {
    background: rgba(237, 237, 237, 1);
    box-shadow: 5px 5px 5px rgba(82, 82, 82, 0.3);
    color: #000000;
  }
  .ivu-layout-footer {
    z-index: 1000;
  }
  #mapView {
    width: 100%;
    height: 100%;
    padding: 8px;
    overflow: hidden;

    #map {
      // width: 100%;
      // height: 100%;
      width: 1672px;
      height: 1034px;
      background: rgba(240, 240, 240, 1);
      overflow: hidden;
    }
    #errorTable {
      position: absolute;
      top: 40px;
      left: 50px;
      width: 100px;
      z-index: 100;
      .loginStatus {
        background: rgb(111, 123, 149) !important;
      }
      .select {
        color: blue !important;
      }
    }
    #circle {
      width: 60px;
      height: 60px;
      position: absolute;
      left: 50%;
      top: 45%;
      z-index: 99999;
    }
  }
  #mask {
    width: 100%;
    height: calc(100% + 60px);
    background: rgba(255, 255, 255, 1);
    position: absolute;
    top: 0;
    z-index: 999;
  }
  #inforbox {
    .vehicleName {
      font-weight: 800;
      font-size: 20px;
      margin-top: -10px;
      margin-bottom: 5px;
    }
  }
}
</style>