(function () {
  'use strict';
  window.Sierpinski = {};

  window.Sierpinski.midPoint = function(x1, y1, x2, y2) {
    var xMid = (x1 + x2)/2;
    var yMid = (y1 + y2)/2;
    return [xMid, yMid];
  };

  window.Sierpinski.generateVertices = function(startTriangle, levels) {
    var newTriangles = [];

    // for each vertex
    for(var i = 0; i < startTriangle.length; i += 2) {
      var rootVertex = startTriangle.slice(i, i+2);

      // for each other vertex
      for(var p = 0; p < startTriangle.length; p += 2) {
        var offset = (i+p)%startTriangle.length;
        var otherVertex = startTriangle.slice(offset, offset + 2);

        var mid = Sierpinski.midPoint(
          rootVertex[0], rootVertex[1], otherVertex[0], otherVertex[1]
        );
        newTriangles.push(mid[0]);
        newTriangles.push(mid[1]);
      }
    }

    if (levels <= 1) {
      return newTriangles;
    } else {
      var thirdLength = newTriangles.length/3;

      return [0,1,2].map(function(i) {
        var start = i*thirdLength;
        var end = (i+1)*thirdLength;
        return Sierpinski.generateVertices(
          newTriangles.slice(start, end),
          levels - 1
        );
      }).reduce(function(allSubTriangles, subTriangles) {
        return allSubTriangles.concat(subTriangles);
      }, []);
    }
  };
})();
