"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware, ws } = app;

  // 代理请求插件
  const wsproxy = middleware.wsproxy({});
  const httpproxy = middleware.httpproxy({});
  const ipMiddleware = middleware.ip({});

  // page router
  router.get("/", controller.home.index);
  router.get("/client", controller.server.pageIndex);

  // http 接口及代理请求
  router.all(/^\/api\/*/, controller.server.httpApi); // http apis
  router.all(/^\/proxy\/*/, ipMiddleware, httpproxy, () => {}); // http proxy

  // ws 接口及代理请求
  ws.route(/^\/api\/*/, controller.server.wsApi); // ws apis
  ws.route(/^\/proxy\/*/, ipMiddleware, wsproxy, () => {}); // ws proxy
};
