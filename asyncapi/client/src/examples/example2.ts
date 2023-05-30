import { renderData } from '../utils/index';
import wsRequest from '../wsservices/index';

export default function () {
  const url = 'ws://127.0.0.1:3000/wsproxy/traffic/getTrackData?id=123';

  // 心跳
  let heartbeatTimer: any = null;

  wsRequest({
    url,
    onOpen: ({ ws }) => {
      const data = {
        frameInterval: 1500, // 数据更新间隔时间，单位ms
      };

      // 定时发送心跳请求
      heartbeatTimer = setInterval(() => {
        ws.send(JSON.stringify({ msg: '心跳数据' }));
      }, 3000);

      // 发送必要数据
      ws.send(JSON.stringify(data));
    },
    onMessage: ({ ws, msg, data }) => {
      // console.log("msg", msg);
      renderData(JSON.stringify(data));
    },
    onClose: ({ ws, event }) => {
      console.log('close', event);
      renderData('close connection');

      // 停止心跳
      heartbeatTimer && clearInterval(heartbeatTimer);
    },
    onError: ({ error }) => {
      console.log('error', error);
    },
  });
}
