import {
  IDefaultWsProps,
  IMessageProps,
  IOnCloseProps,
  IOnErrorProps,
  IOnOpenProps,
} from "./typings";

export class DefaultWsRequestClass {
  options: IDefaultWsProps<any, any, any>;
  ws: any;

  constructor(props: IDefaultWsProps<any, any, any>) {
    this.options = props;

    if ("WebSocket" in window) {
      this.init();
    } else {
      throw new Error("浏览器不支持！");
    }

    return this.ws;
  }

  init() {
    try {
      const { onOpen, onError, onClose, onMessage, ...otherOptions } =
        this.options;
      const params = this.processOptions(otherOptions);
      if (!params.url) {
        throw new Error("websocket url 不能为空！");
      }

      this.ws = new WebSocket(params.url);
      this.ws.onopen = () => {
        typeof onOpen === "function" &&
          this.openHandler(onOpen, { ...params, ws: this.ws });
      };
      this.ws.onmessage = (msg: any) => {
        typeof onMessage === "function" &&
          this.messageHandler(onMessage, { ...params, msg, ws: this.ws });
      };
      this.ws.onerror = (error: any) => {
        typeof onError === "function" &&
          this.errorHandler(onError, { ...params, error, ws: this.ws });
      };
      this.ws.onclose = (event: any) => {
        typeof onClose === "function" &&
          this.closeHandler(onClose, { ...params, event, ws: this.ws });
      };
    } catch (e: any) {
      console.error(e && e.message ? e.message : "未知错误！");
      this.ws = null;
    }
  }

  openHandler(onOpen: IWsOnOpen, cbParams: any = {}) {
    onOpen(cbParams);
  }

  messageHandler(onMessage: IWsOnMessage, cbParams: any = {}) {
    let data = {};
    try {
      if (cbParams?.msg?.data) {
        data = JSON.parse(cbParams.msg.data);
      }
    } catch (e) {
      console.error("parse msg error", e);
    }
    onMessage({ ...cbParams, data });
  }

  errorHandler(onError: IWsOnError, cbParams: any = {}) {
    onError(cbParams);
  }

  closeHandler(onClose: IWsOnClose, cbParams: any = {}) {
    onClose(cbParams);
  }

  processOptions(
    options: IDefaultWsProps<any, any, any>
  ): IDefaultWsProps<any, any, any> {
    let { prefix = "", url, path = "", query } = options || {};

    // 若没有url参数，则拼接url
    if (!url) {
      if (!prefix) {
        // 若请求前缀为空，则修正为当前host+port的ws协议
        prefix = `ws://${location.hostname}${
          location.port ? `:${location.port}` : ""
        }`;
      }
      url = `${prefix}${path || ""}`;
      url = this.formatUrl({ url, query });
    }

    return { ...options, prefix, url, path, query };
  }

  formatUrl({ url, query }: any = {}): string {
    if (!url || !query || JSON.stringify(query) === "{}") {
      return url;
    }

    const paramsToUrlParamsString = (params: any = {}) => {
      return (
        Object.keys(params)
          .map((key) => `${key}=${encodeURIComponent(params[key])}`)
          .join("&") || ""
      );
    };

    const idx = url.indexOf("?");
    if (idx >= 0) {
      const originUrlParams: any = {};
      url
        .slice(idx + 1)
        .split("&")
        .filter((i: string) => i)
        .forEach((i: string) => {
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
}

// 内部ws类
let _WsClass = DefaultWsRequestClass; // 默认是WS类实现

// 允许外部修改默认ws类
export const overwriteWsClass = (WsClass: any) => {
  _WsClass = WsClass;
};

export default (p: any) => {
  try {
    return new _WsClass(p);
  } catch (err) {
    return null;
  }
};

// ----------------------------类型定义------------------------------------

export interface IWsOnOpen {
  (p: IDefaultWsProps<any, any, any> & IOnOpenProps): any;
}

export interface IWsOnClose {
  (p: IDefaultWsProps<any, any, any> & IOnCloseProps): any;
}

export interface IWsOnError {
  (p: IDefaultWsProps<any, any, any> & IOnErrorProps): any;
}

export interface IWsOnMessage {
  (p: IDefaultWsProps<any, any, any> & IMessageProps<any>): any;
}
