export const renderData = (dataString = "") => {
  let dom = document.getElementById("data");
  if (!dom) {
    const dom = document.createElement("pre");
    dom.id = "data";
    dom.innerHTML = dataString;
    document.body.appendChild(dom);
  } else {
    dom.innerHTML = dataString;
  }
};
