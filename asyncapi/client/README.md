# client

ws 请求客户端实现 Demo

## 本地启动

```shell
npm start
```

## 基于 asyncapi 协议生成 wsservices 代码

ws.json 为 asyncapi 定义

```shell
# 根据 ws.json 生成client service请求代码
cd client
node ../generator/index.js --apidoc ws.json --output src/wsservices
```

## 说明

- example1：基于 WebSocket 原生实现一个简单的 websocket 请求
- example2：在 example2 基础上，封装 WebSocket 请求类，实现简单的 websocket 请求
- example3：在 example2 基础上，基于 asyncapi 协议定义的 ws 请求接口调用
- example4：在 example3 基础上，增加定制 ws 请求调用
