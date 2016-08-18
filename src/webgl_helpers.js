(function() {
  'use strict';
  window.WebGLHelpers = {};

  WebGLHelpers.initWebGL = function(canvas) {
    var gl = canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    
    if (!gl) {
      alert("Unable to initialize WebGL. Your browser may not support it.");
      throw "No WebGL, giving up";
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

    return gl;
  };


  WebGLHelpers.getShader = function(gl, id) {
    var shaderScript, theSource, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
      alert("Failed to load shader");
      throw "Failed to load shader";
    }

    theSource = shaderScript.text;

    var type = null;
    if (shaderScript.type == "x-shader/x-fragment") {
      type = gl.FRAGMENT_SHADER;
    } else if (shaderScript.type == "x-shader/x-vertex") {
      type = gl.VERTEX_SHADER;
    } else {
      throw "Can't determine shader type";
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

  WebGLHelpers.initShaders = function (gl, fragmentSelector, vertexSelector) {
    var fragmentShader = WebGLHelpers.getShader(gl, fragmentSelector);
    var vertexShader = WebGLHelpers.getShader(gl, vertexSelector);

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

  WebGLHelpers.identity = function () {
    return Matrix.I(4);
  };

  WebGLHelpers.calculateMvMatrix = function (identity, cameraPosition) {
    return identity.x(
      Matrix.Translation($V([
        cameraPosition[0], cameraPosition[1], cameraPosition[2]
      ])).ensure4x4()
    );
  };

  WebGLHelpers.setMatrixUniforms = function (gl, perspectiveMatrix, mvMatrix, shaderProgram) {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(
      pUniform, false, new Float32Array(
        perspectiveMatrix.flatten()
      )
    );

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(
      mvUniform, false, new Float32Array(
        mvMatrix.flatten()
      )
    );
  };

  WebGLHelpers.inFrustum = function (mvpMatrix, vertex) {
    var vClip = mvpMatrix.multiply(
      $V([vertex[0], vertex[1], 0, 1])
    ).elements;
    return Math.abs(vClip[0]) <= vClip[3] &&
           Math.abs(vClip[1]) <= vClip[3];
  };


  WebGLHelpers.triangleInFrustum = function (mvpMatrix, triangle) {
    var min = [null,null],
        max = [null,null];

    Vertex.each(triangle, function(vertex) {
      var vClip = mvpMatrix.multiply(
        $V([vertex[0], vertex[1], 0, 1])
      ).elements;

      // find minimum for x, y
      for(var i=0; i < 2; i++) {
        if (min[i] === null || vClip[i] < min[i]) {
          min[i] = vClip[i];
        }
        if (max[i] === null || vClip[i] > max[i]) {
          max[i] = vClip[i];
        }
      }
    });

    var zoomExtent = mvpMatrix.elements[3][3];
    // Check if any dimension is totally outside frustum
    for(var i=0; i < 2; i++) {
      if (min[i] >  zoomExtent ||
          max[i] < -zoomExtent) {
        return false;
      }
    }
    return true;
  };
})();
