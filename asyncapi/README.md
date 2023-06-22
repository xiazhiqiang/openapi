## asyncapi

基于 asynapi2.x，定义 websocket 服务及前端请求 Demo。

## 目录说明

- client: websocket 浏览器客户端实现
- data: async api 协议 json<=>yaml 转换工具
- generator：基于 async api 协议（json）生成 wsservices 前端 client 代码
- server: websocket nodejs 服务实现

## 本地启动

```shell
# 启动websocket server
cd asyncapi/server && npm run dev

# 启动websocket client
cd asyncapi/client && npm run dev
```

## 参考

- [AsyncApi 2.6.0](https://www.asyncapi.com/docs/reference/specification/v2.6.0)
