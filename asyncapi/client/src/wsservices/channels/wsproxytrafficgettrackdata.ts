/* eslint-disable */
/* tslint:disable */

import { IDefaultWsProps, IMessageProps } from '../typings';
import wsRequest from './index';

/**
 * 客户端向服务端发送消息
 * @param {*} param0
 */
export function _wsproxy_traffic_getTrackData_pub<
  T extends IMessageProps<ISchemas_ReceiveDataDTOObject>,
>({ ws, data }: T) {
  if (!ws || !ws.send) {
    return;
  }

  // 向服务端应用发送消息
  ws.send(JSON.stringify(data));
}

/**
 * 建立ws请求连接，通过解析协议中的channel
 * @param req 请求参数
 * @param extra 请求配置项
 */
export function _wsproxy_traffic_getTrackData<
  T extends IDefaultWsProps<
    IChannelBindings_InnerBindings,
    any, // TODO parameters 定义
    ISchemas_InterDataDTOObject
  >,
>(p: T) {
  return wsRequest({
    path: '/wsproxy/traffic/getTrackData',
    ...p,
  });
}

// TODO TypeScript 类型定义
interface IChannelBindings_InnerBindings {}

interface ISchemas_InterDataDTOObject {
  status?: boolean;
  listObject2: {
    id?: string;
  }[];
}

interface ISchemas_ReceiveDataDTOObject {
  frameInterval?: number | 1000;
}
