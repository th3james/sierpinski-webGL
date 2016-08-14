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


  WebGLHelpers.getShader = function(gl, id, type) {
    var shaderScript, theSource, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
      alert("Failed to load shader");
      throw "Failed to load shader";
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
})();
