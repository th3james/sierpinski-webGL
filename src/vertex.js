(function () {
  'use strict';
  window.Vertex = {};

  Vertex.each = function (triangleVerts, fn) {
    for(var i = 0; i < triangleVerts.length; i += 2) {
      fn(triangleVerts.slice(i, i+2), i);
    }
  };

  Vertex.map = function (vertices, fn) {
    var result = [];
    Vertex.each(vertices, function (vertex, i) {
      result.push(
        fn(vertex, i)
      );
    });
    return result;
  };
})();
