"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 模板引擎插件
  nunjucks: {
    enable: true,
    package: "egg-view-nunjucks",
  },

  // 跨域
  cors: {
    enable: true,
    package: "egg-cors",
  },

  // websocket插件
  websocket: {
    enable: true,
    package: "egg-websocket-plugin",
  },
};
