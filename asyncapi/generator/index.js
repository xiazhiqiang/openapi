const path = require("path");
const fse = require("fs-extra");

const cwd = process.cwd();
const args = process.argv.slice(2);
const options = {};

// 输入命令：npm run build:local -- --name John --age 30 -v 参数解析：{ name: 'John', age: '30', v: true }
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg.startsWith("-")) {
    const key = arg.replace(/^-+/, "");
    const value = args[i + 1];

    options[key] = value && !value.startsWith("-") ? value : true;
    i += value ? 1 : 0;
  }
}

const asyncapiDocPath = path.join(cwd, options.apidoc);
if (!options.output || !options.apidoc) {
  console.error("缺少必要参数：apidoc或output");
  return;
}
if (!fse.existsSync(asyncapiDocPath)) {
  console.error("未找到api定义文件或缺少api文件路径参数apidoc");
  return;
}
const outputDir = path.join(cwd, options.output);

if (options.mode === "nunjucks") {
  //通过nunjucks模板生成service示例
  const useNunjucks = require("./useNunjucks");
  useNunjucks({ asyncapiDocPath, outputDir });
} else {
  // 通过parser解析asyncapi doc文件动态生成services
  const useParser = require("./useParser");
  useParser({ asyncapiDocPath, outputDir });
}
