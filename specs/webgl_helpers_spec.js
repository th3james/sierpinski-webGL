describe("WebGLHelpers", function () {
  describe(".inFrustum", function() {
    it("returns true if the vertex is inside the modelView", function() {
      // Taken from window at load
      var modelViewAtLoad = $M([
        [3.2189514164974597, 0, 0, 0],
        [0, 2.414213562373095, 0, 0],
        [0, 0, -1.002002002002002, 3.0563063063063063],
        [0, 0, -1, 3.25]
      ]);
      var vertex = [1, 0];

      expect(
        WebGLHelpers.inFrustum(modelViewAtLoad, vertex)
      ).toEqual(true);
    })

    it("returns false if the vertex is outside the modelView", function() {
      // Taken from window at load
      var modelViewAtLoad = $M([
        [3.2189514164974597, 0, 0, 0],
        [0, 2.414213562373095, 0, 0],
        [0, 0, -1.002002002002002, 2.1089134134134135],
        [0, 0, -1, 2.3045]
      ]);
      var vertex = [1, 0];

      expect(
        WebGLHelpers.inFrustum(modelViewAtLoad, vertex)
      ).toEqual(false);
    })
  });

  describe(".triangleOverlapsFrustum", function () {
    describe("given a triangle that is inside the frustum", function () {
      it("returns true", function () {
        // Taken from window at load
        var modelViewAtLoad = $M([
          [3.2189514164974597, 0, 0, 0],
          [0, 2.414213562373095, 0, 0],
          [0, 0, -1.002002002002002, 3.0563063063063063],
          [0, 0, -1, 3.25]
        ]);
        var triangle = [
          0.0, 1.0,
          -1.0, -1.0,
          1.0, -1.0,
        ];

        expect(
          WebGLHelpers.triangleInFrustum(modelViewAtLoad, triangle)
        ).toEqual(true);
      });
    });

    describe("given a triangle that is out the frustum", function () {
      it("returns true", function () {
        // Taken from window at load
        var modelViewAtLoad = $M([
          [3.2189514164974597, 0, 0, 0],
          [0, 2.414213562373095, 0, 0],
          [0, 0, -1.002002002002002, 3.0563063063063063],
          [0, 0, -1, 3.25]
        ]);
        var triangle = [
          10.0, 10.0,
          9.0, 9.0,
          10.0, 9.0,
        ];

        expect(
          WebGLHelpers.triangleInFrustum(modelViewAtLoad, triangle)
        ).toEqual(false);
      });
    });

    describe("given a triangle intersects but mostly right of the frustum", function () {
      it("returns true", function () {
        // view pushed left till only left most triangle point intersects
        var modelViewAtLoad = $M([
          [3.2189514164974593, 0, 0, 3.958304319974223],
          [0, 2.4142135623730945, 0, -0.18609562876625918],
          [0, 0, -1.0002000200020003, 3.230648064806481],
          [0, 0, -1, 3.25]
        ]);
        var triangle = [
          0.0, 1.0,
          -1.0, -1.0,
          1.0, -1.0,
        ];

        expect(
          WebGLHelpers.triangleInFrustum(modelViewAtLoad, triangle)
        ).toEqual(true);
      });
    });

    describe("given a triangle that encompasses the frustum", function () {
      it("returns true", function () {
        // view zoomed till all points of triangle are outside
        var modelViewAtLoad = $M([
          [3.2189514164974593, 0, 0, 0.0201184463531126],
          [0, 2.4142135623730945, 0, 0.04526650429449618],
          [0, 0, -1.0002000200020003, 1.4214862686268626],
          [0, 0, -1, 1.4411999999999998]
        ]);
        var triangle = [
          0.0, 1.0,
          -1.0, -1.0,
          1.0, -1.0,
        ];

        expect(
          WebGLHelpers.triangleInFrustum(modelViewAtLoad, triangle)
        ).toEqual(true);
      });
    });
  });
});
