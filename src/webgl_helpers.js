(function() {
  window.WebGLHelpers = {};

  WebGLHelpers.initWebGL = function(canvas) {
    gl = canvas.getContext("webgl") ||
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
})();
