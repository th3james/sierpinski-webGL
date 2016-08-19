(function () {
  'use strict';

  var initVertexPositionAttribute = function (gl, program) {
    var vertexPositionAttribute = gl.getAttribLocation(
      program, "aVertexPosition"
    );
    gl.enableVertexAttribArray(vertexPositionAttribute);
    return vertexPositionAttribute;
  };

  var initBuffers = function (gl, initialTriangles) {
    var verticesBuffer = gl.createBuffer();

    setBufferData(gl, verticesBuffer, initialTriangles);
    return verticesBuffer;
  };

  var setBufferData = function (gl, verticesBuffer, vertices) {
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW
    );
    verticesBuffer.itemSize = 2;
    verticesBuffer.numItems = vertices.length / verticesBuffer.itemSize;
  };

  var drawScene = function (
    gl, program, perspective, mvMatrix, verticesBuffer, vertexPositionAttribute
  ) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    WebGLHelpers.setMatrixUniforms(gl, perspective, mvMatrix, program);
    
    // point vertex attribute to vertices buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.vertexAttribPointer(
      vertexPositionAttribute, verticesBuffer.itemSize,
      gl.FLOAT, false, 0, 0
    );

    // draw triangles
    gl.drawArrays(gl.TRIANGLES, 0, verticesBuffer.numItems);
  };

  var TICK_WAIT = 16; // roughly 60FPS
  var START_TRIANGLE = [
    0.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
  ];
  var MIN_VERTICES = 5000;
  var renderLoop = function (
    gl, vertices, perspective, verticesBuffer, shaderProgram,
    vertexPositionAttribute, cameraPosition
  ) {
    var mvMatrix = WebGLHelpers.calculateMvMatrix(
      WebGLHelpers.identity(), cameraPosition
    );

    vertices = Sierpinski.generateForWindow(
      START_TRIANGLE, perspective.x(mvMatrix), MIN_VERTICES
    );
    setBufferData(gl, verticesBuffer, vertices);

    drawScene(
      gl, shaderProgram, perspective, mvMatrix, verticesBuffer,
      vertexPositionAttribute
    );

    setTimeout(function () {
      renderLoop(
        gl, vertices, perspective, verticesBuffer, shaderProgram,
        vertexPositionAttribute, cameraPosition
      );
    }, TICK_WAIT); 
  };

  var startRenderLoop = function(
    gl, shaderProgram, width, height, canvasEvents, sliderEvents,
    initialTriangles
  ) {
    var vertices = Sierpinski.generateVertices(initialTriangles, 3);
    var verticesBuffer = initBuffers(gl, vertices);
    var vertexPositionAttribute = initVertexPositionAttribute(
      gl, shaderProgram
    );

    // camera
    var perspective = makePerspective(45, height/width, 0.001, 4.0);
    var MIN_ZOOM = -3.25;
    var MAX_ZOOM = -0.01;
    var cameraPosition = [0.0, 0.0, MIN_ZOOM];

    // User events
    canvasEvents.onDrag(function (x, y) {
      cameraPosition[0] += x * Math.abs(cameraPosition[2]);
      cameraPosition[1] += y * Math.abs(cameraPosition[2]);
    });

    sliderEvents.onChange(function (zoomPercent) {
      cameraPosition[2] = MIN_ZOOM + (MAX_ZOOM-MIN_ZOOM)*zoomPercent;
    });

    // main loop
    renderLoop(
      gl, vertices, perspective, verticesBuffer,
      shaderProgram, vertexPositionAttribute, cameraPosition
    );
  };
  
  window.start = function() {
    var $canvas = $("#glcanvas");
    var canvas = $canvas[0];

    var gl = WebGLHelpers.initWebGL(canvas);
    var canvasEvents = CanvasEventStream($canvas);

    var $slider = $("#zoom-slider");
    var sliderEvents = SliderEventStream($slider);

    var shaderProgram = WebGLHelpers.initShaders(
      gl, "shader-fs", "shader-vs"
    );

    startRenderLoop(
      gl, shaderProgram, canvas.width, canvas.height,
      canvasEvents, sliderEvents, START_TRIANGLE
    );
  };

}());
