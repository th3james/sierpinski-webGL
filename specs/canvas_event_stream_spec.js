describe("canvasEventStream", function () {
  var canvasWidth = 640,
    canvasHeight = 480;
  var makeFakeCanvas = function () {
    return $('<canvas width="' + canvasWidth + '" height="' + canvasHeight + '"></canvas>');
  };
  var triggerFakeMouseDown = function ($el, position) {
    $el.trigger({type: 'mousedown', originalEvent: {
      screenX: position.x, screenY: position.y
    }});
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
    var expectedX = (320 - 300)*(1/canvasWidth);
    expect(dragListener).toHaveBeenCalledWith(expectedX, 0);
  });

  it("triggers appropriate drag events with scaled coordinates when dragged up", function() {
    var $canvas = makeFakeCanvas();
    var eventStream = CanvasEventStream($canvas);
    var dragListener = jasmine.createSpy('spy');
    eventStream.onDrag(dragListener);

    triggerFakeMouseDown($canvas, {x: 320, y: 240});
    triggerFakeMouseMove($canvas, {x: 320, y: 250});
    var expectedY = (240 - 250)*(1/canvasHeight);
    expect(dragListener).toHaveBeenCalledWith(0, expectedY);
  });

  it("triggers triggering two drag events emits both events correctly", function() {
    var $canvas = makeFakeCanvas();
    var eventStream = CanvasEventStream($canvas);
    var dragListener = jasmine.createSpy('spy');
    eventStream.onDrag(dragListener);

    triggerFakeMouseDown($canvas, {x: 320, y: 240});
    triggerFakeMouseMove($canvas, {x: 320, y: 250});
    var expectedY = (240 - 250)*(1/canvasHeight);
    triggerFakeMouseMove($canvas, {x: 300, y: 250});
    var expectedX = (320 - 300)*(1/canvasWidth);
    expect(dragListener).toHaveBeenCalledWith(
      0, expectedY
    );
    expect(dragListener).toHaveBeenCalledWith(
      expectedX, 0
    );
  });
});
