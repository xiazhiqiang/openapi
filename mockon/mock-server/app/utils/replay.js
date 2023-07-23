const path = require("path");
const fse = require("fs-extra");

/**
 * 获取回放配置
 */
function getReplayInfo({ apiType, replayOpts, targetInfo, app }) {
  const ret = { status: false, rules: [], apiType, rule: null };
  const { path: targetPath } = targetInfo || {};
  const { replay, rules = [] } = replayOpts || {};
  if (!apiType || !replay || !rules || rules.length < 1 || !targetPath) {
    return ret;
  }

  // 有可能会存在多个规则匹配到同一个目标请求path的情况
  rules.forEach((i) => {
    if (
      !i ||
      !i.apiRegex ||
      !i.checked ||
      !i.apiType ||
      !i.sourceId ||
      apiType !== i.apiType
    ) {
      return;
    }

    const regexp = new RegExp(i.apiRegex);
    const replayFilePath = path.join(
      app.logger.options.dir,
      i.sourceId,
      targetPath.replace(/\//g, "_"),
      `${i.apiType}.txt`
    );
    // 若匹配到path且存在数据文件且数据不为空，则记录
    if (regexp.test(targetPath) && fse.existsSync(replayFilePath)) {
      ret.status = true;
      i.replayFilePath = replayFilePath;
      ret.rules.push(i);
    }
  });

  // 取最后一个匹配的规则作为回放实际的规则
  ret.rule = rules[rules.length - 1];

  return ret;
}

/**
 * 回放websocket数据
 */
function replayWsData({
  replayInfo,
  targetInfo,
  app,
  replayWsDataCb,
  ...agentParams
}) {
  const { status, rule } = replayInfo || {};
  if (!status || !rule) {
    return;
  }

  // 向agent进程通信，将回放读文件操作交个agent进程去做，避免多个app worker进程读一个文件导致竞争
  app.messenger.sendToAgent("replayWs", {
    ...agentParams,
    loggerDir: app.logger.options.dir,
    targetInfo,
    replayInfo,
  });

  // 监听agent进程发送读取回放文件数据
  if (typeof replayWsDataCb === "function") {
    app.messenger.on("replayWsData", replayWsDataCb);
  }
}

module.exports = {
  getReplayInfo,
  replayWsData,
};
