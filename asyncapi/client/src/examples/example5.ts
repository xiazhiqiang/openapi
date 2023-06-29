import { renderData } from "client/utils";

/**
 * 简单Demo
 */
export default () => {
  const url = "ws://127.0.0.1:3000/proxy/scene/getList?abc=111";
  const ws = new WebSocket(url);
  let timer1: any = null;
  ws.onopen = () => {
    // 发送必要数据
    ws.send(JSON.stringify({ msg: "w1连接成功！" }));

    // 定时发送心跳请求
    timer1 = setInterval(() => {
      ws.send(JSON.stringify({ msg: "w1心跳数据" }));
    }, 3000);
  };
  ws.onmessage = (e) => {
    renderData(e.data);
  };
  ws.onerror = (err) => {
    console.log("err", err);
  };
  ws.onclose = (e) => {
    console.log("close", e);
    if (timer1) {
      clearInterval(timer1);
    }
    renderData("close connection");
  };

  // 不同路径的代理请求
  const url2 = "ws://127.0.0.1:3000/proxy/site/getCasesList?def=222";
  const ws2 = new WebSocket(url2);
  let timer2: any = null;
  ws2.onopen = () => {
    // 发送必要数据
    ws2.send(JSON.stringify({ msg: "ws2连接成功！" }));

    // 定时发送心跳请求
    timer2 = setInterval(() => {
      ws2.send(JSON.stringify({ msg: "ws2心跳数据" }));
    }, 3000);
  };
  ws2.onmessage = (e) => {
    renderData(e.data, "data2");
  };
  ws2.onclose = (e) => {
    console.log("close2", e);
    if (timer2) {
      clearInterval(timer2);
    }
    renderData("close connection", "data2");
  };
};
