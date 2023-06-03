const path = require("path");
const fse = require("fs-extra");
const {
  parse,
  usesNewAPI,
  getProperApiDocument,
} = require("@asyncapi/generator/lib/parser");
const { compile } = require("json-schema-to-typescript");

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

  const appendTypescriptDefinitions = (typeName, content, opts) => {
    if (content && typeName) {
      opts[typeName] = typeName;
      opts.typescriptDefinitions += "\n" + content;
    }
    return opts;
  };

  // 按照channel遍历生成channel文件
  const channelsName = Object.keys(channels);
  for (let i = 0; i < channelsName.length; i++) {
    const channelName = channelsName[i] || "";
    const channel = channels[channelName] || {};
    const funName = channelName
      .replace(/^\//, "")
      .replace(/\//g, "_")
      .replace(/(\{|\})/g, "");

    const opts = {
      funName,
      channelName,
      subFunctions: "",
      pubFunctions: "",
      typescriptDefinitions: "",
    };
    const jsonSchema2TypescriptOpts = {
      bannerComment: "",
      unknownAny: false,
    };

    if (channel.bindings?.ws?.query) {
      const ret = await compile(
        channel.bindings.ws.query,
        "IChannelBindingsQuery",
        jsonSchema2TypescriptOpts
      );
      appendTypescriptDefinitions("IChannelBindingsQuery", ret, opts);
    }

    if (channel.parameters) {
      const parametersSchema = { type: "object", properties: {} };
      Object.keys(channel.parameters).forEach((i) => {
        parametersSchema.properties[i] = channel.parameters[i].schema;
      });
      const ret = await compile(
        parametersSchema,
        "IChannelParameters",
        jsonSchema2TypescriptOpts
      );
      appendTypescriptDefinitions("IChannelParameters", ret, opts);
    }

    if (channel.subscribe) {
      if (channel.subscribe?.message?.payload) {
        const ret = await compile(
          channel.subscribe.message.payload,
          "IMessageSubscribeData",
          jsonSchema2TypescriptOpts
        );
        appendTypescriptDefinitions("IMessageSubscribeData", ret, opts);
      }

      opts.subFunctions = subFunTpl({
        ...opts,
        path: channelName.replace(/{/g, "${pp.").replace(/}/g, " || ''}"),
      });
    }

    if (channel.publish) {
      if (channel.publish?.message?.payload) {
        const ret = await compile(
          channel.publish.message.payload,
          "IMessagePublishData",
          jsonSchema2TypescriptOpts
        );
        appendTypescriptDefinitions("IMessagePublishData", ret, opts);
      }

      opts.pubFunctions = pubFunTpl(opts);
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
  return `/* eslint-disable */
/* tslint:disable */
/** 
 * This file was automatically generated.
 * DO NOT MODIFY IT BY HAND. Instead, run cli or script to regenerate.
 */
import { ${["IDefaultWsProps", opts.pubFunctions && "IMessageProps"]
    .filter((i) => i)
    .join(", ")} } from "../typings";
import wsRequest from "./index";
${[opts.subFunctions, opts.pubFunctions, opts.typescriptDefinitions]
  .filter((i) => i)
  .join("\n")}`;
}

function pubFunTpl(opts = {}) {
  return `
/**
 * 客户端向服务端发送消息
 * @param {*} param0
 */
export function ${opts.funName}_pub<
  T extends IMessageProps<${opts.IMessagePublishData || "any"}>
>(p: T) {
  const { ws, data } = p;
  if (!ws || !ws.send) {
    return;
  }

  // 向服务端应用发送消息
  ws.send(JSON.stringify(data));
}`;
}

function subFunTpl(opts = {}) {
  return `
/**
 * 建立ws请求连接，通过解析协议中的channel
 * @param req 请求参数
 * @param extra 请求配置项
 */
export function ${opts.funName}_sub<
  T extends IDefaultWsProps<${opts.IChannelBindingsQuery || "any"}, ${
    opts.IChannelParameters || "any"
  }, ${opts.IMessageSubscribeData || "any"}>
>(p: T) {${
    opts.path.indexOf("${") >= 0
      ? `
  const pp = p?.parameters || {};`
      : ""
  }
  return wsRequest({
    // 之所以在这里拼接path中的parameters，是因为要保证在path中顺序
    path: \`${opts.path}\`,
    ...p,
  });
}`;
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

module.exports = async function ({ asyncapiDocPath }) {
  try {
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
