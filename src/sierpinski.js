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

  var partitionThirds = function (arr) {
    var thirdLength = arr.length/3;

    return [0,1,2].map(function(i) {
      var start = i*thirdLength;
      var end = (i+1)*thirdLength;
      return arr.slice(start, end);
    });
  };

  window.Sierpinski.generateVertices = function(startTriangle, levels) {
    var newTriangles = [];

    // for each vertex
    eachPair(startTriangle, function(rootVertex) {
      // for each other vertex
      eachPair(startTriangle, function(otherVertex) {
        var mid = Sierpinski.midPoint(
          rootVertex[0], rootVertex[1], otherVertex[0], otherVertex[1]
        );
        newTriangles.push(mid[0]);
        newTriangles.push(mid[1]);
      });
    });

    if (levels <= 1) {
      return newTriangles;
    } else {
      return partitionThirds(newTriangles).map(function (triangle) {
        return Sierpinski.generateVertices(triangle, levels - 1);
      }).reduce(function(allSubTriangles, subTriangles) {
        return allSubTriangles.concat(subTriangles);
      }, []);
    }
  };
})();
