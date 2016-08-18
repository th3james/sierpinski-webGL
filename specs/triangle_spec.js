describe("Triangle", function () {
  describe(".each", function () {
    it("calls the given function for each 6 vertices", function () {
      var triangles = [
        0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1
      ];
      var result = []
      Triangle.each(triangles, function(triangle) {
        result.push(triangle);
      });
      expect(result[0]).toEqual(triangles.slice(0,6));
      expect(result[1]).toEqual(triangles.slice(6,12));
    });
  });

  describe(".map", function () {
    it("returns the result of calling the function for each triangle", function () {
      var triangles = [
        0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1
      ];
      var result = Triangle.map(triangles, function(triangle) {
        return triangle;
      });
      expect(result[0]).toEqual(triangles.slice(0,6));
      expect(result[1]).toEqual(triangles.slice(6,12));
    });
  })

  describe(".filter", function () {
    it("filters only triangles that return true in the given function", function () {
      var triangleToKeep = [0, 1, 1, 0, 0, 0];
      var triangleToFilter = [0, 0, 1, 1, 1, 0];
      var triangles = triangleToKeep.concat(triangleToFilter);

      var filterFn = function (iterTriangle) {
        // compares 2 arrays' values (JS has no way to do this :-|)
        return (iterTriangle.length==triangleToKeep.length &&
          iterTriangle.every(function(v,i) { return v === triangleToKeep[i]})
        )
      };
      var result = Triangle.filter(triangles, filterFn);
      expect(result).toEqual(triangleToKeep);
    });
  });
});
