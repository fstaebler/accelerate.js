eval("pps=irfs=0;ppw=pph=512;filterA=.96;zoomtarget=12;zoom=10;deltaxtarget=deltax=.25;deltaytarget=deltay=.5;mixf=.2;drawScene=()=>{zoom=mixf*zoomtarget+(1-mixf)*zoom;deltax=mixf*deltaxtarget+(1-mixf)*deltax;deltay=mixf*deltaytarget+(1-mixf)*deltay;aspect=window.innerWidth/window.innerHeight;requestAnimationFrame(drawScene);g.O(36160,ppfb);g.useProgram(p);g.`(36160,36064,3553,(pps?pp1:pp2),0);g.activeTexture(33984);g.'(3553,pps?pp2:pp1);g.^1i(p.@,0);g.^1f(p.h,pph);g.^1f(p.w,ppw);g.bindBuffer(34962,dummyBuffer);g.viewport(0,0,ppw,pph);g.vertexAttribPointer(p.J,3,5126,0,0,0);g.drawArrays(5,0,4);g.useProgram(t);g.O(36160,postfxfb);g.activeTexture(33984);g.'(3553,pps?pp2:pp1);g.^1i(t.@,0);g.activeTexture(33985);g.'(3553,colormaptex);g.^1i(t.colormap,1);g.^1f(t.rampY,(Date.now()/(30000*colormaps.length))%1);g.^Matrix3fv(t.projection,0,[aspect/zoom,0,deltax*aspect,0,1/zoom,deltay,0,0,1]);g.bindBuffer(34962,dummyBuffer);g.viewport(0,0,ppw,pph);g.vertexAttribPointer(p.J,3,5126,0,0,0);g.drawArrays(5,0,4);g.useProgram(f);g.O(36160,irffb);g.`(36160,36064,3553,(irfs?irf1:irf2),0);g.activeTexture(33984);g.'(3553,irfs?irf2:irf1);g.^1i(f.@Last,0);g.activeTexture(33985);g.'(3553,postfxtex);g.^1i(f.@Current,1);g.^1f(f.a,filterA);g.^1f(f.ar,aspect);g.bindBuffer(34962,dummyBuffer);g.viewport(0,0,ppw,pph);g.vertexAttribPointer(p.J,3,5126,0,0,0);g.drawArrays(5,0,4);g.useProgram(postproc);g.O(36160,null);g.activeTexture(33984);g.'(3553,irfs?irf1:irf2);g.^1i(postproc.@,0);g.bindBuffer(34962,dummyBuffer);g.viewport(0,0,window.innerWidth,window.innerHeight);g.vertexAttribPointer(p.J,3,5126,0,0,0);g.drawArrays(5,0,4);pps=!pps;irfs=!irfs;};j=()=>{_c=document.getElementsByTagName(\"canvas\")[0];_c.height=window.innerHeight;_c.width=window.innerWidth;g=_c.getContext(\"webgl\");var fragmentShader=g.createShader(35632);g.shaderSource(fragmentShader,\"precision highp Q;^ sampler2D @;varying G \\;^ Q w;^ Q h;bool ia(vec3 c){K(c.g>.3);}const Q tau=6.2831853;void main(){vec3 ns[8];Q xsize=.8/w;Q ysize=.8/h;Q j=0.;ns[0]=$(@,\\+G(-xsize,-ysize)).rgb;ns[1]=$(@,\\+G(0.,-ysize)).rgb;ns[2]=$(@,\\+G(xsize,-ysize)).rgb;ns[3]=$(@,\\+G(-xsize,0.)).rgb;ns[4]=$(@,\\+G(xsize,0.)).rgb;ns[5]=$(@,\\+G(-xsize,ysize)).rgb;ns[6]=$(@,\\+G(0.,ysize)).rgb;ns[7]=$(@,\\+G(xsize,ysize)).rgb;vec3 me=$(@,\\).rgb;Q trs=0.;Q trc=0.;if(ia(ns[0])){j+=1.;trs+=sin(ns[0].r*tau);trc+=cos(ns[0].r*tau);}if(ia(ns[1])){j+=1.;trs+=sin(ns[1].r*tau);trc+=cos(ns[1].r*tau);}if(ia(ns[2])){j+=1.;trs+=sin(ns[2].r*tau);trc+=cos(ns[2].r*tau);}if(ia(ns[3])){j+=1.;trs+=sin(ns[3].r*tau);trc+=cos(ns[3].r*tau);}if(ia(ns[4])){j+=1.;trs+=sin(ns[4].r*tau);trc+=cos(ns[4].r*tau);}if(ia(ns[5])){j+=1.;trs+=sin(ns[5].r*tau);trc+=cos(ns[5].r*tau);}if(ia(ns[6])){j+=1.;trs+=sin(ns[6].r*tau);trc+=cos(ns[6].r*tau);}if(ia(ns[7])){j+=1.;trs+=sin(ns[7].r*tau);trc+=cos(ns[7].r*tau);}bool ima=ia(me);if(((j==2.||j==6.)&&ima)||(!ima&&(j==2.||j==3.))){if(ima){j+=1.;trs+=sin(me.r*tau);trc+=cos(me.r*tau);}Q avgRs=trs/j;Q avgRc=trc/j;gl_FragColor=vec4(mod(atan(avgRs,avgRc)/tau,1.),1.,1.,1.);}else{gl_FragColor=vec4(0.,0.,0.,1.);}}\");g.compileShader(fragmentShader);var fragmentShader2=g.createShader(35632);g.shaderSource(fragmentShader2,\"precision highp Q;^ sampler2D @;^ sampler2D colorRamp;^ Q rampY;varying G \\;^ mat3 projection;void main(){G tcoord=\\-G(.5);G rcoord=(vec3(tcoord,1.)*projection).xy;vec4 col=$(@,rcoord);if(col.g>.5){gl_FragColor=sqrt($(colorRamp,G(col.r,rampY)));}else{gl_FragColor=vec4(0.,0.,0.,1.);}}\");g.compileShader(fragmentShader2);var fragmentShader3=g.createShader(35632);g.shaderSource(fragmentShader3,\"precision highp Q;^ sampler2D @;varying G \\;G distort(G v,Q o){v=(v*2.)-1.;v=v*o*.975;K(v*.5)+.5;}vec3 weighted_av(vec4 c,vec3 w){K c.rgb*w;}void main(){vec3 res=$(@,\\).rgb;res*=12.;res+=$(@,\\+G(.004,0.)).rgb;res+=$(@,\\+G(-.004,0.)).rgb;res+=$(@,\\+G(.008,0.)).rgb;res+=$(@,\\+G(-.008,0.)).rgb;res+=$(@,\\+G(.012,0.)).rgb;res+=$(@,\\+G(-.012,0.)).rgb;res+=$(@,\\+G(.002,0.)).rgb;res+=$(@,\\+G(-.002,0.)).rgb;res+=$(@,\\+G(.006,0.)).rgb;res+=$(@,\\+G(-.006,0.)).rgb;res+=$(@,\\+G(.010,0.)).rgb;res+=$(@,\\+G(-.010,0.)).rgb;res/=24.;gl_FragColor=vec4(res,1.);}\");g.compileShader(fragmentShader3);var irfshader=g.createShader(35632);g.shaderSource(irfshader,\"precision highp Q;^ sampler2D @Current;^ sampler2D @Last;^ Q a;^ Q ar;varying G \\;void main(){Q val=.0008;vec3 res=$(@Current,\\).rgb;vec3 old=$(@Last,\\+G(val,0.)).rgb;old+=$(@Last,\\-G(val,0.)).rgb;old+=$(@Last,\\+G(0.,val*ar)).rgb;old+=$(@Last,\\-G(0.,val*ar)).rgb;old/=3.9;old=1.01*old-.01;gl_FragColor=vec4(max(res,old*a),1.);}\");g.compileShader(irfshader);var vertexShader=g.createShader(35633);g.shaderSource(vertexShader,\"attribute vec3 pos;varying G \\;void main(){\\=(pos.xy+1.)*.5;gl_Position=vec4(pos,1.);}\");g.compileShader(vertexShader);p=g.createProgram();t=g.createProgram();postproc=g.createProgram();f=g.createProgram();g.Z(f,vertexShader);g.Z(f,irfshader);g.Z(p,vertexShader);g.Z(t,vertexShader);g.Z(postproc,vertexShader);g.Z(p,fragmentShader);g.Z(t,fragmentShader2);g.Z(postproc,fragmentShader3);g.linkProgram(p);g.linkProgram(t);g.linkProgram(postproc);g.linkProgram(f);f.@Last=g.<(f,\"@Last\");f.@Current=g.<(f,\"@Current\");f.a=g.<(f,\"a\");f.ar=g.<(f,\"ar\");p.J=g.getAttribLocation(p,\"pos\");g.enableVertexAttribArray(p.J);p.@=g.<(p,\"@\");p.h=g.<(p,\"h\");p.w=g.<(p,\"w\");t.@=g.<(t,\"@\");t.projection=g.<(t,\"projection\");t.colormap=g.<(t,\"colorRamp\");t.rampY=g.<(t,\"rampY\");postproc.@=g.<(postproc,\"@\");dummyBuffer=g.createBuffer();g.bindBuffer(34962,dummyBuffer);g.bufferData(34962,new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0]),35044);tb=new Uint8Array(ppw*pph*4);fill=()=>{bs=512;for(var y=(pph-bs)/2;(pph-bs)/2+bs>y;y+=1){for(var x=(ppw-bs)/2;(ppw-bs)/2+bs>x;x+=1){var i=(y*ppw+x)*4;tb[i]=Math.random()*255;tb[i+1]=Math.random()*255;tb[i+2]=Math.random()*0;tb[i+3]=255;}}};fill();colormaps=[(x)=>{x/=256/6;var n=x%1;var m=1-n;n*=255;m*=255;if(1>x)K[255,n,0];if(2>x)K[m,255,0];if(3>x)K[0,255,n];if(4>x)K[0,m,255];if(5>x)K[n,0,255];K[255,0,m];},(x)=>{if(8>x%16)K[0,0,0];K[255,255,255];},(x)=>{x/=40.743665;var n=Math.sin(x)*64;var m=Math.cos(x)*64;K[128+n,128+m,128];},(x)=>{x/=128/6;var n=x%1;var m=1-n;n*=255;m*=255;x%=6;if(1>x)K[255,n,0];if(2>x)K[m,255,0];if(3>x)K[0,255,n];if(4>x)K[0,m,255];if(5>x)K[n,0,255];K[255,0,m];}];colormapbuf=new Uint8Array(256*colormaps.length*4);for(var i=0;colormaps.length>i;i++){for(var x=0;256>x;x++){_p=(i*256+x)*4;_c=colormaps[i](x);colormapbuf[_p]=_c[0];colormapbuf[_p+1]=_c[1];colormapbuf[_p+2]=_c[2];colormapbuf[_p+3]=255;}}colormaptex=g.createTexture();g.'(3553,colormaptex);g.#(3553,10240,9729);g.#(3553,10241,9729);g.#(3553,10242,10497);g.#(3553,10243,10497);g.texImage2D(3553,0,6408,256,colormaps.length,0,6408,5121,colormapbuf);postfxtex=g.createTexture();g.'(3553,postfxtex);g.#(3553,10240,9729);g.#(3553,10241,9729);g.#(3553,10242,10497);g.#(3553,10243,10497);g.texImage2D(3553,0,6408,ppw,pph,0,6408,5121,null);postfxrb=g.createRenderbuffer();g.bindRenderbuffer(36161,postfxrb);g.renderbufferStorage(36161,33189,ppw,pph);postfxfb=g.createFramebuffer();g.O(36160,postfxfb);g.'(3553,postfxtex);g.`(36160,36064,3553,postfxtex,0);g.framebufferRenderbuffer(36160,36096,36161,postfxrb);pp1=g.createTexture();g.'(3553,pp1);g.#(3553,10240,9728);g.#(3553,10241,9728);g.#(3553,10242,10497);g.#(3553,10243,10497);g.texImage2D(3553,0,6408,ppw,pph,0,6408,5121,null);g.texSubImage2D(3553,0,0,0,pph,ppw,6408,5121,tb);pp2=g.createTexture();g.'(3553,pp2);g.#(3553,10240,9728);g.#(3553,10241,9728);g.#(3553,10242,10497);g.#(3553,10243,10497);g.texImage2D(3553,0,6408,ppw,pph,0,6408,5121,null);g.texSubImage2D(3553,0,0,0,pph,ppw,6408,5121,tb);irf1=g.createTexture();g.'(3553,irf1);g.#(3553,10240,9729);g.#(3553,10241,9729);g.#(3553,10242,33071);g.#(3553,10243,33071);g.texImage2D(3553,0,6408,ppw,pph,0,6408,5121,null);irf2=g.createTexture();g.'(3553,irf2);g.#(3553,10240,9729);g.#(3553,10241,9729);g.#(3553,10242,33071);g.#(3553,10243,33071);g.texImage2D(3553,0,6408,ppw,pph,0,6408,5121,null);ppdb=g.createRenderbuffer();g.bindRenderbuffer(36161,ppdb);g.renderbufferStorage(36161,33189,ppw,pph);irffb=g.createFramebuffer();g.O(36160,irffb);g.'(3553,irfs?irf1:irf2);g.`(36160,36064,3553,(irfs?irf1:irf2),0);g.framebufferRenderbuffer(36160,36096,36161,ppdb);g.'(3553,null);ppfb=g.createFramebuffer();g.O(36160,ppfb);g.'(3553,pps?pp1:pp2);g.`(36160,36064,3553,(pps?pp1:pp2),0);g.framebufferRenderbuffer(36160,36096,36161,ppdb);g.'(3553,null);g.clearColor(.5,0,0,1);drawScene();};onresize=()=>{var _canvas=document.getElementsByTagName(\"canvas\")[0];_canvas.height=innerHeight;_canvas.width=innerWidth;};onkeypress=(e)=>{if(e.key==\"r\")restart();};onwheel=function(e){zoomtarget+=(e.deltaY*.01*zoomtarget);zoomtarget=Math.min(Math.max(.8,zoomtarget),50);};lastx=lasty=0;onmousemove=(e)=>{if(e.buttons&1){deltaxtarget+=(lastx-e.clientX)/innerWidth/zoom;deltaytarget-=(lasty-e.clientY)/innerHeight/zoom;}lastx=e.clientX;lasty=e.clientY;};restart=()=>{fill();g.'(3553,pp1);g.texSubImage2D(3553,0,0,0,pph,ppw,6408,5121,tb);g.'(3553,pp2);g.texSubImage2D(3553,0,0,0,pph,ppw,6408,5121,tb);console.log(\"Reset.\");};".split("").map(x=>[" ","!","\"","texParameteri","texture2D","%","&","bindTexture","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","getUniformLocation","=",">","?","inTex","A","B","C","D","E","F","vec2","H","I","vertexPositionAttribute","return","L","M","N","bindFramebuffer","P","float","R","S","T","U","V","W","X","Y","attachShader","[","vUv","]","uniform","_","framebufferTexture2D","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}"][x.charCodeAt(0)-32]).join(""))
