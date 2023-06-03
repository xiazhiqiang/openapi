export const renderData = (dataString = '', id = 'data') => {
  let dom = document.getElementById(id);
  if (!dom) {
    const dom = document.createElement('pre');
    dom.id = id;
    dom.innerHTML = dataString;
    document.body.appendChild(dom);
  } else {
    dom.innerHTML = dataString;
  }
};
