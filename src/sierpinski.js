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
      leftOffset = (i+2)%startTriangle.length
      var left = startTriangle.slice(leftOffset, leftOffset + 2);
      rightOffset = (i+4)%startTriangle.length
      var right = startTriangle.slice(rightOffset, rightOffset + 2);

      newTriangles.push(root[0]);
      newTriangles.push(root[1]);
      midLeft = Sierpinski.midPoint(root[0], root[1], left[0], left[1]);
      newTriangles.push(midLeft[0]);
      newTriangles.push(midLeft[1]);
      midRight = Sierpinski.midPoint(root[0], root[1], right[0], right[1]);
      newTriangles.push(midRight[0])
      newTriangles.push(midRight[1]);
    }

    return newTriangles;
  };
})();
