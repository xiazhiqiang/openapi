const { createProxyMiddleware } = require("http-proxy-middleware");
const koaConnect = require("koa2-connect");

module.exports = function (options) {
  return async (ctx, next) => {
    console.log("http proxy middleware: --------------------------------");

    // todo 需要动态读取配置文件
    const opts = {
      target: "http://127.0.0.1:7001",
      pathRewrite: {
        "^/proxy": "",
      },
      changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        console.log("proxy request");
      },
      onProxyRes(proxyRes, req, res) {
        console.log("proxy response");
      },
    };
    const proxy = koaConnect(createProxyMiddleware(opts));
    await proxy(ctx, next);
  };
};
