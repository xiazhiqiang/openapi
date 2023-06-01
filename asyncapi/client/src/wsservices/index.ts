/**
 * 定义默认websocket默认实现
 * 支持覆写默认实现，这一层是为了外部覆写ws请求
 */

let _prefix: string;
let _ws: (p) => void | any;

/**
 * 默认 Websocket 实现，保持通用性
 */
export const defaultRequest = ({
  prefix = '',
  url = '',
  path = '',
  extra,
  onOpen,
  onError,
  onClose,
  onMessage,
}) => {
  try {
    if (!window.WebSocket) {
      throw new Error('浏览器不支持！');
    }

    // 全局替换prefix
    if (_prefix && _prefix !== prefix) {
      prefix = _prefix;
    }

    let socketUrl;

    // 额外url参数，则替换
    if (extra && extra.url) {
      socketUrl = extra.url;
    } else if (url) {
      socketUrl = url;
    } else {
      if (!prefix) {
        // 若请求前缀为空，则修正为当前host+port的ws协议
        prefix = `ws://${location.hostname}${
          location.port ? ':' + location.port : ''
        }`;
      }
      socketUrl = `${prefix}${path}`;
    }

    if (!socketUrl) {
      throw new Error('socketUrl 不能为空！');
    }

    const ws = new WebSocket(socketUrl);
    ws.onopen = () => {
      typeof onOpen === 'function' && onOpen({ ws });
    };
    ws.onmessage = (msg) => {
      let data = {};
      try {
        data = JSON.parse(msg.data);
      } catch (e) {
        console.error('parse msg error', e);
      }
      typeof onMessage === 'function' && onMessage({ ws, data, msg });
    };
    ws.onerror = (error) => {
      typeof onError === 'function' && onError({ ws, error });
    };
    ws.onclose = (event) => {
      typeof onClose === 'function' && onClose({ ws, event });
    };

    return ws;
  } catch (e: any) {
    console.error(e && e.message ? e.message : '未知错误！');
    return null;
  }
};

_ws = defaultRequest;

// 允许覆写默认ws实现
export const overrideWS = (baseWS: any) => {
  if (typeof baseWS === 'function') {
    _ws = baseWS;
  }
};

export const setPrefix = (prefix: string) => {
  if (prefix) {
    _prefix = prefix;
  }
};

export { _ws as default };
