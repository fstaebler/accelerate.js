precision highp float;

uniform sampler2D inTex;

varying vec2 vUv;

uniform mat3 projection;

void main() {
  vec2 tcoord = vUv - vec2(.5);
	vec2 rcoord = (vec3(tcoord, 1.0) * projection).xy;
	vec4 col = texture2D(inTex, rcoord);
	if(length(col.rgb) > .5){
		float h = col.r * 6.0;
		float sem = 1.0 - abs(mod(h, 2.0) - 1.0);
		float g = min(1.0, max(0.0, min(h, 4.0 - h)));
		float r = min(1.0, max(0.0, max(2.0 - h, h - 4.0)));
		float b = min(1.0, max(0.0, min(h -2.0 , 6.0 -h)));
	  gl_FragColor = vec4(r, g, b, 1.0);
	}else{
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
  //gl_FragColor = texture2D(inTex, (tcoord * 1.02) - .01);
  //gl_FragColor = vec4(mod(tcoord, 1.0), 0.0, 1.0);
}