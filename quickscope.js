pps = irfs = 0;

ppw = pph = 512;

filterA = .96;

zoomtarget = 12;
zoom = 10;
deltaxtarget = deltax = 0.25;
deltaytarget = deltay = 0.5;

mixf = 0.2;

drawScene = () => {
	zoom = mixf * zoomtarget + (1 - mixf) * zoom;
	deltax = mixf * deltaxtarget + (1 - mixf) * deltax;
	deltay = mixf * deltaytarget + (1 - mixf) * deltay;
	aspect = window.innerWidth / window.innerHeight;
	//setTimeout(drawScene, 0);
	requestAnimationFrame(drawScene);

	g.bindFramebuffer(g.FRAMEBUFFER, ppfb);
	g.useProgram(p);
	g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, (pps ? pp1 : pp2), 0);
	g.activeTexture(g.TEXTURE0);
	g.bindTexture(g.TEXTURE_2D, pps ? pp2 : pp1);
	g.uniform1i(p.inTex, 0);
	g.uniform1f(p.h, pph);
	g.uniform1f(p.w, ppw);
	//g.bindTexture(g.TEXTURE_2D, null);postfxtex

	g.bindBuffer(g.ARRAY_BUFFER, dummyBuffer);
	g.viewport(0, 0, ppw, pph);
	g.vertexAttribPointer(p.vertexPositionAttribute, 3, g.FLOAT, 0, 0, 0);
	g.drawArrays(g.TRIANGLE_STRIP, 0, 4); //RENDER THE PINGPONG
	/*Done Ping-Pong'ing*/
	
	
	g.useProgram(t);
	g.bindFramebuffer(g.FRAMEBUFFER, postfxfb);
	g.activeTexture(g.TEXTURE0);
	g.bindTexture(g.TEXTURE_2D, pps ? pp2 : pp1);
	g.uniform1i(t.inTex, 0);
	g.activeTexture(g.TEXTURE1);
	g.bindTexture(g.TEXTURE_2D, colormaptex);
	g.uniform1i(t.colormap, 1);
	g.uniform1f(t.rampY, (Date.now() / (30000 * colormaps.length) ) % 1);
	g.uniformMatrix3fv(t.projection, 0, [aspect / zoom, 0, deltax * aspect, 0, 1 / zoom, deltay, 0, 0, 1]);
	//g.bindTexture(g.TEXTURE_2D, null);

	g.bindBuffer(g.ARRAY_BUFFER, dummyBuffer);
	g.viewport(0, 0, ppw, pph);
	g.vertexAttribPointer(p.vertexPositionAttribute, 3, g.FLOAT, 0, 0, 0);
	g.drawArrays(g.TRIANGLE_STRIP, 0, 4); //RENDER THE RESULT
	
	//render ir filter
	
	g.useProgram(f);
	g.bindFramebuffer(g.FRAMEBUFFER, irffb);
	g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, (irfs ? irf1 : irf2), 0);
	g.activeTexture(g.TEXTURE0);
	g.bindTexture(g.TEXTURE_2D, irfs ? irf2 : irf1);
	g.uniform1i(f.inTexLast, 0);
	g.activeTexture(g.TEXTURE1);
	g.bindTexture(g.TEXTURE_2D, postfxtex);
	g.uniform1i(f.inTexCurrent, 1);
	g.uniform1f(f.a, filterA);
  g.uniform1f(f.ar, aspect);
	
  g.bindBuffer(g.ARRAY_BUFFER, dummyBuffer);
	g.viewport(0, 0, ppw, pph);
	g.vertexAttribPointer(p.vertexPositionAttribute, 3, g.FLOAT, 0, 0, 0);
	g.drawArrays(g.TRIANGLE_STRIP, 0, 4); //RENDER THE RESULT

  //render to screen

	g.useProgram(postproc);
	g.bindFramebuffer(g.FRAMEBUFFER, null);
	g.activeTexture(g.TEXTURE0);
	g.bindTexture(g.TEXTURE_2D, irfs ? irf1 : irf2);
	g.uniform1i(postproc.inTex, 0);
	//g.bindTexture(g.TEXTURE_2D, null);

	g.bindBuffer(g.ARRAY_BUFFER, dummyBuffer);
	g.viewport(0, 0, window.innerWidth, window.innerHeight);
	g.vertexAttribPointer(p.vertexPositionAttribute, 3, g.FLOAT, 0, 0, 0);
	g.drawArrays(g.TRIANGLE_STRIP, 0, 4); //RENDER TO SCREEN

	pps = !pps; //RENDER THE
	irfs = !irfs;
};

