(function () {
  'use strict';
  window.Sierpinski = {};

  window.Sierpinski.midPoint = function(x1, y1, x2, y2) {
    var xMid = (x1 + x2)/2;
    var yMid = (y1 + y2)/2;
    return [xMid, yMid];
  };

  var mapPairs = function (arr, fn) {
    var result = []
    for(var i = 0; i < arr.length; i += 2) {
      result.push(
        fn(arr.slice(i, i+2), i)
      );
    }
    return result;
  };

  var flattenTriangles = function (triangles) {
    return triangles.reduce(function(flattened, triangle) {
      return flattened.concat(triangle);
    }, [])
  }

  window.Sierpinski.generateVertices = function(startTriangle, levels) {
    var newTriangles = mapPairs(startTriangle, function(rootVertex) {
      // collect mid points between each vertex 
      var midPoints = mapPairs(startTriangle, function(otherVertex) {
        return Sierpinski.midPoint(
          rootVertex[0], rootVertex[1], otherVertex[0], otherVertex[1]
        );
      })

      return midPoints.reduce(function (flatten, mid) {
        return flatten.concat(mid);
      }, []);
    });

    if (levels > 1) {
      newTriangles = newTriangles.map(function (triangle) {
        return Sierpinski.generateVertices(triangle, levels - 1);
      })
    }
    return flattenTriangles(newTriangles);
  };
})();
