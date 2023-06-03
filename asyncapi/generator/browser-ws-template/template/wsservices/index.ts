/**
 * #请不要直接改本文件，脚本自动生成，若要修改请通过override覆写默认实现
 * 定义默认websocket默认实现
 * 支持覆写默认实现，这一层是为了外部覆写ws请求
 */

import {
  IDefaultWsProps,
  IMessageProps,
  IOnCloseProps,
  IOnErrorProps,
  IOnOpenProps,
} from "./typings";

let _ws: IBaseWsRequest;
let _beforeRequest: IBeforeWsRequest = (p) => {
  let { url = "", prefix, path, query } = p || {};
  // 若没有url参数，则拼接url
  if (!url) {
    if (!prefix) {
      // 若请求前缀为空，则修正为当前host+port的ws协议
      prefix = `ws://${location.hostname}${
        location.port ? `:${location.port}` : ""
      }`;
    }
    url = `${prefix}${path || ""}`;
    url = formatUrl({ url, query });
  }

  return { url };
};
let _wsOnOpen: IWsOnOpen = ({ onOpen, ...others }) => {
  typeof onOpen === "function" && onOpen(others);
};
let _wsOnMessage: IWsOnMessage = ({ onMessage, msg, ...others }) => {
  let data = {};
  try {
    data = JSON.parse(msg?.data);
  } catch (e) {
    console.error("parse websocket message from server error: ", e);
  }
  typeof onMessage === "function" && onMessage({ ...others, msg, data });
};
let _wsOnClose: IWsOnClose = ({ onClose, ...others }) => {
  typeof onClose === "function" && onClose(others);
};
let _wsOnError: IWsOnError = ({ onError, ...others }) => {
  typeof onError === "function" && onError(others);
};

/**
 * 默认 Websocket 实现，保持通用性
 */
export function defaultRequest<T extends IDefaultWsProps<any, any, any>>(p: T) {
  let {
    prefix = "",
    url,
    path = "",
    query,
    onOpen,
    onError,
    onClose,
    onMessage,
    ...others
  } = p || {};
  try {
    if (!window.WebSocket) {
      throw new Error("浏览器不支持！");
    }

    // 回调函数共享数据
    const handlerShareOpts = {};

    const formatParams =
      _beforeRequest({ prefix, url, path, query }, handlerShareOpts) || {};
    url = formatParams.url;

    // // 若没有url参数，则拼接url
    // if (!url) {
    //   if (!prefix) {
    //     // 若请求前缀为空，则修正为当前host+port的ws协议
    //     prefix = `ws://${location.hostname}${
    //       location.port ? `:${location.port}` : ''
    //     }`;
    //   }
    //   url = `${prefix}${path || ''}`;
    //   url = formatUrl({ url, query });
    // }

    if (!url) {
      throw new Error("websocket url 不能为空！");
    }

    // 回调参数
    const cbParams = { prefix, path, query, ...others, ...formatParams };

    const ws = new WebSocket(url);
    ws.onopen = () => {
      _wsOnOpen({ ...cbParams, ws, onOpen }, handlerShareOpts);
      // typeof onOpen === 'function' && onOpen({ ...cbParams, ws });
    };
    ws.onmessage = (msg) => {
      _wsOnMessage({ ...cbParams, ws, msg, onMessage }, handlerShareOpts);
      // let data = {};
      // try {
      //   data = JSON.parse(msg.data);
      // } catch (e) {
      //   console.error('parse msg error', e);
      // }
      // typeof onMessage === 'function' &&
      //   onMessage({ ...cbParams, ws, data, msg });
    };
    ws.onerror = (error) => {
      _wsOnError({ ...cbParams, ws, error, onError }, handlerShareOpts);
      // typeof onError === 'function' && onError({ ...cbParams, ws, error });
    };
    ws.onclose = (event) => {
      _wsOnClose({ ...cbParams, ws, event, onClose }, handlerShareOpts);
      // typeof onClose === 'function' && onClose({ ...cbParams, ws, event });
    };

    return ws;
  } catch (e: any) {
    console.error(e && e.message ? e.message : "未知错误！");
    return null;
  }
}

