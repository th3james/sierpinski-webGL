# Sierpinski triangle in WebGL
An implementation of the
[Sierpinski Triangle](https://en.wikipedia.org/wiki/Sierpinski_triangle) in
JavaScript and WebGL.

# Running it
Simply open `index.html` in your browser (scripts are loaded relatively). You can
see the Jasmine test output by opening `tests.html`.

# Where's the algorithm?
`src/sierpinski.js` contains the code that builds the vertices for the
triangles. The API is:

    // parent triangle
    var triangle = [
       0.0, 1.0, // vert 1
       -1.0, -1.0, // vert 2
       1.0, -1.05 // vert 3
    ]
    // Amount of sub levels to build
    var levels = 3
    // Build vertices for 3 levels of sub triangles inside given triangle
    Sierpinski.generateVertices(triangle, levels);

The returned value is a flattened array of pairs of vertices, each step of
three pairs representing one triangle. This format is suitable for sending
straight to the vertex shader buffer when set to gl.TRIANGLES
