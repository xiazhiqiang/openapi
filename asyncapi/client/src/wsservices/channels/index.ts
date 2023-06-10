import wsRequest from "../index";

// websocket请求服务
export default function ({ prefix = "", url = "", path = "", ...others }) {
  // todo 参数处理，将prefix和path转换为ws url
  if (process.env.NODE_ENV !== "production") {
    if (!url) {
      if (!prefix) {
        prefix = "ws://127.0.0.1:3000";
      }
    }
  }

  return wsRequest({ url, prefix, path, ...others });
}
