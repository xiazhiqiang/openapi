import { renderData } from "./index";

/**
 * 简单Demo
 */
export default (url) => {
  const ws = new WebSocket(url);

  let heartbeatTimer = null;
  ws.onopen = () => {
    const data = {
      frameInterval: 1500, // 数据更新间隔时间，单位ms
    };

    // 发送必要数据
    ws.send(JSON.stringify(data));

    // 定时发送心跳请求
    heartbeatTimer = setInterval(() => {
      ws.send(JSON.stringify({ msg: "心跳数据" }));
    }, 3000);
  };

  ws.onerror = (error) => {
    console.log("error", error);
  };

  ws.onmessage = (e) => {
    // console.log("data", e.data);
    renderData(e.data);
  };

  ws.onclose = (event) => {
    console.log("close", event);
    renderData("close connection");
    heartbeatTimer && clearInterval(heartbeatTimer);
  };
};
