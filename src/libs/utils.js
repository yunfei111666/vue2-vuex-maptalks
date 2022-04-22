/*
 * @Author: JackFly
 * @since: 2020-06-19 17:45:00
 * @lastTime: 2021-09-10 17:34:16
 * @文件相对于项目的路径: /TrunkAdmin/src/libs/utils.js
 * @message:
 */
// 工具库

import axios from "axios";
import global from "../plugins/global.js";

import store from "../store/index.js";

let util = {};

util.ajax = axios.create({
  baseURL: "http://" + global.baseURL,
  timeout: 3000,
  // headers: {
  //   "Cache-Control": "no-cache",
  // },
});
//生产环境
// util.baseURL = window.location.hostname;
// util.baseURL = "127.0.0.1";

console.log(location);

// 开发环境
// util.baseURL = "192.168.3.119:9000";
// util.baseURL1 = "192.168.3.252:9000";

// 设置 post、put 默认 Content-Type
util.ajax.defaults.headers.post["Content-Type"] =
  "application/json;charset=utf-8";
util.ajax.defaults.headers.put["Content-Type"] =
  "application/json;charset=utf-8";
// util.ajax.defaults.headers.options['Content-Type'] = 'text/plain'

// 添加响应拦截器
util.ajax.interceptors.response.use(
  (response) => {
    // let Data = {
    //   status: response.status,
    //   url: response.config.baseURL + response.config.url,
    //   type: response.config.method,
    //   time: util.getTime(),
    // };
    // // 添加数据到indexedDB
    // global.addData(Data);

    return response.data;
  },
  (error) => {
    let info = {};
    let { status, statusText, data } = error.response;
    console.log(error.response);

    // // 组装数据
    // let errorData = {
    //   status: error.response.status,
    //   url: error.response.config.baseURL + error.response.config.url,
    //   type: error.response.config.method,
    //   time: util.getTime(),
    // };
    // // 添加数据到indexedDB
    // global.addData(errorData);

    if (!error.response) {
      info = {
        code: 5000,
        msg: "Network Error",
      };
    } else {
      // 此处整理错误信息格式
      info = {
        code: status,
        data: data,
        msg: statusText,
      };
    }
    return Promise.reject(info);
  }
);

// util.ajax.interceptors.request.use(
//   (request) => {
//     // 请求前 拦截器
//     var token = JSON.parse(localStorage.getItem("TOKEN"));
//     if (token) {
//       token = "TOKEN " + token;
//       request.headers.common["Authorization"] = token;
//     } else {
//       // 跳转登录
//     }
//     if (request.method === "post") {
//       request.data = qs.stringify(request.data);
//     }
//     return request;
//   },
//   (error) => {
//     console.log("错误的传参");
//     return Promise.reject(error);
//   }
// );

// 定制本地数据异步请求
util.api = {
  async getJson(url, data) {
    try {
      let res = await axios.get(url, { params: data });
      return new Promise((resolve) => {
        if (res.code === 0) {
          resolve(res);
        } else {
          resolve(res);
        }
      });
    } catch (err) {
      alert("服务器出错");
      console.log(err);
    }
  },
};

// 时间工具
util.dateFormat = function(timestamp) {
  var date = new Date(timestamp);
  var Y, M, D, h, m, s;
  Y = date.getFullYear() + "-";
  M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  D = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate() + " ";
  h =
    date.getHours() <= 9 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  // h = date.getHours() + ":";
  if (date.getMinutes() <= 9) {
    m = "0" + date.getMinutes() + ":";
  } else {
    m = date.getMinutes() + ":";
  }

  if (date.getSeconds() <= 9) {
    s = "0" + date.getSeconds();
  } else {
    s = date.getSeconds();
  }

  return Y + M + D + "       " + h + m + s; //时分秒可以根据自己的需求加上
};

// 获取当前时间戳
util.getTime = function() {
  let time = Date.parse(new Date());

  return time;
};
/**
 * @description: 获取最近的日期
 * @param {type} day：0表示当天日期，-7表示7天前日期
 * @return {type}
 */
util.getDay = function(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = util.doHandleMonth(tMonth + 1);
  tDate = util.doHandleMonth(tDate);
  return tYear + "-" + tMonth + "-" + tDate;
};
util.doHandleMonth = function(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
};
/**
 * @description: 显示几位整数
 * @param {type}
 * @return {type}
 */
util.fix = function(num, length) {
  return ("" + num).length < length
    ? (new Array(length + 1).join("0") + num).slice(-length)
    : "" + num;
};

export default util;
