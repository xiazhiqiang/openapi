# openapi

基于 openapi 协议规范，对 HTTP/WebSocket 接口服务及前端请求实现 Demo。

## 目录说明

- asyncapi/client: websocket 浏览器客户端实现
- asyncapi/data: websocket 协议定义及转换工具
- asyncapi/server: websocket nodejs 服务实现

## 本地启动

```shell
# 启动websocket服务
cd asyncapi/server && npm run dev

# 启动websocket客户端
cd asyncapi/client && npm run dev
```

## 参考

- [AsyncApi 2.6.0](https://www.asyncapi.com/docs/reference/specification/v2.6.0)
