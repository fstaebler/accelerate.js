var SyncHttpGet = function (path) {
  var r = new XMLHttpRequest();
  r.open("GET", path + "?t=" + Date.now(), !!0); //prevent caching.
  r.send();
  var b = r.responseText;
  return b;
};

var gl;
var squareSize;

var camera = {};
var updateCamera = function (position, target) {
  camera.position = [0.0, 2.5, -20.0];
  camera.up = [0.0, window.innerHeight / squareSize, 0.0];
  camera.right = [window.innerWidth / squareSize, 0.0, 0.0];
  camera.forward = [0.0, 0.0, 1.0];
};

var createContext = function () {
  var _canvas = document.getElementsByTagName("canvas")[0];
  _canvas.height = window.innerHeight;
  _canvas.width = window.innerWidth;
  squareSize = Math.sqrt(_canvas.width * _canvas.height);
  updateCamera();
  if (!(gl = _canvas.getContext("experimental-webgl") || _canvas.getContext("webgl"))) {
    console.error("failed.");
  }
};

var compileShader = function (source, fragment) {
  if (!source) {
    return null;
  }
  var shader;
  if (fragment) {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    console.error("failed.");
    return null;
  }
  return shader;
}


var testProgram;
var compileShaderPrograms = function () {
  var fragmentShader = compileShader(SyncHttpGet("/shaders/fragment.glsl"), !!1);
  var vertexShader = compileShader(SyncHttpGet("/shaders/vertex.glsl"), !!0);

  testProgram = gl.createProgram();
  gl.attachShader(testProgram, vertexShader);
  gl.attachShader(testProgram, fragmentShader);
  gl.linkProgram(testProgram);

  if (!gl.getProgramParameter(testProgram, gl.LINK_STATUS)) {
    console.error("failed.");
  }

  gl.useProgram(testProgram);
  testProgram.vertexPositionAttribute = gl.getAttribLocation(testProgram, "pos");
  gl.enableVertexAttribArray(testProgram.vertexPositionAttribute);
  camera.upAdress = gl.getUniformLocation(testProgram, "cameraUp");
  camera.rightAdress = gl.getUniformLocation(testProgram, "cameraRight");
  camera.forwardAdress = gl.getUniformLocation(testProgram, "cameraForward");
  camera.positionAdress = gl.getUniformLocation(testProgram, "cameraPosition");
};

var VertexPositionBuffer;

function initBuffers() {
  VertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
  vertices = [
             1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  VertexPositionBuffer.itemSize = 3;
  VertexPositionBuffer.numItems = 4;
}


function drawScene() {
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform3fv(camera.forwardAdress, camera.forward);
  gl.uniform3fv(camera.rightAdress, camera.right);
  gl.uniform3fv(camera.upAdress, camera.up);
  gl.uniform3fv(camera.positionAdress, camera.position);

  gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
  gl.vertexAttribPointer(testProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function webGLStart() {
  createContext();
  compileShaderPrograms();
  initBuffers();

  gl.clearColor(.5, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
}

var initialize = function () {
  webGLStart();
};
var resize = function () {
  var _canvas = document.getElementsByTagName("canvas")[0];
  _canvas.height = window.innerHeight;
  _canvas.width = window.innerWidth;
  squareSize = Math.sqrt(_canvas.width * _canvas.height);
  updateCamera();
  drawScene();
};
