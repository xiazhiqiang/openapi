var express = require("express");
var expressWs = require("express-ws"); // 引入ws中间件
var router = express.Router();

expressWs(router); // ws中间件应用到路由中

router
  // 获取轨迹数据
  .ws("/*", function (ws, req) {
    // console.log("connection ok", req.query);

    const interfacePath =
      (req.params["0"] || "").slice(0, 1) === "/"
        ? req.params["0"]
        : "/" + req.params["0"];
    const interfaceQuery = req.query || {};
    const reqHeaders = req.headers || {};

    // console.log("jinlaile", interfacePath, interfaceQuery, reqHeaders);

    const pathConfigMap = {
      "/scene/getList": {
        internal: 1000,
        data: {
          list: [
            {
              name: "轨迹",
            },
            {
              name: "灯态",
            },
          ],
        },
      },
      "/site/getCasesList": {
        internal: 2000,
        data: {
          list: [
            {
              caseName: "1111",
            },
            {
              caseName: "2222",
            },
          ],
        },
      },
    };

    // 根据路径及必要参数获取对应路径的请求定义、mock数据等
    let timer = null;

    // 发送数据给client
    const responseHandler = ({ query = {}, path = "" }) => {
      const config = pathConfigMap[path];
      if (!config) {
        return;
      }

      const response = {
        code: 200,
        data: {
          ...query,
          ...(config.data || {}),
          timestamp: +new Date(),
        },
      };

      // 优先根据query中的interval设置向client发送数据频率
      const internal = query.internal || config.internal;
      if (internal) {
        timer = setInterval(() => {
          response.data.timestamp = +new Date();
          ws.send(JSON.stringify(response));
        }, internal);
      } else {
        ws.send(JSON.stringify(response));
      }
    };

    responseHandler({ query: interfaceQuery, path: interfacePath });

    ws.on("message", function (msg) {
      const config = pathConfigMap[interfacePath];
      let params = {};
      try {
        // 解析message参数
        params = JSON.parse(msg);
      } catch (e) {}

      // 根据message中的参数更新
      const { frameInterval } = params || {};
      if (frameInterval && config && frameInterval !== config.internal) {
        interval = frameInterval;
        clearInterval(timer);
        timer = null;
        responseHandler({
          path: interfacePath,
          query: { ...interfaceQuery, ...params },
        });
      }
    });

    ws.on("close", function (id) {
      ws.close(id);
      console.log("close", id);
    });
  });

module.exports = router;
