describe("Sierpinski", function() {
  describe(".midPoint", function() {
    it("calculate the correct midpoint", function() {
      expect(
        Sierpinski.midPoint(0.0, 0.0, 1.0, 1.0)
      ).toEqual([0.5, 0.5]);
      expect(
        Sierpinski.midPoint(-1.0, -2.0, 1.0, 2.0)
      ).toEqual([0.0, 0.0]);
    });
  });

  describe(".generateVertices", function() {
    it("returns 3 triangles from the given triangle when level: 1", function() {
      var expectedTriangles = [
        0,1,
        -0.5,0,
        0.5,0
          ,
        -1,-1,
        0,-1,
        -0.5,0
          ,
        1,-1,
        0.5,0,
        0,-1
      ];
      var result = Sierpinski.generateVertices([
        0.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
      ], 1);

      expect(result.length).toEqual(2*3*3);
      expect(result).toEqual(expectedTriangles);
    });

    it("returns 9 triangles from the given triangle when level: 2", function() {
      var result = Sierpinski.generateVertices([
        0.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
      ], 2);

      expect(result.length).toEqual(2*3*3*3);
    });
  });
});
