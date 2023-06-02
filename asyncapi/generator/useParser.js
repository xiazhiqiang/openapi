const path = require("path");
const fse = require("fs-extra");
const {
  parse,
  usesNewAPI,
  getProperApiDocument,
} = require("@asyncapi/generator/lib/parser");

async function parseApiDoc({ apiContent }) {
  try {
    // 解析asyncapi doc
    let { document: asyncapiDocument, diagnostics } = await parse(apiContent);
    if (!asyncapiDocument) {
      const err = new Error(
        "Input is not a corrent AsyncAPI document so it cannot be processed."
      );
      err.diagnostics = diagnostics;
      throw err;
    }

    // 转换document
    asyncapiDocument = getProperApiDocument(asyncapiDocument);
    // console.log(asyncapiDocument._json.asyncapi);

    return asyncapiDocument._json || {};
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function generateChannels({ asyncapi = {}, outputDir }) {
  let { channels, messages } = asyncapi || {};

  // 按照channel遍历生成channel文件
  const channelsName = Object.keys(channels);
  for (let i = 0; i < channelsName.length; i++) {
    const channelName = channelsName[i] || "";
    const channel = channels[channelName] || {};

    const opts = {};
    const funName = channelName.replace(/\//g, "_").replace(/(\{|\})/g, "");

    if (channel.subscribe) {
      opts.subFunctions = subFunTpl({
        funName,
        channelName,
        path: channelName.replace(/{/g, "${pp.").replace(/}/g, " || ''}"),
      });
    }

    if (channel.publish) {
      opts.pubFunctions = pubFunTpl({
        funName,
        channelName,
      });
    }

    let fileContent = funTpl(opts);
    let fileName = channelName
      .split("/")
      .map((i, idx) => {
        if (i.indexOf("{") >= 0 || i.indexOf("}") >= 0) {
          i = i.replace(/(\{|\})/g, "");
        }

        // 首字母大写
        if (idx > 1 && /^[a-z]{1}/.test(i)) {
          i = i.slice(0, 1).toUpperCase() + i.slice(1);
        }
        return i;
      })
      .join("");

    // 输出文件
    fse.writeFileSync(
      path.join(outputDir, "channels", fileName + ".ts"),
      fileContent
    );
  }
}

function funTpl(opts = {}) {
  return `
/* eslint-disable */
/* tslint:disable */

import { IDefaultWsProps, IMessageProps } from "../typings";
import wsRequest from "./index";

${opts.subFunctions || ""}
${opts.pubFunctions || ""}
${opts.typescriptDefinitions || ""}
`;
}

function pubFunTpl(opts = {}) {
  return `
/**
 * 客户端向服务端发送消息
 * @param {*} param0
 */
export function ${opts.funName}_pub<
  T extends IMessageProps<ISchemas_ReceiveDataDTOObject>
>(p: T) {
  const { ws, data } = p;
  if (!ws || !ws.send) {
    return;
  }

  // 向服务端应用发送消息
  ws.send(JSON.stringify(data));
}
`;
}

function subFunTpl(opts = {}) {
  return `
/**
 * 建立ws请求连接，通过解析协议中的channel
 * @param req 请求参数
 * @param extra 请求配置项
 */
export function ${opts.funName}_sub<
  T extends IDefaultWsProps<
    IChannelBindings_Query,
    IParameters,
    ISchemas_InterDataDTOObject
  >
>(p: T) {
  const pp = p?.parameters || {};
  return wsRequest({
    // 之所以在这里拼接path中的parameters，是因为要保证在path中顺序
    path: \`${opts.path}\`,
    ...p,
  });
}
`;
}

function copyTpl({ outputDir, templateDir }) {
  fse.copyFileSync(
    path.join(templateDir, "index.ts"),
    path.join(outputDir, "index.ts")
  );
  fse.copyFileSync(
    path.join(templateDir, "typings.ts"),
    path.join(outputDir, "typings.ts")
  );

  fse.ensureDirSync(path.join(outputDir, "channels"));
  fse.copyFileSync(
    path.join(templateDir, "channels", "index.ts"),
    path.join(outputDir, "channels", "index.ts")
  );
}

module.exports = async function () {
  try {
    const asyncapiDocPath = path.join(__dirname, "asyncapiDoc", "ws.json");
    const apiContent = fse.readJsonSync(asyncapiDocPath);

    // 解析asyncapi 定义
    const asyncapi = await parseApiDoc({ apiContent });
    if (!asyncapi) {
      return;
    }

    const outputDir = path.join(__dirname, "output", "wsservices");
    const templateDir = path.join(
      __dirname,
      "browser-ws-template",
      "template",
      "wsservices"
    );

    // 确保输出目录为空
    if (fse.existsSync(outputDir)) {
      fse.unlinkSync(outputDir);
    }
    fse.ensureDirSync(outputDir);

    // copy service固定文件和目录
    copyTpl({ outputDir, templateDir });

    // 根据定义生成service请求文件
    await generateChannels({ asyncapi, outputDir });

    console.log("[Done]: Successfully generated!");
  } catch (e) {
    console.error(e);
  }
};
