(function () {
  'use strict';

  window.SliderEventStream = function (theSlider) {
    var $slider = theSlider;

    return {
      onChange: function(callback) {
        $slider.on('input', function (ev) {
          callback(
            parseInt(ev.currentTarget.value, 10)/100
          );
        });
      }
    };
  };
}());
