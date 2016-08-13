(function() {
  window.Sierpinski = {}

  Sierpinski.midPoint = function(x1, y1, x2, y2) {
    var xMid = (x1 + x2)/2;
    var yMid = (y1 + y2)/2;
    return [xMid, yMid];
  }

  Sierpinski.generateVertices = function() {
    startTriangle = [
      0.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ];

    return [
      -0.2, -0.5,
      0.2, -0.5,
      0.0, -0.8,
      -0.2, -0.2,
      0.2, -0.2,
      0.0, 0.2,
    ]
  };
})();
