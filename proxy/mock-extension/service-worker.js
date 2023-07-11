const color = "#3aa757";

// 初始化状态
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log(`[Coloring] default background color is set to: ${color}`);
});

// ----------------------------------------------------------------

// // 定义拦截规则
// var requestMatcher = {
//   url: [{ hostSuffix: "mcs.snssdk.com" }],
// };

// // 定义拦截行为
// var requestAction = {
//   responseHeaders: [
//     {
//       name: "Content-Type",
//       value: "application/json; charset=UTF-8",
//     },
//   ],
//   responseBody: [
//     {
//       a: 111,
//     },
//   ],
// };

// // 注册拦截请求的回调函数
// chrome.declarativeWebRequest.onRequest.addRules([
//   {
//     conditions: [
//       new chrome.declarativeWebRequest.RequestMatcher(requestMatcher),
//     ],
//     actions: [
//       new chrome.declarativeWebRequest.ModifyResponseHeaders(requestAction),
//     ],
//   },
// ]);
