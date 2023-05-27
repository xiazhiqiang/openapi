# openapi

基于 openapi 协议规范，对 HTTP/WebSocket 接口服务及前端请求实现 Demo。

## 安装依赖

```
cnpm i
```

## 新版 husky 配置

- 卸载并还原 husky

```shell
npm uninstall husky
rm -rf .husky && git config --unset core.hooksPath
```

- 在 package.json 中配置 scripts 添加属性

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

- 添加提交校验

```shell
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

## 参考

- [husky 配置](https://blog.qbb.sh/post/2022/01/11/husky/)
