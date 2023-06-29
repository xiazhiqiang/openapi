// const fetch = require("node-fetch");
const { VM } = require("vm2");

module.exports = function () {
  // Create a new sandbox
  const vm = new VM({
    timeout: 3000, // Set a timeout for code execution (in milliseconds)
    sandbox: {
      console,
      // // Define the sandboxed global object
      // console: "redirect", // Redirect console output to the parent environment
    },
  });

  // Execute code in the sandbox
  try {
    const result = vm.run(`
  (({ name = '' } = {}) => {
    console.log(1111, global)
    return \`Hello, \${name}!\`
  })()
  `);
    console.log(result); // Output: 3
  } catch (error) {
    console.log("Error:", error.message);
  }
};
