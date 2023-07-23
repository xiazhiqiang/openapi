const qs = require("qs");

// todo 根据代理请求参数，获取目标服务及请求参数
function getTargetInfo({ opts = {}, query = {}, path = "" } = {}) {
  let rewritePath = path || "";
  if (opts.pathRewrite) {
    Object.keys(opts.pathRewrite).forEach((reg) => {
      const regexp = new RegExp(reg);
      const value = opts.pathRewrite[reg];
      rewritePath = rewritePath.replace(regexp, value);
    });
  }
  const queryString = qs.stringify(query, { addQueryPrefix: true });

  return {
    ...opts,
    url: `${opts.target}${rewritePath}${queryString}`,
    path: rewritePath,
    query,
  };
}

module.exports = {
  getTargetInfo,
};
