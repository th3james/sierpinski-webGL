(function () {
  'use strict';

  window.CanvasEventStream = function (theCanvas) {
    var $canvas = theCanvas;
    var dragging = false;
    var dragStart = {x: 0, y:0};

    var width = parseInt($canvas.attr('width'), 10);
    var height = parseInt($canvas.attr('height'), 10);

    $canvas.on('mousedown', function (ev) {
      var clickEv = ev.originalEvent;
      dragStart = {x: clickEv.screenX, y: clickEv.screenY};
      dragging = true;
    });
    $(document).on('mouseup', function () {
      dragging = false;
    });

    return {
      onDrag: function (callback) {
        $canvas.on('mousemove', function (ev) {
          if (dragging) {
            var dragEv = ev.originalEvent;
            var deltaX = dragStart.x - dragEv.screenX;
            var deltaY = dragStart.y - dragEv.screenY;
            // reset dragStart
            dragStart = {
              x: dragEv.screenX, y: dragEv.screenY,
            };
            callback(
              -(deltaX*(1/width)),
              deltaY*(1/height)
            );
          }
        });
      }
    };
  };
}());
