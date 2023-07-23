// todo 类封装
const { EventEmitter } = require("events");

class SubscriberBase extends EventEmitter {
  start() {}
  close() {}
  sendData() {}
  onOpen() {}
  onClose() {}
  onMessage() {}
  onError() {}
}

class Subscriber extends SubscriberBase {
  client = null;
  url = "";

  constructor(props) {
    this.url = props.url;
  }

  start() {
    try {
      if (!this.url) {
        return;
      }
      this.client = new WebSocket(this.url);
      this.client.on("open", this.onOpen);
      this.client.on("close", this.onClose);
      this.client.on("error", this.onError);
      this.client.on("message", this.onMessage);
    } catch (e) {}
  }

  sendData() {}

  close() {
    if (this.client) {
      this.client.close();
    }
  }

  record() {}
}

class Agent extends SubscriberBase {
  constructor() {}

  start() {}

  sendData() {}

  close() {}
}

const subscriber = new Subscriber({
  url: "",
});
subscriber.onOpen = () => {};
subscriber.start();

const agent = new Agent();
agent.onMessage = function (msg) {
  subscriber.sendData(msg.toString());
};
agent.onError = function () {};
agent.onClose = function () {};
agent.start();
