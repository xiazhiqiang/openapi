var express = require("express");
var expressWs = require("express-ws"); // 引入ws中间件
var router = express.Router();

expressWs(router); // ws中间件应用到路由中

router
  // 获取轨迹数据
  .ws("/traffic/getTrackData", function (ws, req) {
    ws.on("connection", function (e) {
      console.log("connection", e);
    });

    ws.on("message", function (msg) {
      let params = {};
      try {
        params = JSON.parse(msg);
      } catch (e) {}

      // todo 根据参数实时推送消息
      // ws.send();
    });

    ws.on("close", function (id) {
      console.log("close", id);
    });
  })
  //
  .ws("/traffic/getUserName", function (ws, req) {});

module.exports = router;
