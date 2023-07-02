const fetch = require("node-fetch");
const { VM } = require("vm2");

function sandbox(code = "", opts = {}) {
  if (!code) {
    return;
  }

  // Create a new sandbox
  const vm = new VM({
    timeout: opts.timeout || 3000, // Set a timeout for code execution (in milliseconds)
    sandbox: {
      params: {},
      ret: {},
      console,
      fetch,
      ...(opts.sandbox || {}),
    },
  });

  // Execute code in the sandbox
  try {
    const ret = vm.run(code);
    console.log("ret", ret);
    return ret;
  } catch (e) {
    console.log("Error:", e.message);
    return;
  }
}

module.exports = function (code) {
  return sandbox(code);
};
