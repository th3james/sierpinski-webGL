describe("WebGLHelpers", function () {
  describe("inFrustrum", function() {
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
        WebGLHelpers.inFrustrum(modelViewAtLoad, vertex)
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
        WebGLHelpers.inFrustrum(modelViewAtLoad, vertex)
      ).toEqual(false);
    })
  });
});
