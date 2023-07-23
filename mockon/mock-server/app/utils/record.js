/**
 * 获取录制信息
 * @params apiType ws|http
 * @returns
 */
function getRecordInfo({ apiType, recordOpts, targetInfo }) {
  const ret = { status: false, rules: [], apiType };
  const { path: targetPath } = targetInfo || {};
  const { record, rules = [] } = recordOpts || {};
  if (!apiType || !record || !rules || rules.length < 1 || !targetPath) {
    return ret;
  }

  // 有可能会存在多个规则匹配到同一个目标请求path的情况，记录下所有匹配到的规则
  rules.forEach((i) => {
    if (
      !i ||
      !i.apiRegex ||
      !i.checked ||
      !i.apiType ||
      apiType !== i.apiType
    ) {
      return;
    }
    const regexp = new RegExp(i.apiRegex);
    if (regexp.test(targetPath)) {
      ret.status = true;
      ret.rules.push(i);
    }
  });

  return ret;
}

/**
 * 录制数据
 */
function recordWsData({
  recordInfo = {},
  targetInfo,
  msg,
  app,
  ...agentParams
}) {
  const { status, apiType } = recordInfo || {};
  if (!msg || !status || !apiType) {
    return;
  }

  // 将消息数据转换成字符串数据，用于存储文件
  let dataString;
  try {
    if (Buffer.isBuffer(msg)) {
      dataString = msg.toString();
    } else if (typeof msg === "string") {
      dataString = msg;
    } else {
      dataString = JSON.stringify(msg);
    }
  } catch (e) {
    console.error("transform msg error:", e);
    return;
  }
  if (!dataString) {
    return;
  }

  // console.log("record data", dataString);

  // 向agent进程通信，将录制写文件操作交个agent进程去做，避免多个app worker进程读写一个文件导致文件锁
  app.messenger.sendToAgent("recordWsData", {
    ...agentParams,
    loggerDir: app.logger.options.dir,
    dataString,
    targetInfo,
    recordInfo,
  });
}

module.exports = {
  getRecordInfo,
  recordWsData,
};
