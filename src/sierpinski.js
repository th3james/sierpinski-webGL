(function () {
  'use strict';
  window.Sierpinski = {};

  window.Sierpinski.midPoint = function(vert1, vert2) {
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
  }

  window.Sierpinski.filterTriangles = function (vertices, filterFn) {
    var keptVertices = [];
    for(var i = 0; i < vertices.length; i +=6) {
      var triangleVerts = vertices.slice(i, i+6);
      if (filterFn(triangleVerts)) {
        keptVertices = keptVertices.concat(triangleVerts);
      }
    }
    return keptVertices;
  };

  window.Sierpinski.generateVertices = function(startTriangle, levels) {
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
  window.Sierpinski.generateForWindow = function (vertices, mvpMatrix, minCount) {
    var filteredVertices = Sierpinski.filterTriangles(
      vertices, function (triangle) {
        for(var i=0; i < triangle.length; i += 2) {
          if (WebGLHelpers.inFrustrum(mvpMatrix, triangle.slice(i, i+2))) {
            return true;
          }
        }
        return false;
      }
    );

    if (filteredVertices.length < minCount ||
        filteredVertices.length < vertices.length) {
      if (filteredVertices.length < minCount) {
        return [
          true,
          flatten(mapTriangles(
            filteredVertices, function (triangle) {
              return window.Sierpinski.generateVertices(triangle, 1);
            }
          ))
        ];
      } else {
        return [true, filteredVertices];
      }
    } else {
      return [false];
    }
  };
})();
