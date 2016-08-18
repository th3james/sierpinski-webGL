describe("Vertex", function () {
  describe(".each", function () {
    it("calls the given function for each 2 points", function () {
      var vertices = [
        0, 0,
        1, 1,
        2, 2,
      ];
      var result = []
      Vertex.each(vertices, function(vertex) {
        result.push(vertex);
      });
      expect(result[0]).toEqual(vertices.slice(0,2));
      expect(result[1]).toEqual(vertices.slice(2,4));
      expect(result[2]).toEqual(vertices.slice(4,6));
    });
  });

  describe(".map", function () {
    it("returns the result of calling the function for each vertex", function () {
      var vertices = [
        0, 0,
        1, 1,
        2, 2,
      ];
      var result = Vertex.map(vertices, function(vertex) {
        return vertex;
      });
      expect(result[0]).toEqual(vertices.slice(0,2));
      expect(result[1]).toEqual(vertices.slice(2,4));
    });
  })
});

