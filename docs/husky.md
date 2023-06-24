# husky

配置 husky 指南

## 安装依赖

```
cnpm i @commitlint/cli @commitlint/config-conventional husky -D
```

## 新版 husky 配置

- 卸载并还原 husky

```shell
npm uninstall husky
rm -rf .husky && git config --unset core.hooksPath
```

- 在 package.json 中添加 husky 及 commitlint 配置

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  }
}
```

- 初始化

```shell
npx husky install
```

- 添加提交校验

```shell
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

## 参考

- [husky 官网配置](https://typicode.github.io/husky/getting-started.html)
- [husky 配置](https://blog.qbb.sh/post/2022/01/11/husky/)
