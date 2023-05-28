# data

yaml 转换 json

## usage

```shell
# 安装依赖
cnpm i

# json2yaml
npm start -- --entry=entry_api.json

# yaml2json
npm start -- --entry=entry_api.yml
```

## demo data

```json
{
  "asyncapi": "2.6.0",
  "info": {
    "title": "WebSockets echo server",
    "version": "1.0.0"
  },
  "servers": {
    "local": {
      "url": "127.0.0.1:7001",
      "protocol": "ws"
    },
    "daily": {
      "url": "192.168.1.1:7001",
      "protocol": "ws"
    }
  },
  "defaultContentType": "application/json",
  "channels": {
    "/ws/inter/{interId}": {
      "description": "API描述",
      "parameters": {
        "interId": {
          "$ref": "#/components/parameters/interId"
        }
      },
      "subscribe": {
        "message": {
          "$ref": "#/components/messages/InterDTO"
        }
      },
      "bindings": {
        "$ref": "#/components/channelBindings/InnerBindings"
      }
    }
  },
  "components": {
    "parameters": {
      "interId": {
        "description": "参数描述",
        "schema": {
          "type": "string",
          "examples": ["abc"]
        }
      }
    },
    "channelBindings": {
      "InnerBindings": {
        "ws": {
          "method": "GET",
          "header": {},
          "query": {
            "type": "object",
            "properties": {
              "id": {
                "type": "integer",
                "format": "int64"
              }
            }
          }
        }
      }
    },
    "messages": {
      "InterDTO": {
        "payload": {
          "$ref": "#/components/schemas/InterDataDTOObject"
        }
      }
    },
    "schemas": {
      "InterDataDTOObject": {
        "type": "object",
        "properties": {
          "status": {
            "type": "boolean"
          },
          "listObject2": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ListObject2"
            }
          }
        }
      },
      "ListObject2": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

## definition explanation

> 基于 AsyncAPI 2.6.0，结合实际使用的一些字段说明，详细说明见：[AsyncAPI 2.6.0](https://www.asyncapi.com/docs/reference/specification/v2.6.0)

```json
{
  "asyncapi": "【必填】async api 规范版本",
  // 【必填】元数据内容
  "info": {
    "title": "【必填】应用程序名称",
    "version": "【必填】应用程序API版本"
  },
  // 【非必填】提供的不同服务器说明，例如日常、预发、正式
  "servers": {
    // 字段key命名规则：^[A-Za-z0-9_\-]+$
    "local": {
      "url": "【必填】服务地址",
      "protocol": "【必填】服务协议，如ws、wss、mqtt等"
    }
  },
  "defaultContentType": "application/json",
  // 【必填】API可用的通道消息
  "channel": {
    // 通道定义，每个通道下的字段详见[channelItemObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#channelItemObject)
    "/ws/inter/{interId}": {
      "description": "【非必填】API通道描述，一般情况需要说明一下",
      // 通道参数映射，参数命名规则：^[A-Za-z0-9_\-]+$，字段详见[parametersObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#parametersObject)
      "parameters": {
        // 每个参数定义
        "interId": "#/components/parameters/interId"
      },
      // 定义应用发送到通道的数据，字段详见[operationObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#operationObject)
      "subscribe": {
        "message": {
          "$ref": "#/components/messages/InterDTO"
        }
      },
      // 定义应用从通道中消费的数据，其参数定义与subscribe类似，字段详见[operationObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#operationObject)
      "publish": {},
      // 键描述协议的名称，值描述通道的协议定义
      "bindings": {
        "$ref": "#/components/channelBindings/InnerBindings"
      }
    },
    "/ws/outer/{outerId}": {
      "$ref": "#/components/channels/ChannelOuter"
    }
  },
  // 定义一些可重用的对象，字段详见[componentsObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#componentsObject)
  "components": {
    // 定义parameter中可复用的对象
    "parameters": {
      // 参数定义，每个参数下的字段详见[parameterObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#parameterObject)
      "interId": {
        "description": "参数描述",
        "schema": {
          "type": "string"
        }
      },
      "outerId": {
        "description": "参数描述",
        "schema": {
          "type": "string"
        }
      }
    },
    // 定义可复用的channel
    "channels": {
      "ChannelOuter": {
        // 通道下的字段详见[channelItemObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#channelItemObject)
        "description": "【非必填】API通道描述，一般情况需要说明一下",
        "parameters": {
          "outerId": "#/components/parameters/outerId"
        },
        "subscribe": {
          "message": {
            "$ref": "#/components/messages/OuterDTO"
          }
        }
      }
    },
    // 定义可复用的channelBindings
    "channelBindings": {
      "InnerBindings": {
        // 通道协议定义，包括ws、mqtt等，详见[channelBindingsObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#channelBindingsObject)
        "ws": {
          // websocket详见[websocket channel bindings](https://github.com/asyncapi/bindings/blob/master/websockets/README.md#channel)
          "method": "GET/POST",
          "headers": {},
          "query": {
            // query参数定义详见[schemaObject](https://www.asyncapi.com/docs/reference/specification/v2.0.0#schemaObject)
            "type": "object",
            "properties": {}
          }
        }
      }
    },
    // 定义message中可复用的对象
    "messages": {
      "InterDTO": {
        // 消息下的字段详见[messageObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#messageObject)
        "payload": {
          "$ref": "#/components/schemas/InterDataDTOObject"
        }
      },
      "OuterDTO": {
        "payload": {
          "$ref": "#/components/schemas/OuterDataDTOObject"
        }
      }
    },
    // 定义可复用的模型对象
    "schemas": {
      // schema 字段详见[SchemaObject](https://www.asyncapi.com/docs/reference/specification/v2.6.0#schemaObject)
      "InterDataDTOObject": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string", // 数据类型定义详见[dataTypeFormat](https://www.asyncapi.com/docs/reference/specification/v2.6.0#dataTypeFormat)
            "enum": ["INTER_1", "INTER_2", "INTER_3"],
            "description": "字段描述",
            "examples": ["字段值示例"],
            "default": "字段默认值"
          },
          "time": {
            "type": "string",
            "format": "date-time"
          },
          "status": {
            "type": "boolean"
          },
          "age": {
            "type": "integer",
            "format": "int32",
            "minimum": 0
          },
          "listString": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "listObject1": {
            "type": "array",
            "items": {
              "type": "object"
            }
          },
          "listObject2": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ListObject2"
            }
          }
        }
      },
      "ListObject2": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          }
        }
      },
      "OuterDataDTOObject": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "status": {
            "type": "boolean"
          }
        }
      }
    }
  }
}
```

## 工具

- 可通过 vscode asyncapi 插件可视化查看 json/yaml 定义
