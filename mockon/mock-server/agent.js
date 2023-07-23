const path = require("path");
const fse = require("fs-extra");
const lineByLine = require("n-readlines");
const lodash = require("lodash");

module.exports = (agent) => {
  // 在这里写你的初始化逻辑
  // 也可以通过 messenger 对象发送消息给 App Worker
  // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失

  // 监听ws请求录制数据消息，执行录制写文件操作
  agent.messenger.on("recordWsData", (params = {}) => {
    const {
      dataString,
      socketUuid,
      clientIp,
      serverIp,
      targetInfo = {},
      recordInfo = {},
      loggerDir,
    } = params || {};
    const { apiType } = recordInfo || {};
    if (!apiType) {
      return;
    }

    // 以 logs/${appName}/${apiPath}/${clientIp}/data.txt 划分存储数据
    const outputFile = path.join(
      loggerDir,
      encodeURIComponent(clientIp),
      targetInfo.path.replace(/\//g, "_"),
      `${apiType}.txt`
    );
    fse.ensureFileSync(outputFile);

    // 创建文件流将数据追加到文件末尾
    const writeStream = fse.createWriteStream(outputFile, { flags: "a" });

    // 录制ws数据：时间戳|socketUuid|客户端ip|服务端ip|ws接口数据
    writeStream.write(
      [Date.now(), socketUuid, clientIp, serverIp, dataString].join("|") + `\n`,
      "utf8"
    );
    writeStream.end();
  });

  // 回放定时器Map
  let replayTimersMap = {};
  // 监听ws请求回放消息，执行读取文件操作
  agent.messenger.on("replayWs", (params = {}) => {
    const { socketUuid, replayInfo } = params || {};
    const replayFilePath = lodash.get(replayInfo || {}, "rule.replayFilePath");
    if (!replayFilePath || !fse.existsSync(replayFilePath)) {
      return;
    }

    // 重置回放定时器
    if (replayTimersMap[socketUuid]) {
      clearTimeout(replayTimersMap[socketUuid]);
    }
    replayTimersMap[socketUuid] = null;

    // 读取文件及初始态
    let liner = new lineByLine(replayFilePath);
    let lineNumber = 0; // 记录行号
    let timeInterval = 1000;
    let lastTimestamp = 0;
    let isDataEmpty = false;

    const f = () => {
      // 记录每行数据
      let line = !isDataEmpty ? liner.next() : "";
      if (!line) {
        if (lineNumber === 0) {
          isDataEmpty = true;
          // 首行为空，则为空文件，设置空文件每1s返回空数据
          timeInterval = 1000;
        } else {
          // 已经到文件末尾，重置读取文件
          liner = new lineByLine(replayFilePath);
          line = liner.next();
          lineNumber = 1;
          lastTimestamp = 0;
        }
      } else {
        lineNumber++;
      }
      let lineString = line.toString();

      // 根据数据时间戳计算下发时间间隔
      let timestamp = Number(lineString.split("|")[0]);
      if (lineNumber > 0) {
        // 文件首行时，直接设置间隔时间为1秒
        if (lineNumber === 1) {
          timeInterval = 1000;
        } else {
          timeInterval =
            timestamp && lastTimestamp ? timestamp - lastTimestamp : 1000;
        }
        // 修正时间间隔
        if (timeInterval < 0) {
          timeInterval = 1000;
        }

        lastTimestamp = timestamp || 0;
      }

      // 若不是停止回放定时器，则开启回放数据
      if (replayTimersMap[socketUuid] !== -1) {
        replayTimersMap[socketUuid] = setTimeout(() => {
          // 返回回放ws数据
          const dataArr = lineString.split("|") || [];
          const dataString = dataArr[4] || "";
          // console.log("replay data", dataArr[0], dataString);
          agent.messenger.sendToApp("replayWsData", { socketUuid, dataString });
          f();
        }, timeInterval);
      }
    };
    f();
  });

  // 停止回放ws数据，设置定时器为-1
  agent.messenger.on("stopReplayWs", (params = {}) => {
    const { socketUuid } = params || {};

    // 清除指定回放定时器
    if (replayTimersMap[socketUuid]) {
      clearTimeout(replayTimersMap[socketUuid]);
    }
    replayTimersMap[socketUuid] = -1;
  });
};
