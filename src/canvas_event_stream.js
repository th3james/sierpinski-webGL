(function () {
  'use strict';
  window.canvasEventStream = function (theCanvas) {
    var $canvas = theCanvas;

    return {
      onDrag: function (callback) {
        setTimeout(function () {
          callback(1.0, -1.0)
        }, 2000);
      }
    };
  }
}());
