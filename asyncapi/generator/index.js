const path = require("path");

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

const asyncapiDocPath = path.join(
  __dirname,
  "asyncapiDoc",
  options.apidoc || "ws.json"
);

if (options.mode === "nunjucks") {
  //通过nunjucks模板生成service示例
  const useNunjucks = require("./useNunjucks");
  useNunjucks({ asyncapiDocPath });
} else {
  // 通过parser解析asyncapi doc文件动态生成services
  const useParser = require("./useParser");
  useParser({ asyncapiDocPath });
}
