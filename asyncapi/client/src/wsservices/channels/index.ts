/* eslint-disable */
/* tslint:disable */

/**
 * 所有Channel请求，这一层是为了做内部通用处理
 */

import wsRequest from '../index';
import { IDefaultRequestProps } from '../typings';

export interface IWsMiddleProps<QUERY, PARAMETERS>
  extends IDefaultRequestProps {
  parameters?: PARAMETERS;
  query?: QUERY;
}

// websocket请求服务
export default function ({
  prefix = '',
  url = '',
  path = '',
  query,
  ...others
}: IWsMiddleProps<any, any>) {
  // todo 参数处理，将prefix和path转换为ws url
  if (process.env.NODE_ENV !== 'production') {
    if (!prefix) {
      prefix = 'ws://127.0.0.1:3000';
    }
  }

  // 将query与path拼接
  if (query && JSON.stringify(query) !== '{}') {
    path +=
      '?' +
      Object.keys(query)
        .map((k) => `${k}=${encodeURIComponent(query[k])}`)
        .join('&');
  }

  return wsRequest({ url, prefix, path, ...others });
}
