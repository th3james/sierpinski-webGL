(function () {
  'use strict';
  window.Sierpinski = {};

  window.Sierpinski.midPoint = function(x1, y1, x2, y2) {
    var xMid = (x1 + x2)/2;
    var yMid = (y1 + y2)/2;
    return [xMid, yMid];
  };

  var eachPair = function (arr, fn) {
    for(var i = 0; i < arr.length; i += 2) {
      fn(arr.slice(i, i+2), i);
    }
  };

  var flattenTriangles = function (triangles) {
    return triangles.reduce(function(flattenedTriangle, triangle) {
      return flattenedTriangle.concat(triangle);
    }, [])
  }

  window.Sierpinski.generateVertices = function(startTriangle, levels) {
    var newTriangles = [];

    // for each vertex
    eachPair(startTriangle, function(rootVertex) {
      // for each other vertex
      var newTriangle = []
      eachPair(startTriangle, function(otherVertex) {
        var mid = Sierpinski.midPoint(
          rootVertex[0], rootVertex[1], otherVertex[0], otherVertex[1]
        );
        newTriangle.push(mid[0]);
        newTriangle.push(mid[1]);
      });
      newTriangles.push(newTriangle);
    });

    if (levels > 1) {
      newTriangles = newTriangles.map(function (triangle) {
        return Sierpinski.generateVertices(triangle, levels - 1);
      })
    }
    return flattenTriangles(newTriangles);
  };
})();
