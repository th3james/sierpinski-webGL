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
});
