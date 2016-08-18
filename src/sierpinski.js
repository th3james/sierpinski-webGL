(function () {
  'use strict';
  window.Sierpinski = {};

  Sierpinski.midPoint = function(vert1, vert2) {
    var xMid = (vert1[0] + vert2[0])/2;
    var yMid = (vert1[1] + vert2[1])/2;
    return [xMid, yMid];
  };

  var mapPairs = function (arr, fn) {
    var result = [];
    for(var i = 0; i < arr.length; i += 2) {
      result.push(
        fn(arr.slice(i, i+2), i)
      );
    }
    return result;
  };

  var flatten = function (arr) {
    return arr.reduce(function(flattened, subArr) {
      return flattened.concat(subArr);
    }, []);
  };

  var mapTriangles = function (triangleVerts, fn) {
    var result = [];
    for(var i = 0; i < triangleVerts.length; i += 6) {
      result.push(
        fn(triangleVerts.slice(i, i+6), i)
      );
    }
    return result;
  };

  Sierpinski.filterTriangles = function (vertices, filterFn) {
    var keptVertices = [];
    for(var i = 0; i < vertices.length; i +=6) {
      var triangleVerts = vertices.slice(i, i+6);
      if (filterFn(triangleVerts)) {
        keptVertices = keptVertices.concat(triangleVerts);
      }
    }
    return keptVertices;
  };

  Sierpinski.generateVertices = function(startTriangle, levels) {
    var newTriangles = mapPairs(startTriangle, function(rootVertex) {
      // collect mid points between each vertex 
      var midPoints = mapPairs(startTriangle, function(otherVertex) {
        return Sierpinski.midPoint(rootVertex, otherVertex);
      });

      return flatten(midPoints);
    });

    if (levels > 1) {
      newTriangles = newTriangles.map(function (triangle) {
        return Sierpinski.generateVertices(triangle, levels - 1);
      });
    }
    return flatten(newTriangles);
  };

  // Generate > minCount sierpinksi vertices inside the given viewport,
  // inside the given vertices
  // 
  // returns tuple array containing
  // [bool generatedNewVerts?, arr newVerts (if first arg true)]
  Sierpinski.generateForWindow = function (vertices, mvpMatrix, minCount) {
    var filteredVertices = Sierpinski.filterTriangles(
      vertices, function (triangle) {
        return WebGLHelpers.triangleInFrustum(mvpMatrix, triangle);
      }
    );

    if (filteredVertices.length < minCount ||
        filteredVertices.length < vertices.length) {
      if (filteredVertices.length < minCount) {
        filteredVertices = flatten(mapTriangles(
          filteredVertices, function (triangle) {
            return Sierpinski.generateVertices(triangle, 1);
          }
        ));
        if (filteredVertices.length < minCount) {
          // still not enough vertices? recurse
          filteredVertices = Sierpinski.generateForWindow(
            filteredVertices, mvpMatrix, minCount
          )[1];
        }
      }
      return [true, filteredVertices];
    } else {
      return [false];
    }
  };
})();
