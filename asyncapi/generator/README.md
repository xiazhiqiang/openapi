# generator

调试 asyncapi generator 生成相应的代码

## 安装

```shell
cnpm i
```

## 转换 node-js 代码示例

```shell
# follow 官网示例
npm run build:examples

# 利用asyncapi generator中的parse，解析apiDoc，灵活生成ws请求代码
npm run build:local
```

## 参考

- [async generator](https://github.com/asyncapi/generator/blob/master/cli.js)
- [nodejs-ws-template](https://github.com/asyncapi/nodejs-ws-template)
