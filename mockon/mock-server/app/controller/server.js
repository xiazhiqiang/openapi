"use strict";

const { Controller } = require("egg");

class ServerController extends Controller {
  async pageIndex() {
    const { ctx } = this;
    await ctx.render("client.nj", { token: ctx.csrf });
  }

  // 模拟真实http接口服务
  async httpApi() {
    const { ctx } = this;
    const { query, path, request } = ctx;
    ctx.body = this._getResponseObject({
      data: {
        path,
        query, // get 请求参数
        body: request.body, // post 请求参数
      },
    });
  }

  // todo 模拟真实websocket服务，后续考虑分房间
  async wsApi() {
    if (!this.ctx.websocket) {
      throw new Error("this function can only be use in websocket router");
    }
    console.log("websocket connected");

    const { ctx, app } = this;
    const { query = {}, path } = ctx;
    let timer = null;
    let interval = query.interval || 1000;

    const startSendData = ({ interval = 1000, params = {} }) => {
      timer = setInterval(() => {
        const ret = this._getResponseObject({
          data: {
            ...params,
            path,
            query,
            time: +new Date(),
          },
        });
        ctx.websocket.send(JSON.stringify(ret));
      }, interval);
    };
    const stopSendData = () => {
      if (timer) {
        clearInterval(timer);
      }
      timer = null;
    };
    const closeSocket = () => {
      ctx.websocket.close();
      stopSendData();
    };

    // 开始发送数据
    startSendData({ interval });

    // 监听客户端socket
    ctx.websocket
      .on("message", (msg) => {
        console.log("websocket receive", msg.toString());
        let params = {};
        try {
          params = JSON.parse(msg.toString());
        } catch (e) {}

        if (params.frameInterval && interval !== params.frameInterval) {
          interval = params.frameInterval;
          stopSendData();
          startSendData({ interval, params });
        }
      })
      .on("close", (code, reason) => {
        console.log("websocket closed", code, reason);
        closeSocket();
      })
      .on("error", (err) => {
        console.log("websocket error", err);
        closeSocket();
      });
  }

  _getResponseObject(ret = {}) {
    return {
      success: true,
      data: {},
      code: 200,
      msg: "Success",
      ...ret,
    };
  }

  // async replay() {
  //   const { ctx } = this;
  //   if (!ctx.websocket) {
  //     throw new Error("this function can only be use in websocket router");
  //   }
  // }
}

module.exports = ServerController;
