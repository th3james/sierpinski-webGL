(function () {
  'use strict';
  window.Triangle = {};

  Triangle.each = function (triangleVerts, fn) {
    for(var i = 0; i < triangleVerts.length; i += 6) {
      fn(triangleVerts.slice(i, i+6), i)
    }
  };

  Triangle.map = function (triangleVerts, fn) {
    var result = [];
    Triangle.each(triangleVerts, function (triangle, i) {
      result.push(
        fn(triangle, i)
      );
    });
    return result;
  };

  Triangle.filter = function (vertices, filterFn) {
    var keptVertices = [];
    Triangle.each(vertices, function (triangleVerts) {
      if (filterFn(triangleVerts)) {
        keptVertices = keptVertices.concat(triangleVerts);
      }
    });
    return keptVertices;
  };
})();
