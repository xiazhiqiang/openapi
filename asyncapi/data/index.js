#!/usr/bin/env node

const path = require("path");
const fse = require("fs-extra");
const yaml = require("js-yaml");
const argv = require("minimist")(process.argv.slice(2));

try {
  if (!argv.entry) {
    throw new Error("缺少entry参数！");
  }

  const entryFile = path.join(__dirname, argv.entry);
  if (!fse.existsSync(entryFile)) {
    throw new Error("找不到entry文件！");
  }

  const outputDir = path.join(__dirname, argv.output || "output");
  if (!fse.existsSync(outputDir)) {
    fse.mkdirpSync(outputDir);
  }

  let outputContent = "";
  let outputFile = "";

  const ext = entryFile.split(".").reverse()[0];
  if (ext === "json") {
    console.log("开始json转yaml...");

    const jsonObj = fse.readJSONSync(entryFile);
    outputContent = yaml.dump(jsonObj);

    const fileName = path.basename(entryFile, "." + ext);
    outputFile = path.join(outputDir, fileName + ".yml");
  } else if (ext === "yml" || ext === "yaml") {
    console.log("开始yaml转json...");

    const yamlString = fse.readFileSync(entryFile, { encoding: "utf-8" });
    const jsonObj = yaml.load(yamlString);
    outputContent = JSON.stringify(jsonObj, null, 2);

    const fileName = path.basename(entryFile, "." + ext);
    outputFile = path.join(outputDir, fileName + ".json");
  } else {
    throw new Error("无效的输入文件类型");
  }

  if (outputFile && outputContent) {
    fse.writeFileSync(outputFile, outputContent);
    console.log("转换完成！");
  } else {
    console.log("没有需要的输出文件！");
  }
} catch (err) {
  console.error(err && err.message ? err.message : "未知错误！");
  process.exit(1);
}
