(function () {
  'use strict';

  window.canvasEventStream = function (theCanvas) {
    var $canvas = theCanvas;
    var dragging = false;
    var dragStart = {x: 0, y:0};

    var width = parseInt($canvas.attr('width'), 10);
    var height = parseInt($canvas.attr('height'), 10);

    $canvas.on('mousedown', function (ev) {
      var clickEv = ev.originalEvent;
      dragStart = {x: clickEv.x, y: clickEv.y};
      dragging = true;
    });
    $canvas.on('mouseup', function () {
      dragging = false;
    });

    return {
      onDrag: function (callback) {
        $canvas.on('mousemove', function (ev) {
          if (dragging) {
            var dragEv = ev.originalEvent;
            var deltaX = dragEv.screenX - dragStart.x;
            var deltaY = dragEv.screenY - dragStart.y;
            callback(
              deltaX*(1/width),
              deltaX*(1/height)
            );
          }
        })
      }
    };
  };
}());
