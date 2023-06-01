/* eslint-disable */
/* tslint:disable */

import { IDefaultWsProps, IMessageProps } from '../typings';
import wsRequest from './index';

/**
 * 建立ws请求连接，通过解析协议中的channel
 * @param req 请求参数
 * @param extra 请求配置项
 */
export function _wsproxy_traffic_getTrackData_sub<
  T extends IDefaultWsProps<
    IChannelBindings_Query,
    IParameters,
    ISchemas_InterDataDTOObject
  >,
>(p: T) {
  const pp = p?.parameters || {};
  return wsRequest({
    // 之所以在这里拼接path中的parameters，是因为要保证在path中顺序
    path: `/wsproxy/traffic/getTrackData/${pp.interId || ''}`,
    ...p,
  });
}

/**
 * 客户端向服务端发送消息
 * @param {*} param0
 */
export function _wsproxy_traffic_getTrackData_pub<
  T extends IMessageProps<ISchemas_ReceiveDataDTOObject>,
>(p: T) {
  const { ws, data } = p;
  if (!ws || !ws.send) {
    return;
  }

  // 向服务端应用发送消息
  ws.send(JSON.stringify(data));
}

// TypeScript 类型定义
interface IChannelBindings_Query {
  id?: number;
}

interface IParameters {
  interId?: string;
}

interface ISchemas_InterDataDTOObject {
  status?: boolean;
  listObject2: {
    id?: string;
  }[];
}

interface ISchemas_ReceiveDataDTOObject {
  frameInterval?: number | 1000;
}
