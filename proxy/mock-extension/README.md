# mock-extensions

- options：插件配置页

```json
{
  "name": "插件名",
  "version": "插件版本",
  "description": "插件描述",
  "manifest_version": 3,
  "minimum_chrome_version": "浏览器最低版本",
  "background": {
    "service_worker": "service_worker.js"
  },
  "permissions": ["tabs", "activeTab", "storage", "scripting"],
  "host_permissions": ["<all_urls>"],
  "action": {
    "default_popup": "./popup/popup.html", // 点击插件按钮下拉面板
    "options_page": "./options/options.html" // 点击插件选项面板
  },
  "options_ui": {
    "page": "./options/options.html",
    "open_in_tab": true // 插件选项面板页面独立tab显示
  },
  // 嵌入页面脚本
  "content_scripts": [
    {
      "js": ["scripts/content.js"], // 嵌入脚本
      "matches": ["http://*/*", "https://*/*"], // 匹配网页
      "run_at": "document_idle" // 嵌入时机
    }
  ]
}
```
