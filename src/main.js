(function () {
  'use strict';
  var initShaders = function (gl) {
    var fragmentShader = WebGLHelpers.getShader(gl, "shader-fs");
    var vertexShader = WebGLHelpers.getShader(gl, "shader-vs");

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(shaderProgram)
      );
      throw "Can't init shader";
    }

    gl.useProgram(shaderProgram);

    return shaderProgram;
  };

  var initVertexPositionAttribute = function (gl, program) {
    var vertexPositionAttribute = gl.getAttribLocation(
      program, "aVertexPosition"
    );
    gl.enableVertexAttribArray(vertexPositionAttribute);
    return vertexPositionAttribute;
  };

  var initVertexColorAttribute = function (gl, program) {
    var vertexColorAttribute = gl.getAttribLocation(
      program, "aVertexColor"
    );
    gl.enableVertexAttribArray(vertexColorAttribute);
    return vertexColorAttribute;
  };

  var initBuffers = function (gl) {
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    var startTriangle = [
      0.0, 1.0,
      -1.0, -1.0,
      1.0, -1.0,
    ];
    var vertices = Sierpinski.generateVertices(startTriangle, 10);

    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW
    );
    verticesBuffer.itemSize = 2;
    verticesBuffer.numItems = vertices.length / verticesBuffer.itemSize;
    return verticesBuffer;
  };

  var initColorBuffer = function (gl) {
    var colors = [
      1.0,  1.0,  1.0,  1.0,    // white
      1.0,  0.0,  0.0,  1.0,    // red
      0.0,  1.0,  0.0,  1.0,    // green
      0.0,  0.0,  1.0,  1.0,     // blue
      1.0,  1.0,  1.0,  1.0,    // white
      1.0,  0.0,  0.0,  1.0,    // red
    ];

    var verticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return verticesColorBuffer;
  };

  var drawScene = function (gl, program, horizAspect, verticesBuffer, verticesColorBuffer, vertexPositionAttribute, vertexColorAttribute, cameraPosition) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var perspectiveMatrix = makePerspective(45, horizAspect, 0.1, 100.0);
    var mvMatrix = WebGLHelpers.calculateMvMatrix(
      WebGLHelpers.identity(), cameraPosition
    );
    WebGLHelpers.setMatrixUniforms(gl, perspectiveMatrix, mvMatrix, program);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.vertexAttribPointer(
      vertexPositionAttribute, verticesBuffer.itemSize,
      gl.FLOAT, false, 0, 0
    );

    //gl.bindBuffer(gl.ARRAY_BUFFER, verticesColorBuffer);
    //gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, verticesBuffer.numItems);
  };

  var updateWorld = function (time, cameraPosition) {
    cameraPosition[2] += 0.02;
    if (cameraPosition[2] >= -3) {
      cameraPosition[2] = -8.0;
    }
    return cameraPosition;
  };

  var renderLoop = function (
    gl, time, horizAspect, verticesBuffer, colorBuffer, shaderProgram,
    vertexPositionAttribute, vertexColorAttribute, cameraPosition
  ) {
    cameraPosition = updateWorld(time, cameraPosition);
    drawScene(
      gl, shaderProgram, horizAspect, verticesBuffer, colorBuffer, vertexPositionAttribute, vertexColorAttribute, cameraPosition
    );

    setTimeout(function() {
      time += 16;
      renderLoop(
        gl, time, horizAspect, verticesBuffer, colorBuffer, shaderProgram,
        vertexPositionAttribute, vertexColorAttribute, cameraPosition
      );
    }, 16); // roughly 60FPS
  };

  var startRenderLoop = function(gl, canvasEvents) {
    var time = 0.0;
    var verticesBuffer = initBuffers(gl);
    var colorBuffer = null; //initColorBuffer(gl);
    var shaderProgram = initShaders(gl);
    var vertexPositionAttribute = initVertexPositionAttribute(
      gl, shaderProgram
    );
    var vertexColorAttribute = null; /*initVertexColorAttribute(
      gl, shaderProgram
    );*/

    var horizAspect = 480.0/640.0;
    var cameraPosition = [0.0, 0.0, -8.0];

    canvasEvents.onDrag(function (x, y) {
      cameraPosition[0] += x;
      cameraPosition[1] += y;
    });

    renderLoop(
      gl, time, horizAspect, verticesBuffer, colorBuffer, shaderProgram,
      vertexPositionAttribute, vertexColorAttribute, cameraPosition
    );
  };
  
  window.start = function() {
    var $canvas = $("#glcanvas");
    var canvas = $canvas[0];

    var gl = WebGLHelpers.initWebGL(canvas);

    var canvasEvents = CanvasEventStream($canvas);
    startRenderLoop(gl, canvasEvents);
  };

}());
