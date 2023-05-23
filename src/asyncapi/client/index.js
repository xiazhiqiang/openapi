const url = "ws://127.0.0.1:3000/wsproxy/traffic/getTrackData?id=123";
const ws = new WebSocket(url);

let heartbeatTimer;
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

function renderData(dataObj = {}) {
  let dom = document.getElementById("data");
  if (!dom) {
    const dom = document.createElement("pre");
    dom.id = "data";
    dom.innerHTML = dataObj;
    document.body.appendChild(dom);
  } else {
    dom.innerHTML = dataObj;
  }
}

function wsService({
  path,
  prefix,
  params,
  onOpen,
  onError,
  onMessage,
  onClose,
}) {
  try {
    const socketUrl = `${prefix}${path}`;
    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      typeof onOpen === "function" && onOpen({ ws });
    };
    ws.onmessage = (msg) => {
      typeof onMessage === "function" && onMessage({ ws, msg });
    };
    ws.onerror = (err) => {
      typeof onError === "function" && onError({ ws, err });
    };
    ws.onclose = () => {
      ws.close();
      typeof onClose === "function" && onClose({ ws });
    };

    return ws;
  } catch (e) {
    return null;
  }
}
