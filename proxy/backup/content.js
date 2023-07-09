chrome.runtime.sendMessage(
  { type: "checkForMock", url: window.location.href },
  function (response) {
    if (response) {
      fetch(response.url)
        .then(function (mock) {
          return mock.json();
        })
        .then(function (mockJson) {
          // 将mock数据替换掉原始的数据
          return mockJson;
        });
    }
  }
);
