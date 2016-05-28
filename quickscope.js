var SyncHttpGet = function (path) {
	var r = new XMLHttpRequest();
	r.open("GET", path, !!0); //prevent caching.
	r.send();
	var b = r.responseText;
	return b;
};


var gl;

var ppt1;
var ppt2;
var pps = false;
var pph;
var ppw = pph = 1024;
var ppfb;
var ppdb;

var zoom = 4;
var deltax = 0.5;
var deltay = 0.5;

var postfxtex;
var postfxfb;

var createContext = function () {
	var _canvas = document.getElementsByTagName("canvas")[0];
	_canvas.height = window.innerHeight;
	_canvas.width = window.innerWidth;
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


var pingpongProgram;
var postproc;
var compileShaderPrograms = function () {
	var vsss = SyncHttpGet("/shaders/vertex.glsl");
	var fragmentShader = compileShader(SyncHttpGet("/shaders/fragment.glsl"), !!1);
	var fragmentShader2 = compileShader(SyncHttpGet("/shaders/display.glsl"), !!1);
	var fragmentShader3 = compileShader(SyncHttpGet("/shaders/postfx.glsl"), !!1);
	var vertexShader = compileShader(vsss, !!0);
	var vertexShader2 = compileShader(vsss, !!0);
	var vertexShader3 = compileShader(vsss, !!0);

	pingpongProgram = gl.createProgram();
	testProgram2 = gl.createProgram();
	postproc = gl.createProgram();
	gl.attachShader(pingpongProgram, vertexShader);
	gl.attachShader(testProgram2, vertexShader2);
	gl.attachShader(postproc, vertexShader3);
	gl.attachShader(pingpongProgram, fragmentShader);
	gl.attachShader(testProgram2, fragmentShader2);
	gl.attachShader(postproc, fragmentShader3);
	gl.linkProgram(pingpongProgram);
	gl.linkProgram(testProgram2);
	gl.linkProgram(postproc);

	if (!gl.getProgramParameter(pingpongProgram, gl.LINK_STATUS)) {
		console.error("failed.");
	}

	gl.useProgram(pingpongProgram);
	pingpongProgram.vertexPositionAttribute = gl.getAttribLocation(pingpongProgram, "pos");
	gl.enableVertexAttribArray(pingpongProgram.vertexPositionAttribute);
	pingpongProgram.inTex = gl.getUniformLocation(pingpongProgram, "inTex");
	pingpongProgram.h = gl.getUniformLocation(pingpongProgram, "h");
	pingpongProgram.w = gl.getUniformLocation(pingpongProgram, "w");
	testProgram2.inTex = gl.getUniformLocation(testProgram2, "inTex");
	testProgram2.projection = gl.getUniformLocation(testProgram2, "projection");
	postproc.inTex = gl.getUniformLocation(postproc, "inTex");
};

var VertexPositionBuffer;

function initBuffers() {
	dummyBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, dummyBuffer);
	vertices = [
             1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


	tb = new Uint8Array(ppw * pph * 4);
	for (var i = 0; i < tb.length; i += 4) {
		tb[i] = Math.random() * 255;
		tb[i + 1] = Math.random() * 255;
		tb[i + 2] = Math.random() * 0;
		tb[i + 3] = 255;
	}

	postfxtex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, postfxtex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, ppw, pph, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	//gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, pph, ppw, gl.RGBA, gl.UNSIGNED_BYTE, tb);

	var postfxrb = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, postfxrb);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, ppw, pph);

	postfxfb = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, postfxfb);
	gl.bindTexture(gl.TEXTURE_2D, postfxtex);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, postfxtex, 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, postfxrb);


	pp1 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, pp1);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, ppw, pph, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, pph, ppw, gl.RGBA, gl.UNSIGNED_BYTE, tb);

	pp2 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, pp2);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, ppw, pph, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, pph, ppw, gl.RGBA, gl.UNSIGNED_BYTE, tb);

	ppdb = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, ppdb);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, ppw, pph);


	ppfb = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, ppfb);
	gl.bindTexture(gl.TEXTURE_2D, pps ? pp1 : pp2);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, (pps ? pp1 : pp2), 0);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ppdb);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


function drawScene() {
	aspect = window.innerWidth / window.innerHeight;
	//setTimeout(drawScene, 0);
	requestAnimationFrame(drawScene);

	gl.bindFramebuffer(gl.FRAMEBUFFER, ppfb);
	gl.useProgram(pingpongProgram);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, (pps ? pp1 : pp2), 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, pps ? pp2 : pp1);
	gl.uniform1i(pingpongProgram.inTex, 0);
	gl.uniform1f(pingpongProgram.h, pph);
	gl.uniform1f(pingpongProgram.w, ppw);
	//gl.bindTexture(gl.TEXTURE_2D, null);postfxtex

	gl.bindBuffer(gl.ARRAY_BUFFER, dummyBuffer);
	gl.viewport(0, 0, ppw, pph);
	gl.vertexAttribPointer(pingpongProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //RENDER THE PINGPONG
	/*Done Ping-Pong'ing*/
	gl.useProgram(testProgram2);
	gl.bindFramebuffer(gl.FRAMEBUFFER, postfxfb);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, pps ? pp2 : pp1);
	gl.uniform1i(testProgram2.inTex, 0);
	gl.uniformMatrix3fv(testProgram2.projection, gl.FALSE, [aspect / zoom, 0, deltax * aspect, 0, 1 / zoom, deltay, 0, 0, 1]);
	//gl.bindTexture(gl.TEXTURE_2D, null);

	gl.bindBuffer(gl.ARRAY_BUFFER, dummyBuffer);
	gl.viewport(0, 0, ppw, pph);
	gl.vertexAttribPointer(pingpongProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //RENDER THE RESULT

	gl.useProgram(postproc);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, postfxtex);
	gl.uniform1i(postproc.inTex, 0);
	//gl.bindTexture(gl.TEXTURE_2D, null);

	gl.bindBuffer(gl.ARRAY_BUFFER, dummyBuffer);
	gl.viewport(0, 0, window.innerWidth, window.innerHeight);
	gl.vertexAttribPointer(pingpongProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //RENDER TO SCREEN

	pps = !pps; //RENDER THE
}

function webGLStart() {
	createContext();
	compileShaderPrograms();
	initBuffers();

	gl.clearColor(.5, 0.0, 0.0, 1.0);

	drawScene();
}

var initialize = function () {
	webGLStart();
};

var resize = function () {
	var _canvas = document.getElementsByTagName("canvas")[0];
	_canvas.height = window.innerHeight;
	_canvas.width = window.innerWidth;
	//drawScene();
	//drawScene();
};
window.onresize = resize;

window.onwheel = function (e) {
	zoom += (e.deltaY * .01);
	zoom = Math.max(0.8, zoom);
};
var lastx = 0;
var lasty = 0;
window.onmousemove = function (e) {
	if (e.buttons & 1) {
		deltax += (lastx - e.clientX) / window.innerWidth / zoom;
		deltay -= (lasty - e.clientY) / window.innerHeight / zoom;
	}
	lastx = e.clientX;
	lasty = e.clientY;
};
