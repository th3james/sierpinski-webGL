describe("Sierpinski", function() {
  describe(".midPoint", function() {
    it("calculate the correct midpoint", function() {
      expect(
        Sierpinski.midPoint([0.0, 0.0], [1.0, 1.0])
      ).toEqual([0.5, 0.5]);
      expect(
        Sierpinski.midPoint([-1.0, -2.0], [1.0, 2.0])
      ).toEqual([0.0, 0.0]);
    });
  });

  describe(".generateVertices", function() {
    it("returns 3 triangles from the given triangle when level: 1", function() {
      var expectedTriangles = [
         0, 1,
         -0.5, 0,
         0.5, 0,

         -0.5, 0,
         -1, -1,
         0, -1,

         0.5, 0,
         0, -1,
         1, -1
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
      var inputVerts = [
        0.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
      ];
      var result = Sierpinski.generateVertices(inputVerts, 2);

      expect(result.length).toEqual(2*3*3*3);

      var levelOne = Sierpinski.generateVertices(inputVerts, 1);
      var thirdLength = levelOne.length / 3;
      expect(
        result.slice(0, 2*3*3)
      ).toEqual(
        Sierpinski.generateVertices(
          levelOne.slice(0, thirdLength), 1
        )
      );
      expect(
        result.slice(2*3*3, 2*3*3*2)
      ).toEqual(
        Sierpinski.generateVertices(
          levelOne.slice(thirdLength, thirdLength+thirdLength), 1
        )
      );
    });
  });
});
