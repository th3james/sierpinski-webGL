describe("canvasEventStream", function () {
  var $canvas = $('<canvas width="640" height="480"></canvas>');

  it("doesn't trigger drag events when mouse moves but dragging hasn't started", function () {
    var eventStream = CanvasEventStream($canvas);
    var dragListener = jasmine.createSpy('spy');
    eventStream.onDrag(dragListener);

    $canvas.trigger("mousemove");
    expect(dragListener).not.toHaveBeenCalled();
  });
});
