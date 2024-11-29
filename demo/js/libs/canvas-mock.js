var { JSDOM } = require('jsdom');



const exposedProperties = ['window', 'navigator', 'document'];
const { document } = (new JSDOM('', { url: 'https://your-website-mock.com/' })).window;
global.document = document;
global.window = document.defaultView;
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});


function Window() {

}

Window.prototype.fillRect = function () { };

Window.prototype.clearRect = function () { };

Window.prototype.getImageData = function (x, y, w, h) {
  return {
    data: new Array(w * h * 4),
  };
};

Window.prototype.putImageData = function () { };

Window.prototype.createImageData = function () {
  return [];
};

Window.prototype.setTransform = function () {

};

Window.prototype.drawImage = function () { };

Window.prototype.save = function () { };




Window.prototype.fillText = function () { };

Window.prototype.restore = function () { };

Window.prototype.beginPath = function () { };

Window.prototype.moveTo = function () { };

Window.prototype.lineTo = function () { };

Window.prototype.clip = function () { };

Window.get = function () { return Object.create(Window.prototype); };

Window.prototype.on = function (name, callback) { callback(); };

global.window.HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillRect: () => { },
    clearRect: () => { },
    getImageData: (x, y, w, h) => {
      return {
        data: new Array(w * h * 4),
      };
    },
    putImageData: () => { },
    createImageData: () => {
      return [];
    },
    setTransform: () => { },
    drawImage: () => { },
    save: () => { },
    fillText: () => { },
    restore: () => { },
    beginPath: () => { },
    moveTo: () => { },
    lineTo: () => { },
    closePath: () => { },
    stroke: () => { },
    translate: () => { },
    scale: () => { },
    rotate: () => { },
    arc: () => { },
    fill: () => { },
    measureText: () => {
      return {
        width: 0,
      };
    },
    transform: () => { },
    rect: () => { },
    clip: () => { },
  };
};

global.window.HTMLCanvasElement.prototype.toDataURL = () => {
  return '';
};


global.navigator = {
  userAgent: 'node.js',
};

if (typeof require != "undefined" && typeof module.exports != "undefined") {
  module.exports = Window;
}
