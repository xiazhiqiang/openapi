var express = require("express");
var router = express.Router();

const sandbox = require("../utils/sandbox");

const pathConfigMap = {
  "/": {
    // 同步函数
    funCode: `
console.log('params', params);
const { name = '' } = params || {};
ret.abc = 111;

    `,
  },
  "/list": {
    // 异步函数
    funCode: `
(async ({ name = '' } = {}) => {
  console.log(1111);
  try {
    const ret = await (await fetch('https://api.github.com/users/github')).json();
    return ret;
  } catch (e) {
    console.log('error', e);
    return \`Hello, \${name}!\`;
  }
})();
    `,
  },
};

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const ret = sandbox(pathConfigMap["/"].funCode);
  res.send(`respond with a resource: ${ret}`);
});

router.get("/list", function (req, res, next) {
  res.json("respond with a resource");
});

module.exports = router;
