const url = "ws://127.0.0.1:3000/wsproxy/user/getUserInfo?id=123";
const ws = new WebSocket(url);

ws.onopen = () => {
  const data = {
    frameInterval: 1000, // 数据更新间隔时间，单位ms
  };
  ws.send(JSON.stringify(data));
};

ws.onerror = (error) => {
  console.log("error", error);
};

ws.onmessage = (e) => {
  console.log("data", e.data);
};

ws.onclose = (event) => {
  console.log("close", event);
};