j = () => {
	_c = document.getElementsByTagName("canvas")[0];
	_c.height = window.innerHeight;
	_c.width = window.innerWidth;
	g = _c.getContext("webgl");
	
  var fragmentShader = g.createShader(g.FRAGMENT_SHADER);
	g.shaderSource(fragmentShader, SyncHttpGet("shaders/fragment.glsl"));
	g.compileShader(fragmentShader);
	var fragmentShader2 = g.createShader(g.FRAGMENT_SHADER);
	g.shaderSource(fragmentShader2, SyncHttpGet("shaders/display.glsl"));
	g.compileShader(fragmentShader2);
	var fragmentShader3 = g.createShader(g.FRAGMENT_SHADER);
	g.shaderSource(fragmentShader3, SyncHttpGet("shaders/postfx.glsl"));
	g.compileShader(fragmentShader3);
	var irfshader = g.createShader(g.FRAGMENT_SHADER);
	g.shaderSource(irfshader, SyncHttpGet("shaders/irf.glsl"));
	g.compileShader(irfshader);
	var vertexShader = g.createShader(g.VERTEX_SHADER);
	g.shaderSource(vertexShader, SyncHttpGet("shaders/vertex.glsl"));
	g.compileShader(vertexShader);
	
	p = g.createProgram();
	t = g.createProgram();
	postproc = g.createProgram();
	f = g.createProgram();
	g.attachShader(f, vertexShader);
	g.attachShader(f, irfshader);
	g.attachShader(p, vertexShader);
	g.attachShader(t, vertexShader);
	g.attachShader(postproc, vertexShader);
	g.attachShader(p, fragmentShader);
	g.attachShader(t, fragmentShader2);
	g.attachShader(postproc, fragmentShader3);
	g.linkProgram(p);
	g.linkProgram(t);
	g.linkProgram(postproc);
  g.linkProgram(f);

	f.inTexLast = g.getUniformLocation(f, "inTexLast");
	f.inTexCurrent = g.getUniformLocation(f, "inTexCurrent");
  f.a = g.getUniformLocation(f, "a");
  f.ar = g.getUniformLocation(f, "ar");
	p.vertexPositionAttribute = g.getAttribLocation(p, "pos");
	g.enableVertexAttribArray(p.vertexPositionAttribute);
	p.inTex = g.getUniformLocation(p, "inTex");
	p.h = g.getUniformLocation(p, "h");
	p.w = g.getUniformLocation(p, "w");
	t.inTex = g.getUniformLocation(t, "inTex");
	t.projection = g.getUniformLocation(t, "projection");
	t.colormap = g.getUniformLocation(t, "colorRamp");
	t.rampY = g.getUniformLocation(t, "rampY");
	postproc.inTex = g.getUniformLocation(postproc, "inTex");
	
	dummyBuffer = g.createBuffer();
	g.bindBuffer(g.ARRAY_BUFFER, dummyBuffer);
	g.bufferData(g.ARRAY_BUFFER, new Float32Array([
             1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
             1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ]), g.STATIC_DRAW);


	tb = new Uint8Array(ppw * pph * 4);
	
	fill = () => {
	  bs = 512;
	  for(var y = (pph - bs) / 2; (pph - bs) / 2 + bs  > y; y += 1){
	    for (var x = (ppw - bs) / 2; (ppw - bs) / 2 + bs > x; x += 1) {
	      var i = (y * ppw + x) * 4;
		    tb[i] = Math.random() * 255;
		    tb[i + 1] = Math.random() * 255;
		    tb[i + 2] = Math.random() * 0;
		    tb[i + 3] = 255;
	    }
	  }
	};
	fill();
	
	colormaps = [
	(x) => {
	  x /= 256 / 6;
	  var n = x % 1;
	  var m = 1 - n;
	  n *= 255;
	  m *= 255;
	  if(1 > x)return [255, n, 0];
	  if(2 > x)return [m, 255, 0];
	  if(3 > x)return [0, 255, n];
	  if(4 > x)return [0, m, 255];
	  if(5 > x)return [n, 0, 255];
	  return [255, 0, m];
	}, (x) => {
	  if(8 > x % 16)return[0, 0, 0];
	  return [255, 255, 255];
	}, (x) => {
	  x /= 40.743665;
    var n = Math.sin(x) * 64;
    var m = Math.cos(x) * 64;
	  return [128 + n, 128 + m, 128];
	}, (x) => {
	  x /= 128 / 6;
	  var n = x % 1;
	  var m = 1 - n;
	  n *= 255;
	  m *= 255;
	  x %= 6;
	  if(1 > x)return [255, n, 0];
	  if(2 > x)return [m, 255, 0];
	  if(3 > x)return [0, 255, n];
	  if(4 > x)return [0, m, 255];
	  if(5 > x)return [n, 0, 255];
	  return [255, 0, m];
	}
	];
	
	colormapbuf = new Uint8Array(256 * colormaps.length * 4);
	for(var i = 0; colormaps.length > i; i++){
	  for(var x = 0; 256 > x; x++){
	    _p = (i * 256 + x) * 4;
	    _c = colormaps[i](x);
	    colormapbuf[_p] = _c[0];
	    colormapbuf[_p + 1] = _c[1];
	    colormapbuf[_p + 2] = _c[2];
	    colormapbuf[_p + 3] = 255;
	  }
	}
		

  colormaptex = g.createTexture();
	g.bindTexture(g.TEXTURE_2D, colormaptex);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);
	g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 256, colormaps.length, 0, g.RGBA, g.UNSIGNED_BYTE, colormapbuf);

	postfxtex = g.createTexture();
	g.bindTexture(g.TEXTURE_2D, postfxtex);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);
	g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, ppw, pph, 0, g.RGBA, g.UNSIGNED_BYTE, null);
	//g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, pph, ppw, g.RGBA, g.UNSIGNED_BYTE, tb);

	postfxrb = g.createRenderbuffer();
	g.bindRenderbuffer(g.RENDERBUFFER, postfxrb);
	g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, ppw, pph);

	postfxfb = g.createFramebuffer();
	g.bindFramebuffer(g.FRAMEBUFFER, postfxfb);
	g.bindTexture(g.TEXTURE_2D, postfxtex);
	g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, postfxtex, 0);
	g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, postfxrb);

	pp1 = g.createTexture();
	g.bindTexture(g.TEXTURE_2D, pp1);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);
	g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, ppw, pph, 0, g.RGBA, g.UNSIGNED_BYTE, null);
	g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, pph, ppw, g.RGBA, g.UNSIGNED_BYTE, tb);

	pp2 = g.createTexture();
	g.bindTexture(g.TEXTURE_2D, pp2);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);
	g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, ppw, pph, 0, g.RGBA, g.UNSIGNED_BYTE, null);
	g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, pph, ppw, g.RGBA, g.UNSIGNED_BYTE, tb);
	
	irf1 = g.createTexture();
	g.bindTexture(g.TEXTURE_2D, irf1);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
	g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, ppw, pph, 0, g.RGBA, g.UNSIGNED_BYTE, null);
	
	irf2 = g.createTexture();
	g.bindTexture(g.TEXTURE_2D, irf2);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
	g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
	g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, ppw, pph, 0, g.RGBA, g.UNSIGNED_BYTE, null);
	
	ppdb = g.createRenderbuffer();
	g.bindRenderbuffer(g.RENDERBUFFER, ppdb);
	g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, ppw, pph);

  irffb = g.createFramebuffer();
	g.bindFramebuffer(g.FRAMEBUFFER, irffb);
	g.bindTexture(g.TEXTURE_2D, irfs ? irf1 : irf2);
	g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, (irfs ? irf1 : irf2), 0);
	g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, ppdb);
	g.bindTexture(g.TEXTURE_2D, null);

	ppfb = g.createFramebuffer();
	g.bindFramebuffer(g.FRAMEBUFFER, ppfb);
	g.bindTexture(g.TEXTURE_2D, pps ? pp1 : pp2);
	g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, (pps ? pp1 : pp2), 0);
	g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, ppdb);
	g.bindTexture(g.TEXTURE_2D, null);

	g.clearColor(.5, 0.0, 0.0, 1.0);
	//setInterval(restart, 60000);
	drawScene();
};

onresize = () => {
	var _canvas = document.getElementsByTagName("canvas")[0];
	_canvas.height = innerHeight;
	_canvas.width = innerWidth;
	//drawScene();
	//drawScene();
};
onkeypress = (e) => {if(e.key == "r")restart();};
onwheel = function (e) {
	zoomtarget += (e.deltaY * .01 * zoomtarget);
	zoomtarget = Math.min(Math.max(0.8, zoomtarget), 50);
};
lastx = lasty = 0;
onmousemove = (e) => {
	if (e.buttons & 1) {
		deltaxtarget += (lastx - e.clientX) / innerWidth / zoom;
		deltaytarget -= (lasty - e.clientY) / innerHeight / zoom;
	}
	lastx = e.clientX;
	lasty = e.clientY;
};
restart = () => {
  fill();
	g.bindTexture(g.TEXTURE_2D, pp1);
	g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, pph, ppw, g.RGBA, g.UNSIGNED_BYTE, tb);
	g.bindTexture(g.TEXTURE_2D, pp2);
	g.texSubImage2D(g.TEXTURE_2D, 0, 0, 0, pph, ppw, g.RGBA, g.UNSIGNED_BYTE, tb);
	console.log("Reset.");
};
