/* 默认 Websocket 实现 */
const defaultWS = ({
  prefix = "",
  path = "",
  extra = {},
  onOpen,
  onError,
  onClose,
  onMessage,
}) => {
  if (!prefix) {
    // 若请求前缀为空，则修正为当前host+port的ws协议
    prefix = `ws://${location.hostname}${
      location.port ? ":" + location.port : ""
    }`;
  }

  if ("WebSocket" in window) {
    // 额外url参数，则替换
    if (extra && extra.url) {
      url = extra.url;
    }

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
  } else {
    console.log("浏览器不支持！");
  }
};

let _ws = defaultWS;

export const overrideWS = (baseWS) => {
  _ws = baseWS;
};

export { _ws as default };
