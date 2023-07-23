const koaConnect = require("koa2-connect");
const requestIp = require("request-ip");
const ip = require("ip");

// 获取客户端ip中间件
module.exports = function (options) {
  return async (ctx, next) => {
    // 服务端ip
    ctx.serverIp = ip.address();

    // 获取客户端ip中间件
    const proxy = koaConnect(requestIp.mw());
    await proxy(ctx, next);
  };
};
