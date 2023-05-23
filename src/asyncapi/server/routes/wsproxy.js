var express = require("express");
var expressWs = require("express-ws"); // 引入ws中间件
var router = express.Router();

expressWs(router); // ws中间件应用到路由中

router
  // 获取轨迹数据
  .ws("/traffic/getTrackData", function (ws, req) {
    console.log("connection ok", req.query);

    let timer = null;
    let interval = 1000; // 数据发送间隔时间，单位ms

    // 定时推送数据给client
    const sendData = ({ data = {}, interval }) => {
      timer = setInterval(() => {
        ws.send(
          JSON.stringify({
            code: 200,
            data: {
              ...data,
              no: Math.round(Math.random() * 10e3),
              timestamp: +new Date(),
            },
          })
        );
      }, interval);
    };

    ws.on("message", function (msg) {
      let params = {};
      try {
        // 解析message参数
        params = JSON.parse(msg);
      } catch (e) {}

      // 根据message中的参数更新
      const { frameInterval } = params || {};
      if (frameInterval && frameInterval !== interval) {
        interval = frameInterval;
        clearInterval(timer);
        timer = null;
        sendData({ interval, data: req.query });
      }
    });

    ws.on("close", function (id) {
      console.log("close", id);
    });
  })
  //
  .ws("/traffic/getUserName", function (ws, req) {});

module.exports = router;
