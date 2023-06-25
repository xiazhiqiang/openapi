import { renderData } from "client/utils";

/**
 * 简单Demo
 */
export default () => {
  const url = "ws://127.0.0.1:3000/proxy/scene/getList?abc=111";
  const ws = new WebSocket(url);
  ws.onmessage = (e) => {
    renderData(e.data);
  };
  ws.onclose = (e) => {
    console.log("close", e);
    renderData("close connection");
  };

  // // 不同路径的代理请求
  // const url2 = "ws://127.0.0.1:3000/proxy/site/getCasesList?def=222";
  // const ws2 = new WebSocket(url2);
  // ws2.onmessage = (e) => {
  //   renderData(e.data, "data2");
  // };
  // ws2.onclose = (e) => {
  //   console.log("close", e);
  //   renderData("close connection", "data2");
  // };

  // let heartbeatTimer: any = null;

  // ws.onopen = () => {
  //   // 发送必要数据
  //   ws.send(
  //     JSON.stringify({
  //       abc: 111,
  //     }),
  //   );

  //   // 定时发送心跳请求
  //   heartbeatTimer = setInterval(() => {
  //     ws.send(JSON.stringify({ msg: "心跳数据" }));
  //   }, 3000);
  // };

  // ws.onerror = (error) => {
  //   console.log("error", error);
  // };

  // ws.onmessage = (e) => {
  //   // console.log("data", e.data);
  //   renderData(e.data);
  // };

  // ws.onclose = (event) => {
  //   console.log("close", event);
  //   renderData("close connection");
  //   if (heartbeatTimer) {
  //     clearInterval(heartbeatTimer);
  //   }
  // };
};
