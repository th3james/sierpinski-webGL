describe("canvasEventStream", function () {
  var makeFakeCanvas = function () {
    return $('<canvas width="640" height="480"></canvas>');
  };
  var triggerFakeMouseDown = function ($el, position) {
    $el.trigger({type: 'mousedown', originalEvent: position});
  };
  var triggerFakeMouseMove = function ($el, position) {
    $el.trigger({type: 'mousemove', originalEvent: {
      screenX: position.x, screenY: position.y
    }});
  };

  it("doesn't trigger drag events when mouse moves but dragging hasn't started", function () {
    var $canvas = makeFakeCanvas();
    var eventStream = CanvasEventStream($canvas);
    var dragListener = jasmine.createSpy('spy');
    eventStream.onDrag(dragListener);

    triggerFakeMouseMove($canvas, {x: 300, y: 240});
    expect(dragListener).not.toHaveBeenCalled();
  });

  it("triggers appropriate drag events with scaled coordinates when dragged left", function() {
    var $canvas = makeFakeCanvas();
    var eventStream = CanvasEventStream($canvas);
    var dragListener = jasmine.createSpy('spy');
    eventStream.onDrag(dragListener);

    triggerFakeMouseDown($canvas, {x: 320, y: 240});
    triggerFakeMouseMove($canvas, {x: 300, y: 240});
    expect(dragListener).toHaveBeenCalled();
  });
});
