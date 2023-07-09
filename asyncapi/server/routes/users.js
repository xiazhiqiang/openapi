var express = require("express");
var router = express.Router();

const sandbox = require("../utils/sandbox");
const codes = [
  `
module.exports = ({ params = {} }) => {
  const { name = '' } = params || {};
  return \`Hello world: \${name}\`;
};
    `,
  `
module.exports = async ({ params = {} }) => {
  try {
    const ret = await (await fetch('https://api.github.com/users/github')).json();
    return ret;
  } catch (e) {
    console.log('error', e);
    return \`Hello, \${name}!\`;
  }
};
    `,
];

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send(`respond with a resource:`);
});

/**
 * 测试沙箱执行
 */
router.get("/list", async function (req, res, next) {
  const params = {
    name: 10e3 * Math.random(),
  };

  const ret = await sandbox({
    code: codes[0],
    params,
  });
  const ret2 = await sandbox({
    code: codes[1],
    params: {},
  });

  res.json({
    msg: "respond with a resource",
    ret,
    ret2,
  });
});

module.exports = router;
