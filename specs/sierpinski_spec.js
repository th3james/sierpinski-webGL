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

  describe(".filterTriangles", function () {
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
      var result = Sierpinski.filterTriangles(triangles, filterFn);
      expect(result).toEqual(triangleToKeep);
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
    describe("when filtering doesn't remove any vertices", function () {
      it("returns false", function () {
        var vertCount = 3;
        var vertices = [
          0.0, 1.0,
          -1.0, -1.0,
          1.0, -1.0,
        ];
        var result = Sierpinski.generateForWindow(
          vertices, mvpMatrix, vertCount
        );
        expect(result[0]).toEqual(false);
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

        it("returns true as the first result", function () {
          expect(result[0]).toEqual(true);
        });

        it("returns the filtered vertices as the second result", function () {
          expectedFilteredVerts = [
            0.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
          ];
          expect(result[1]).toEqual(expectedFilteredVerts);
        });
      });

      describe("and there are fewer vertices than minCount", function() {
        var result;
        beforeEach(function () {
          result = Sierpinski.generateForWindow(
            originalVertices, mvpMatrix, 7
          );
        })

        it("returns true as the first result", function () {
          expect(result[0]).toEqual(true);
        });

        it("returns generated sierpinski triangles of the filtered set", function () {
          expectedFilteredVerts = [
            0.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
          ];
          expectedGeneratedVerts = Sierpinski.generateVertices(
            expectedFilteredVerts, 1
          );
          expect(result[1]).toEqual(expectedGeneratedVerts);
        });
      });
    });

  });
});
