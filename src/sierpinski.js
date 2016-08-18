(function () {
  'use strict';
  window.Sierpinski = {};

  Sierpinski.midPoint = function(vert1, vert2) {
    var xMid = (vert1[0] + vert2[0])/2;
    var yMid = (vert1[1] + vert2[1])/2;
    return [xMid, yMid];
  };

  var flatten = function (arr) {
    return arr.reduce(function(flattened, subArr) {
      return flattened.concat(subArr);
    }, []);
  };

  Sierpinski.generateVertices = function(startTriangle, levels) {
    var newTriangles = Vertex.map(startTriangle, function(rootVertex) {
      // collect mid points between each vertex 
      var midPoints = Vertex.map(startTriangle, function(otherVertex) {
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

  // Generate > minCount sierpinksi vertices inside the given viewport and
  // inside the given vertices
  Sierpinski.generateForWindow = function (vertices, mvpMatrix, minCount) {
    var filteredVertices = Triangle.filter(
      vertices, function (triangle) {
        return WebGLHelpers.triangleInFrustum(mvpMatrix, triangle);
      }
    );

    if (filteredVertices.length === 0 ) {
      return [];
    } else if (filteredVertices.length < minCount) {
      filteredVertices = flatten(Triangle.map(
        filteredVertices, function (triangle) {
          return Sierpinski.generateVertices(triangle, 1);
        }
      ));
      if (filteredVertices.length < minCount) {
        // still not enough vertices? recurse
        filteredVertices = Sierpinski.generateForWindow(
          filteredVertices, mvpMatrix, minCount
        );
      }
    }
    return filteredVertices;
  };
})();
