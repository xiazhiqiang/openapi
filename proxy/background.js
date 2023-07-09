chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (details.method === "GET" && details.url.indexOf("/api/user/") !== -1) {
      return {
        redirectUrl:
          "data:application/json;charset=UTF-8," +
          encodeURIComponent(
            '{"id": 1, "name": "John Doe", "email": "john@doe.com"}'
          ),
      };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
