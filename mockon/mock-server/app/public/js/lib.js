/**
 * 模拟发起 http 代理请求
 */
export async function requestHttpProxy() {
  try {
    const data = { name: "John", age: 30 };
    const res = await (
      await fetch(
        // 真实服务：http://127.0.0.1:7001/scene/postInfo
        `http://127.0.0.1:7001/proxy/api/scene/postInfo?time=${+new Date()}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": _csrf_token, // 需要csrf token
          },
        }
      )
    ).json();
    console.log("http post response", res);
  } catch (e) {
    console.log("http post error", e);
  }

  try {
    const res = await (
      await fetch(
        // 真实服务：http://127.0.0.1:7001/scene/getInfo
        `http://127.0.0.1:7001/proxy/api/scene/getInfo?name=John&time=${+new Date()}`
      )
    ).json();
    console.log("http get response", res);
  } catch (e) {
    console.log("http get error", e);
  }
}

/**
 * 模拟发起 ws 代理请求
 */
export async function requestWsProxy() {
  let timer = null;
  let heartbeatInterval = 3000;

  window.ws = new WebSocket(
    // 真实服务:：ws://127.0.0.1:7001/api/scene/getList
    `ws://127.0.0.1:7001/proxy/api/scene/getList?aaa=111&bbb=222`
  );

  const closeSocket = () => {
    if (timer) {
      clearInterval(timer);
    }
    timer = null;
    if (ws) {
      ws.close();
    }
  };

  ws.onopen = function () {
    console.log("connection established");

    // 更新频率
    ws.send(JSON.stringify({ frameInterval: 4000 }));

    // 心跳检查
    timer = setInterval(() => {
      ws.send(JSON.stringify({ msg: "heartbeat check" }));
    }, heartbeatInterval);
  };
  ws.onmessage = function (event) {
    console.log("Received message:", event.data);
  };
  ws.onclose = function () {
    console.log("close");
    closeSocket();
  };
  ws.onerror = function (err) {
    console.log("error:", err);
    closeSocket();
  };
}
