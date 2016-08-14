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

  var setBufferData = function (gl, verticesBuffer, data) {
    var vertices = Sierpinski.generateVertices(data, 11);

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

    var mvMatrix = WebGLHelpers.calculateMvMatrix(
      WebGLHelpers.identity(), cameraPosition
    );
    WebGLHelpers.setMatrixUniforms(gl, perspective, mvMatrix, program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.vertexAttribPointer(
      vertexPositionAttribute, verticesBuffer.itemSize,
      gl.FLOAT, false, 0, 0
    );

    gl.drawArrays(gl.TRIANGLES, 0, verticesBuffer.numItems);
  };

  var TICK_WAIT = 16; // roughly 60FPS
  var renderLoop = function (
    gl, triangles, perspective, verticesBuffer, shaderProgram,
    vertexPositionAttribute, cameraPosition
  ) {
    drawScene(
      gl, shaderProgram, perspective, verticesBuffer, vertexPositionAttribute,
      cameraPosition
    );

    setTimeout(function () {
      renderLoop(
        gl, triangles, perspective, verticesBuffer, shaderProgram,
        vertexPositionAttribute, cameraPosition
      );
    }, TICK_WAIT); 
  };

  var startRenderLoop = function(
    gl, shaderProgram, width, height, canvasEvents, sliderEvents,
    initialTriangles
  ) {
    var verticesBuffer = initBuffers(gl, initialTriangles);
    var vertexPositionAttribute = initVertexPositionAttribute(
      gl, shaderProgram
    );

    var perspective = makePerspective(45, height/width, 0.1, 100.0);

    var MIN_ZOOM = -3.25;
    var MAX_ZOOM = -0.2;
    var cameraPosition = [0.0, 0.0, MIN_ZOOM];

    canvasEvents.onDrag(function (x, y) {
      cameraPosition[0] += x;
      cameraPosition[1] += y;
    });

    sliderEvents.onChange(function (zoomPercent) {
      cameraPosition[2] = MIN_ZOOM + (MAX_ZOOM-MIN_ZOOM)*zoomPercent;
    });

    renderLoop(
      gl, initialTriangles, perspective, verticesBuffer,
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
