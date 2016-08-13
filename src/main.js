(function() {
  var initShaders = function(gl) {
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

  var initVertexPositionAttribute = function(gl, program) {
    var vertexPositionAttribute = gl.getAttribLocation(
      program, "aVertexPosition"
    );
    gl.enableVertexAttribArray(vertexPositionAttribute);
    return vertexPositionAttribute;
  }

  var initVertexColorAttribute = function(gl, program) {
    var vertexColorAttribute = gl.getAttribLocation(
      program, "aVertexColor"
    );
    gl.enableVertexAttribArray(vertexColorAttribute);
    return vertexColorAttribute;
  }

  var initBuffers = function(gl) {
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

    var vertices = [
      1.0, 1.0, 0.0, 
      -1.0, 1.0,  0.0,
      1.0,  -1.0, 0.0
    ];

    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW
    );
    return verticesBuffer;
  };

  var initColorBuffer = function(gl) {
    var colors = [
      1.0,  1.0,  1.0,  1.0,    // white
      1.0,  0.0,  0.0,  1.0,    // red
      0.0,  1.0,  0.0,  1.0,    // green
      0.0,  0.0,  1.0,  1.0     // blue
    ];

    var squareVerticesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return squareVerticesColorBuffer;
  }

  var identity = function() {
    return Matrix.I(4);
  }

  var calculateMvMatrix = function(identity, cameraPosition) {
    return identity.x(
      Matrix.Translation($V([
        cameraPosition[0], cameraPosition[1], cameraPosition[2]
      ])).ensure4x4()
    );
  }

  var setMatrixUniforms = function(perspectiveMatrix, mvMatrix, shaderProgram) {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  }

  var horizAspect = 480.0/640.0;
  var drawScene = function(gl, program, verticesBuffer, squareVerticesColorBuffer, vertexPositionAttribute, vertexColorAttribute, cameraPosition) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var perspectiveMatrix = makePerspective(45, horizAspect, 0.1, 100.0);
    var mvMatrix = calculateMvMatrix(identity(), cameraPosition);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.vertexAttribPointer(
      vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    setMatrixUniforms(perspectiveMatrix, mvMatrix, program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
  }

  var startRenderLoop = function(gl) {
    var time = 0.0;
    var verticesBuffer = initBuffers(gl)
    var colorBuffer = initColorBuffer(gl);
    var shaderProgram = initShaders(gl);
    var vertexPositionAttribute = initVertexPositionAttribute(
      gl, shaderProgram
    );
    var vertexColorAttribute = initVertexColorAttribute(
      gl, shaderProgram
    );

    var cameraPosition = [0.0, 0.0, -6.0];

    renderLoop(
      gl, time, verticesBuffer, colorBuffer, shaderProgram,
      vertexPositionAttribute, vertexColorAttribute, cameraPosition
    );
  }

  var renderLoop = function(
    gl, time, verticesBuffer, colorBuffer, shaderProgram,
    vertexPositionAttribute, vertexColorAttribute, cameraPosition
  ) {
    cameraPosition = updateWorld(time, cameraPosition);
    drawScene(
      gl, shaderProgram, verticesBuffer, colorBuffer, vertexPositionAttribute, vertexColorAttribute, cameraPosition
    );

    setTimeout(function() {
      time += 16;
      renderLoop(
        gl, time, verticesBuffer, colorBuffer, shaderProgram,
        vertexPositionAttribute, vertexColorAttribute, cameraPosition
      )
    }, 250);//16); // roughly 60FPS
  }

  var updateWorld = function(time, cameraPosition) {
    cameraPosition[2] += 0.02;
    if (cameraPosition[2] >= -3) {
      cameraPosition[2] = -8.0;
    }
    return cameraPosition;
  }
  
  window.start = function() {
    var canvas = document.getElementById("glcanvas");
    var gl = WebGLHelpers.initWebGL(canvas);

    startRenderLoop(gl)
  };


})()
