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

  describe(".generateForWindow", function () {
    // Window load matrix
    var mvpMatrix = $M([
      [3.2189514164974597, 0, 0, 0],
      [0, 2.414213562373095, 0, 0],
      [0, 0, -1.002002002002002, 3.0563063063063063],
      [0, 0, -1, 3.25]
    ]);

    describe("when filtering removes all vertices", function () {
      it("returns empty array", function () {
        var outsideVertices = [
          10.0, 10.0,
          9.0, 9.0,
          10.0, 9.0,
        ];
        var result = Sierpinski.generateForWindow(
          outsideVertices, mvpMatrix, 3
        );
        expect(result).toEqual([]);
      });
    });

    describe("when filtering doesn't remove any vertices and is longer the minCount", function () {
      it("returns the same object", function () {
        var vertices = [
          0.0, 1.0,
          -1.0, -1.0,
          1.0, -1.0,
        ];
        var result = Sierpinski.generateForWindow(
          vertices, mvpMatrix, 3
        );
        expect(result).toEqual(vertices);
      });
    });

    describe("when filtering removes some vertices", function () {
      var originalVertices;
      beforeEach(function () {
        originalVertices = [
          0.0, 1.0,
          -1.0, -1.0,
          1.0, -1.0,
          10.0, 10.0,
          9.0, 9.0,
          10.0, 9.0,
        ];
      });
      describe("and there are still more vertices than minCount", function() {
        var result;
        beforeEach(function () {
          result = Sierpinski.generateForWindow(
            originalVertices, mvpMatrix, 3
          );
        })

        it("returns the filtered vertices", function () {
          expectedFilteredVerts = [
            0.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
          ];
          expect(result).toEqual(expectedFilteredVerts);
        });
      });

      describe("and there are fewer vertices than minCount", function() {
        var result;
        beforeEach(function () {
          result = Sierpinski.generateForWindow(
            originalVertices, mvpMatrix, 7
          );
        })

        it("returns generated sierpinski triangles of the filtered set", function () {
          expectedFilteredVerts = [
            0.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
          ];
          expectedGeneratedVerts = Sierpinski.generateVertices(
            expectedFilteredVerts, 1
          );
          expect(result).toEqual(expectedGeneratedVerts);
        });
      });
    });
  });
});
