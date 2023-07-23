const WebSocket = require("ws");
const { nanoid } = require("nanoid");
const { getTargetInfo } = require("../utils/proxy");
const { getRecordInfo, recordWsData } = require("../utils/record");
const { getReplayInfo, replayWsData } = require("../utils/replay");

module.exports = function (options) {
  // https://juejin.cn/s/nodejs%20express%20websocket%20proxy
  // https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/websocket.md
  return async (ctx, next) => {
    const { originalUrl, req, res, query, path, app, serverIp } = ctx;
    // const clientIp = requestIp.getClientIp(req);
    console.log("ws proxy middleware: --------------------------------");

    // todo 录制配置
    const recordOpts = {
      record: true, // 开启录制开关
      rules: [
        {
          apiType: "ws", // 接口类型
          apiRegex: "^/api/scene/*", // 录制匹配路由规则
          checked: true, // 是否选中
        },
        {
          apiType: "ws",
          apiRegex: "^/city_brain_tfc_test/trafficproduct/*",
          checked: true,
        },
      ],
    };

    // todo 回放配置，需要考虑不同客户端
    const replayOpts = {
      replay: true, // 开启回放开关
      rules: [
        {
          apiType: "ws",
          apiRegex: "^/api/*", // 回放匹配路由规则
          checked: true, // 是否选中
          sourceId: "%3A%3Affff%3A127.0.0.1", // 需要指定源ID，对应的是录制的客户端clientIp
        },
        {
          apiType: "ws",
          apiRegex: "^/city_brain_tfc_test/trafficproduct/*", // 回放匹配路由规则
          checked: true, // 是否选中
          sourceId: "%3A%3Affff%3A127.0.0.1", // 需要指定源ID，对应的是录制的客户端clientIp
        },
      ],
    };

    // todo 需要动态读取代理配置
    const opts = {
      target: "ws://127.0.0.1:7001",
      pathRewrite: {
        "^/proxy": "",
      },
      heartbeatInterval: 5000,
      onProxyReqWs() {
        console.log("ws proxy request");
      },
      onProxyResWs() {
        console.log("ws proxy response");
      },
    };

    // const opts = {
    //   proxy: true,
    //   rules: [
    //     {
    //       apiType: "ws",
    //       pathRegex: "/api/scene/*", // 代理匹配路由正则
    //       checked: true, // 是否选中
    //       pathRewrite: {
    //         // 路径正则替换
    //         "^/proxy": "",
    //       },
    //       targetPrefix: "ws://127.0.0.1:7001", // 目标服务请求前缀
    //     },
    //     {
    //       apiType: "ws",
    //       apiRegex: "/city_brain_tfc_test/trafficproduct/*",
    //       checked: true,
    //       targetPrefix: "wss://dataq-cn-shanghai.aliyuncs.com",
    //       pathRewrite: {
    //         "^/proxy": "",
    //       },
    //     },
    //   ],
    // };

    if (ctx.websocket) {
      // 每一个建立socket链接分配一个唯一标识
      let socketUuid = nanoid();
      let subscriber = null;
      let heartbeatTimer = null;

      const targetInfo = getTargetInfo({ opts, query, path });

      // 获取请求录制信息
      let recordInfo = getRecordInfo({ apiType: "ws", recordOpts, targetInfo });

      // 获取回放信息
      let replayInfo = getReplayInfo({
        apiType: "ws",
        replayOpts,
        targetInfo,
        app,
      });

      const stopHeartbeat = () => {
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
        }
        heartbeatTimer = null;
      };
      const closeSocket = () => {
        ctx.websocket.close();
        stopHeartbeat();
        if (subscriber) {
          subscriber.close();
        }

        // 若开启接口回放，则停止读取回放数据
        app.messenger.sendToAgent("stopReplayWs", { socketUuid, replayInfo });
      };

      if (replayInfo.status) {
        // 开始回放数据
        replayWsData({
          socketUuid,
          replayInfo,
          targetInfo,
          app,
          replayWsDataCb: (params = {}) => {
            const { dataString, socketUuid: uuid } = params || {};
            // 由于agent会向多个app worker发送回放数据，需要app worker匹配socketUuid
            if (uuid === socketUuid) {
              ctx.websocket.send("回放数据：" + dataString);
            }
          },
        });
      } else {
        // 非回放情况下，向目标地址订阅socket
        if (targetInfo.url) {
          subscriber = new WebSocket(
            // `ws://127.0.0.1:7001/api/scene/getList?aaa=111&bbb=222`
            `${targetInfo.url}`
          );
          subscriber
            .on("open", () => {
              console.log(`real ws connection established: ${targetInfo.url}`);
            })
            .on("message", (msg) => {
              // console.log("received: %s", msg.toString());
              ctx.websocket.send(msg.toString());

              // 录制数据
              if (recordInfo.status) {
                recordWsData({
                  msg,
                  app,
                  recordInfo,
                  targetInfo,
                  socketUuid,
                  clientIp: req.clientIp, // 客户端请求ip
                  serverIp,
                });
              }
            })
            .on("error", (err) => {
              // console.error(err);
              closeSocket();
            })
            .on("close", () => {
              closeSocket();
            });
        }
      }

      // 监听客户端socket
      ctx.websocket
        .on("message", (msg) => {
          // console.log("receive", msg.toString());
          if (subscriber) {
            subscriber.send(msg.toString());
          }
        })
        .on("close", (code, reason) => {
          // console.log("websocket closed", code, reason);
          closeSocket();
        })
        .on("error", (error) => {
          // console.log("websocket error", error);
          closeSocket();
        });
    }

    await next();
  };
};
