chrome.runtime.onInstalled.addListener(function () {
  console.log("Mock API installed");
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.method === "GET" && details.url.includes("/api/users/")) {
      return { redirectUrl: chrome.extension.getURL("mock.json") };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
