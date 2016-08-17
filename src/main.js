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
    gl, program, perspective, verticesBuffer, vertexPositionAttribute,
    cameraPosition
  ) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set perspective and model view
    var mvMatrix = WebGLHelpers.calculateMvMatrix(
      WebGLHelpers.identity(), cameraPosition
    );
    WebGLHelpers.setMatrixUniforms(gl, perspective, mvMatrix, program);
    //inFrustrum(perspective.x(mvMatrix), [1, 0]);
    
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
  var renderLoop = function (
    gl, vertices, perspective, verticesBuffer, shaderProgram,
    vertexPositionAttribute, cameraPosition
  ) {
    updateVertices(gl, vertices, verticesBuffer);
    drawScene(
      gl, shaderProgram, perspective, verticesBuffer, vertexPositionAttribute,
      cameraPosition
    );

    setTimeout(function () {
      renderLoop(
        gl, vertices, perspective, verticesBuffer, shaderProgram,
        vertexPositionAttribute, cameraPosition
      );
    }, TICK_WAIT); 
  };

  var updateVertices = function (gl, vertices, buffer) {
    if (Math.random() < 0.01) {
      var newTriangles = vertices.slice(0,6*90);

      setBufferData(gl, buffer, newTriangles);
    }
  };

  var startRenderLoop = function(
    gl, shaderProgram, width, height, canvasEvents, sliderEvents,
    initialTriangles
  ) {
    var vertices = Sierpinski.generateVertices(initialTriangles, 7);
    var verticesBuffer = initBuffers(gl, vertices);
    var vertexPositionAttribute = initVertexPositionAttribute(
      gl, shaderProgram
    );

    // camera
    var perspective = makePerspective(45, height/width, 0.1, 100.0);

    var MIN_ZOOM = -3.25;
    var MAX_ZOOM = -0.2;
    var cameraPosition = [0.0, 0.0, MIN_ZOOM];

    // User events
    canvasEvents.onDrag(function (x, y) {
      cameraPosition[0] += x;
      cameraPosition[1] += y;
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

    var startTriangle = [
      0.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ];

    startRenderLoop(
      gl, shaderProgram, canvas.width, canvas.height,
      canvasEvents, sliderEvents, startTriangle
    );
  };

}());
