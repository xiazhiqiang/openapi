/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { renderData } from "../utils/index";
import {
  wsproxy_traffic_getTrackData_interId_pub,
  wsproxy_traffic_getTrackData_interId_sub,
} from "../wsservices/channels/wsproxyTrafficGetTrackDataInterId";

/**
 * 使用接口协议对接的ws请求封装调用，内置了channel path，但需要支持传url
 */
export default function () {
  // const url = "ws://127.0.0.1:3000/wsproxy/traffic/getTrackData?id=123";

  // 心跳
  let heartbeatTimer: any = null;

  wsproxy_traffic_getTrackData_interId_sub({
    query: {
      id: 123,
    },
    onOpen: ({ ws }) => {
      const data = {
        frameInterval: 1500, // 数据更新间隔时间，单位ms
      };

      // 定时发送心跳请求
      heartbeatTimer = setInterval(() => {
        ws.send(JSON.stringify({ msg: "心跳数据" }));
      }, 3000);

      // 发送必要数据
      wsproxy_traffic_getTrackData_interId_pub({ ws, data });

      // ws.send(JSON.stringify(data));
    },
    onMessage: ({ ws, msg, data }) => {
      // console.log("msg", msg);
      renderData(JSON.stringify(data));
    },
    onClose: ({ ws, event }) => {
      console.log("close", event);
      renderData("close connection");

      // 停止心跳
      heartbeatTimer && clearInterval(heartbeatTimer);
    },
    onError: ({ error }) => {
      console.log("error", error);
    },
  });
}
