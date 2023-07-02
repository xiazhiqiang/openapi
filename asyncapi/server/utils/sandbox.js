const fetch = require("node-fetch");
const { NodeVM, VMScript, VM } = require("vm2");
const md5 = require("md5");

// 缓存script
let scriptCaches = {};

function cacheScript(code = "") {
  if (!code) {
    return;
  }

  const k = md5(code);
  if (scriptCaches[k]) {
    return scriptCaches[k];
  }

  // 预编译code，提升后续sandbox执行性能和复用
  scriptCaches[k] = new VMScript(code);

  return scriptCaches[k];
}

function scriptSandbox(script, { vmOpts = {} }) {
  if (!script) {
    return;
  }

  // Create a new sandbox
  const vm = new NodeVM({
    console: "inherit",
    eval: false,
    allowAsync: vmOpts.async || false, // 同步
    timeout: vmOpts.timeout || 3000, // Set a timeout for sync code execution (in milliseconds)
    sandbox: {
      fetch,
      ...(vmOpts.sandbox || {}),
    },
  });

  // Execute code in the sandbox
  try {
    return vm.run(script);
  } catch (e) {
    console.log("modSandbox error:", e.message);
    return;
  }
}

async function runMod(mod, { params = {}, opts = {} }) {
  if (typeof mod !== "function") {
    return;
  }

  try {
    return await mod({ params, opts });
  } catch (e) {
    console.log("mod run error:", e.message);
    return;
  }
}

module.exports = async ({ code, params, vmOpts = {} }) => {
  if (!code) {
    return;
  }

  const script = cacheScript(code);
  const mod = scriptSandbox(script, { vmOpts });
  return await runMod(mod, { params });
};
