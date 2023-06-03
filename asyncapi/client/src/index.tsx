import React, { useEffect } from 'react';
// import example1 from './examples/example1';
// import example2 from './examples/example2';
import example3 from './examples/example3';
// import example4 from './examples/example4';

export default () => {
  useEffect(() => {
    // // 简单调用
    // example1();

    // // 封装调用
    // example2();

    // client请求
    example3();

    // // 覆写ws默认请求
    // example4();
  }, []);

  return (
    <div id="container">
      <h1>WebSocket Demo</h1>
      <pre id="data"></pre>
    </div>
  );
};
