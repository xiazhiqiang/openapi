/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1689219644754_2849";

  // 模板引擎配置
  config.view = {
    defaultViewEngine: "nunjucks",
    mapping: {
      ".nj": "nunjucks",
    },
  };

  config.bodyParser = {
    // 关闭bodyParser对应/proxy/*的解析，避免bodyParser插件解析后再代理导致问题
    // https://github.com/chimurai/http-proxy-middleware/issues/320
    // https://stackoverflow.com/questions/28371641/how-can-i-use-express-http-proxy-after-bodyparser-json-has-been-called
    ignore: /^\/proxy\/*/,
  };

  // 跨域
  config.cors = {
    // origin: "*",
    // allowMethods: "GET,POST,OPTIONS",
  };

  // websocket 插件配置
  config.websocket = {
    // 禁用自动注册middleware目录下的中间件，手动添加路由级别中间件
    useAppMiddlewares: false,
  };

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
