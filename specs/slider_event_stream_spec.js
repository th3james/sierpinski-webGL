describe("SliderEventStream", function () {
  var makeSlider = function () {
    return $('<input type="range"/>');
  };

  it("returns the slider's value as a float between 0-1", function () {
    var $slider = makeSlider();
    var eventStream = SliderEventStream($slider);

    var changeListener = jasmine.createSpy('spy');
    eventStream.onChange(changeListener);

    $slider.val('64');
    $slider.trigger('input');

    expect(changeListener).toHaveBeenCalledWith(0.64);
  });
});
