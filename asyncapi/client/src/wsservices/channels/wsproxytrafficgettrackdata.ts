/* eslint-disable */
/* tslint:disable */

import { IOnMessageProps } from '../typings';
import wsRequest, { IWsMiddleProps } from './index';

export interface IParameters_I {}

export interface IChannelBindings_InnerBindings {}

export interface ISchemas_InterDataDTOObject {
  status?: boolean;
  listObject2: {
    id?: string;
  }[];
}

// ----------------------------------------------------------------

/**
 * 接收客户端的消息
 * @param {*} param0
 */
export async function _wsproxy_traffic_getTrackData_pub({ ws }) {}

/**
 * 建立ws请求连接，通过解析协议中的channel
 * @param req 请求参数
 * @param extra 请求配置项
 */
export function _wsproxy_traffic_getTrackData({
  parameters,
  onMessage,
  ...others
}: IWsMiddleProps<IChannelBindings_InnerBindings, any>) {
  return wsRequest({
    path: '/wsproxy/traffic/getTrackData',
    onMessage: (p: IOnMessageProps<ISchemas_InterDataDTOObject>) => {
      typeof onMessage === 'function' && onMessage(p);
    },
    ...others,
  });
}
