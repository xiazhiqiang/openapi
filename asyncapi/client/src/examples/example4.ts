/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { renderData } from "../utils/index";
import {
  wsproxy_traffic_getTrackData_interId_pub,
  wsproxy_traffic_getTrackData_interId_sub,
} from "../wsservices/channels/wsproxyTrafficGetTrackDataInterId";
import { DefaultWsRequestClass, overwriteWsClass } from "../wsservices/index";

overwriteWsClass(
  class WsRequest extends DefaultWsRequestClass {
    heartbeatTimer;

    constructor(props) {
      super(props);
      this.heartbeatTimer = null;
    }

    openHandler(onOpen, p) {
      let { ws } = p || {};
      // 心跳
      this.heartbeatTimer = null;

      // 定时发送心跳请求
      this.heartbeatTimer = setInterval(() => {
        ws.send(JSON.stringify({ msg: "心跳数据", query: p.query }));
      }, 3000);

      onOpen(p);
    }

    closeHandler(onClose, p) {
      onClose(p);

      // 停止心跳
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    }
  },
);

/**
 * 在example3的基础上，增加覆写默认内置默认ws请求实现
 */
export default function () {
  // const url = "ws://127.0.0.1:3000/wsproxy/traffic/getTrackData?id=123";

  wsproxy_traffic_getTrackData_interId_sub({
    query: {
      id: 123,
    },
    onOpen: ({ ws }) => {
      const data = {
        frameInterval: 1500, // 数据更新间隔时间，单位ms
      };

      // 发送必要数据
      wsproxy_traffic_getTrackData_interId_pub({ ws, data });
    },
    onMessage: ({ ws, msg, data }) => {
      // console.log("msg", msg);
      renderData(JSON.stringify(data));
    },
    onClose: ({ ws, event }) => {
      console.log("close", event);
      renderData("close connection");
    },
    onError: ({ error }) => {
      console.log("error", error);
    },
  });

  wsproxy_traffic_getTrackData_interId_sub({
    query: {
      id: 456,
    },
    onOpen: ({ ws }) => {
      const data = {
        frameInterval: 1500, // 数据更新间隔时间，单位ms
        abc: "xxxxxxxx",
      };

      // 发送必要数据
      wsproxy_traffic_getTrackData_interId_pub({ ws, data });
    },
    onMessage: ({ ws, msg, data }) => {
      // console.log("msg", msg);
      renderData(JSON.stringify(data), "data2");
    },
    onClose: ({ ws, event }) => {
      console.log("close", event);
      renderData("close connection", "data2");
    },
    onError: ({ error }) => {
      console.log("error", error);
    },
  });
}
