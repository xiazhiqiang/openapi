/**
 * #请不要直接改本文件，脚本自动生成，若要修改请通过override覆写默认实现
 * 定义默认websocket默认实现
 * 支持覆写默认实现，这一层是为了外部覆写ws请求
 */

let _ws: (p) => void | any;

/**
 * 默认 Websocket 实现，保持通用性
 */
export function defaultRequest({
  prefix = '',
  url = '',
  path = '',
  query,
  onOpen,
  onError,
  onClose,
  onMessage,
  ...others
}) {
  try {
    if (!window.WebSocket) {
      throw new Error('浏览器不支持！');
    }

    // 额外url参数，则替换
    if (!url) {
      if (!prefix) {
        // 若请求前缀为空，则修正为当前host+port的ws协议
        prefix = `ws://${location.hostname}${
          location.port ? `:${location.port}` : ''
        }`;
      }
      url = `${prefix}${path || ''}`;
    }

    if (!url) {
      throw new Error('websocket url 不能为空！');
    }

    url = formatUrl({ url, query });

    // 回调参数
    const cbParams = { url, prefix, path, ...others };

    const ws = new WebSocket(url);
    ws.onopen = () => {
      typeof onOpen === 'function' && onOpen({ ...cbParams, ws });
    };
    ws.onmessage = (msg) => {
      let data = {};
      try {
        data = JSON.parse(msg.data);
      } catch (e) {
        console.error('parse msg error', e);
      }
      typeof onMessage === 'function' &&
        onMessage({ ...cbParams, ws, data, msg });
    };
    ws.onerror = (error) => {
      typeof onError === 'function' && onError({ ...cbParams, ws, error });
    };
    ws.onclose = (event) => {
      typeof onClose === 'function' && onClose({ ...cbParams, ws, event });
    };

    return ws;
  } catch (e: any) {
    console.error(e && e.message ? e.message : '未知错误！');
    return null;
  }
}

/**
 * 处理url的新加query参数
 * @param param0
 * @returns
 */
export function formatUrl({ url, query }) {
  if (!query || JSON.stringify(query) === '{}') {
    return url;
  }

  const newParams =
    Object.keys(query)
      .map((key) => `${key}=${encodeURIComponent(query[key])}`)
      .join('&') || '';

  const idx = url.indexOf('?');
  if (idx >= 0) {
    const originUrlParams =
      url
        .substring(idx)
        .split('&')
        .filter((i) => i)
        .join('&') || '';
    url =
      url.substring(0, idx) +
      '?' +
      [originUrlParams, newParams].filter((i) => i).join('&');
  } else {
    url = `${url}?${newParams}`;
  }

  return url;
}

_ws = defaultRequest;

// TODO 待设计，允许覆写默认ws实现
export function overrideWsRequest(baseWS: any) {
  if (typeof baseWS === 'function') {
    _ws = baseWS;
  }
}

export { _ws as default };