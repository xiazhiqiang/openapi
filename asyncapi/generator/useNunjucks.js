const path = require("path");
const Generator = require("@asyncapi/generator/lib/generator");

/**
 * 通过generator及模板方式，只能做到逐个解析channel、message等，不能灵活获取变量
 */
module.exports = function ({ asyncapiDocPath }) {
  const templateDir = path.join(__dirname, "browser-ws-template");
  const targetDir = path.join(__dirname, "output");

  (async () => {
    try {
      const generator = new Generator(templateDir, targetDir, {
        templateParams: {},
        noOverwriteGlobs: [],
        disabledHooks: {},
        forceWrite: true,
        install: false, // 本地模板，不需要安装
        debug: false,
      });

      await generator.generateFromFile(asyncapiDocPath);

      console.log("[Done]: Successfully generated!");
    } catch (e) {
      console.error(e);
    }
  })();
};
