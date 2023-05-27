function wsService({ url, params, callback }) {
  const ws = new WebSocket();
}

const url = "ws://127.0.0.1:3000/wsproxy/user/getUserInfo?id=123";
const ws = new WebSocket(url);

let heartbeatTimer;
ws.onopen = () => {
  const data = {
    frameInterval: 1000, // 数据更新间隔时间，单位ms
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
  console.log("data", e.data);
};

ws.onclose = (event) => {
  console.log("close", event);
  heartbeatTimer && clearInterval(heartbeatTimer);
};
