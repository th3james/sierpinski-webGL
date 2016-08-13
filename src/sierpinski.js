(function() {
  window.Sierpinski = {}

  Sierpinski.midPoint = function(x1, y1, x2, y2) {
    var xMid = (x1 + x2)/2;
    var yMid = (y1 + y2)/2;
    return [xMid, yMid];
  }

  Sierpinski.generateVertices = function(startTriangle) {
    newTriangles = []
    for(var i = 0; i < startTriangle.length; i += 2) {
      var root = startTriangle.slice(i, i+2);
      for(var p = 0; p < startTriangle.length; p += 2) {
        var pointOffset = (i+p)%startTriangle.length;
        var point = startTriangle.slice(pointOffset, pointOffset + 2);

        var mid = Sierpinski.midPoint(root[0], root[1], point[0], point[1]);
        newTriangles.push(mid[0])
        newTriangles.push(mid[1]);
      }
    }

    return newTriangles;
  };
})();
