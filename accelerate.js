var A = new function () {


  var _screenVertexBuffer;


  this.initialize = function () {
    var _canvas = document.getElementsByTagName("canvas")[0];
    if (!(
        _gl = _canvas.getContext("webgl") || _canvas.getContext("experimental-webgl")
      )) {
      console.error(
        "can't webgl"
      );
      return;
    }
    //_gl.viewportWidth = 256;
    //_gl.viewportHeight = 256;

    /* Initialize the drawing surface
     *
     * ...
     */
    _screenVertexBuffer = _gl.createBuffer();
    _gl.bindBuffer(
      _gl.ARRAY_BUFFER,
      _screenVertexBuffer
    );
    _gl.bufferData(
      _gl.ARRAY_BUFFER,
      /* The Corners of the drawing surface
       */
      new Float32Array( //reminder: this might be the wrong order, although: why shouldn't it be clockwise?
      [-1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
       -1.0, -1.0, 0.0]
      ),
      _gl.STATIC_DRAW
    );
    //_screenVertexBuffer.itemSize = 3;
    //_screenVertexBuffer.numItems = 4;

    _gl.clearColor = (
      0.1, 0.2, 0.5, 1.0
    );
    _gl.enable(_gl.DEPTH_TEST); //reminder: this might be optional and/or useless in our use case.

  };

  this.render = function () {};
};
