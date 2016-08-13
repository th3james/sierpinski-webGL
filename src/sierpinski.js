(function() {
  window.Sierpinski = {}

  Sierpinski.generateVertices = function() {
    startTriangle = [
      0.0, 1,
      0.1, -1,
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
