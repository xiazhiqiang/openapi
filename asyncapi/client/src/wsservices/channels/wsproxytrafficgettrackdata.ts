/* eslint-disable */
/* tslint:disable */
/**
 * This file was automatically generated.
 * DO NOT MODIFY IT BY HAND. Instead, run cli or script to regenerate.
 */
import { IDefaultWsProps, IMessageProps } from '../typings';
import wsRequest from './index';

/**
 * 建立ws请求连接，通过解析协议中的channel
 * @param req 请求参数
 * @param extra 请求配置项
 */
export function wsproxy_traffic_getTrackData_interId_sub<
  T extends IDefaultWsProps<
    IChannelBindingsQuery,
    IChannelParameters,
    IMessageSubscribeData
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
export function wsproxy_traffic_getTrackData_interId_pub<
  T extends IMessageProps<IMessagePublishData>,
>(p: T) {
  const { ws, data } = p;
  if (!ws || !ws.send) {
    return;
  }

  // 向服务端应用发送消息
  ws.send(JSON.stringify(data));
}

export interface IChannelBindingsQuery {
  id?: number;
  [k: string]: any;
}

export interface IChannelParameters {
  interId?: string;
  [k: string]: any;
}

export interface IMessageSubscribeData {
  status?: boolean;
  listObject2?: {
    id?: string;
    [k: string]: any;
  }[];
  [k: string]: any;
}

export interface IMessagePublishData {
  frameInterval?: number;
  [k: string]: any;
}
