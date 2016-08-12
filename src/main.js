(function() {
  var initWebGL = function(canvas) {
    gl = canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    
    return gl;
  };

  var getShader = function(gl, id, type) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
      alert("Failed to load shader");
      throw "Failed to load shader"
    }

    theSource = shaderScript.text;

    if (!type) {
      if (shaderScript.type == "x-shader/x-fragment") {
        type = gl.FRAGMENT_SHADER;
      } else if (shaderScript.type == "x-shader/x-vertex") {
        type = gl.VERTEX_SHADER;
      } else {
        throw "Can't determine shader type";
      }
    }

    shader = gl.createShader(type);
    gl.shaderSource(shader, theSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert(
        "An error occurred compiling the shaders: " +
        gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      throw "Failed to compile shader";
    }

    return shader;
  };

  var initShaders = function(gl) {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

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
    var squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    var verticies = [
      1.0, 1.0, 0.0, 
      -1.0, 1.0,  0.0,
      1.0,  -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];

    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW
    );
    return squareVerticesBuffer;
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

  var loadIdentity = function() {
    mvMatrix = Matrix.I(4);
  }

  var multMatrix = function(m) {
    mvMatrix = mvMatrix.x(m);
  }

  var mvTranslate = function(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
  }

  var setMatrixUniforms = function(perspectiveMatrix, shaderProgram) {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  }

  var horizAspect = 480.0/640.0;
  var drawScene = function(gl, program, squareVerticesBuffer, squareVerticesColorBuffer, vertexPositionAttribute, vertexColorAttribute) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var perspectiveMatrix = makePerspective(45, horizAspect, 0.1, 100.0);

    loadIdentity();
    mvTranslate([-0.0, 0.0, -6.0]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(
      vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    setMatrixUniforms(perspectiveMatrix, program);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  window.start = function() {
    var canvas = document.getElementById("glcanvas");

    // Initialize the GL context
    var gl = initWebGL(canvas);
    
    // Only continue if WebGL is available and working
    if (!gl) {
      return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);

    var squareVerticesBuffer = initBuffers(gl)
    var colorBuffer = initColorBuffer(gl);
    var shaderProgram = initShaders(gl);
    var vertexPositionAttribute = initVertexPositionAttribute(
      gl, shaderProgram
    );
    var vertexColorAttribute = initVertexColorAttribute(
      gl, shaderProgram
    );
    drawScene(
      gl, shaderProgram, squareVerticesBuffer, colorBuffer, vertexPositionAttribute, vertexColorAttribute
    );
  };


})()
