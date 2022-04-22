/*
 * @Author: JackFly
 * @since: 2020-06-19 17:45:00
 * @lastTime: 2021-09-10 17:36:31
 * @文件相对于项目的路径: /TrunkAdmin/src/plugins/global.js
 * @message:
 */
let global = {
  baseURL: window.location.hostname + ":9000",
  // baseURL: "47.97.172.84:8081/mock/11",
  // baseURL: "192.168.3.119:9000",
  // baseURL: "127.0.0.1:9000",
  data: {},

  // websocket
  ws: {},
  setWs: function(newWs) {
    this.ws = newWs;
  },
};

/* 对不同浏览器的indexedDB进行兼容 */
const indexeddb =
  window.indexedDB ||
  window.webkitIndexedDB ||
  window.mozIndexedDB ||
  window.msIndexedDB;

/* 创建或连接数据库 */
const request = indexeddb.open("myData", 1); // name：数据库名，version：数据库版本号
request.onerror = function(event) {
  console.log("数据库打开报错");
};

var db;
request.onsuccess = function(event) {
  db = request.result;
  console.log("数据库打开成功");
};

/**
 *新建数据库
 *
 * @param {*} event
 */
request.onupgradeneeded = function(event) {
  db = event.target.result;
  var objectStore;
  if (!db.objectStoreNames.contains("myData")) {
    objectStore = db.createObjectStore("myData", { autoIncrement: true });
    // objectStore.createIndex("url", "url", { unique: false });
    // objectStore.createIndex("type", "type", { unique: true });
  }
};

/**
 *写入数据
 *
 * @param {*} data
 */
global.addData = function(data) {
  // console.log(data);
  var add = db
    .transaction(["myData"], "readwrite")
    .objectStore("myData")
    .add(data);
  add.onsuccess = function(event) {
    // console.log("数据写入成功");
  };
  add.onerror = function(event) {
    console.log("数据写入失败");
  };
};

/**
 *读取数据
 *
 */
global.readData = function() {
  return new Promise((resolve, reject) => {
    var readData = db
      .transaction("myData")
      .objectStore("myData")
      .getAll();

    readData.onerror = function(event) {
      console.log("事务失败");
      reject("错误提示");
    };
    readData.onsuccess = function(event) {
      if (readData.result) {
        // 获取数据
        this.data = readData.result;
        resolve(readData.result);
      } else {
        console.log("未获得数据记录");
        reject("错误提示");
      }
    };
  });
};
export default global;