/**
 * 处理url的新加query参数
 * @param param0
 * @returns
 */
export function formatUrl({ url, query }) {
  if (!query || JSON.stringify(query) === "{}") {
    return url;
  }

  const paramsToUrlParamsString = (params = {}) => {
    return (
      Object.keys(params)
        .map((key) => `${key}=${encodeURIComponent(params[key])}`)
        .join("&") || ""
    );
  };

  const idx = url.indexOf("?");
  if (idx >= 0) {
    const originUrlParams = {};
    url
      .slice(idx + 1)
      .split("&")
      .filter((i) => i)
      .forEach((i) => {
        const p = i.split("=");
        originUrlParams[p[0]] = p[1] || "";
      });
    const newParams = Object.assign({}, originUrlParams, query);
    url = url.substring(0, idx) + "?" + paramsToUrlParamsString(newParams);
  } else {
    url = `${url}?${paramsToUrlParamsString(query)}`;
  }

  return url;
}

// 允许覆写默认ws实现
export function overwriteWsRequest({
  overwriteBeforeWsRequest,
  overwriteWsOnOpen,
  overwriteWsOnClose,
  overwriteWsOnMessage,
  overwriteWsOnError,
  overwriteBaseWsRequest,
}: IOverwriteWsRequestProps) {
  if (typeof overwriteBaseWsRequest === "function") {
    _ws = overwriteBaseWsRequest();
  } else {
    if (typeof overwriteBeforeWsRequest === "function") {
      _beforeRequest = overwriteBeforeWsRequest(_beforeRequest);
    }
    if (typeof overwriteWsOnOpen === "function") {
      _wsOnOpen = overwriteWsOnOpen(_wsOnOpen);
    }
    if (typeof overwriteWsOnClose === "function") {
      _wsOnClose = overwriteWsOnClose(_wsOnClose);
    }
    if (typeof overwriteWsOnError === "function") {
      _wsOnError = overwriteWsOnError(_wsOnError);
    }
    if (typeof overwriteWsOnMessage === "function") {
      _wsOnMessage = overwriteWsOnMessage(_wsOnMessage);
    }
  }
}

_ws = defaultRequest;
export { _ws as default };

export interface IOverwriteWsRequestProps {
  overwriteBeforeWsRequest?: (_beforeRequest) => IBeforeWsRequest;
  overwriteWsOnOpen?: (_wsOnOpen) => IWsOnOpen;
  overwriteWsOnClose?: (_wsOnClose) => IWsOnClose;
  overwriteWsOnMessage?: (_wsOnMessage) => IWsOnMessage;
  overwriteWsOnError?: (_wsOnError) => IWsOnError;
  overwriteBaseWsRequest?: (p?: any) => IBaseWsRequest;
}

export interface IBaseWsRequest {
  (p: IDefaultWsProps<any, any, any>): void | any;
}
export interface IBeforeWsRequest {
  (
    p: IDefaultWsProps<any, any, any> | { [k: string]: any },
    handlerShareOpts?: any
  ): {
    url: string | undefined;
    [key: string]: any;
  };
}
export interface IWsOnOpen {
  (
    p: IDefaultWsProps<any, any, any> & IOnOpenProps,
    handlerShareOpts?: any
  ): any;
}
export interface IWsOnClose {
  (
    p: IDefaultWsProps<any, any, any> & IOnCloseProps,
    handlerShareOpts?: any
  ): any;
}
export interface IWsOnError {
  (
    p: IDefaultWsProps<any, any, any> & IOnErrorProps,
    handlerShareOpts?: any
  ): any;
}
export interface IWsOnMessage {
  (
    p: IDefaultWsProps<any, any, any> & IMessageProps<any>,
    handlerShareOpts?: any
  ): any;
}
