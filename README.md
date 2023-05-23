# openapi-service

## asyncapi

### server

- 初始化项目

```shell
cd src/asyncapi/server
npx express-generator --view=ejs
```

- 添加 websocket 服务

```shell
cnpm i express-ws -S
```

```javascript
// bin/www
/**
 * Create Websocket server
 */
require("express-ws")(app, server);
```

```javascript
// routes/wsproxy.js
var express = require("express");
var expressWs = require("express-ws"); // 引入ws中间件
var router = express.Router();

expressWs(router); // ws中间件应用到路由中

router.ws("/path", function (ws, req) {
  console.log("connection ok", req.query);

  ws.on("message", function (msg) {
    let params = {};
    try {
      params = JSON.parse(msg);
    } catch (e) {}
  });

  ws.on("close", function (id) {
    console.log("close", id);
  });
});

module.exports = router;
```

- 本地启动

```json
// package.json
{
  "scripts": {
    "dev": "nodemon ./bin/www"
  }
}
```

```shell
# 通过nodemon监听server修改重新启动服务
cd server
npm run dev
```

## client

- 本地启动

```shell
cd client
http-server ./ -c-1 --cors='*'
```
