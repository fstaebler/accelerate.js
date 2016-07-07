precision highp float;

uniform sampler2D inTex;

varying vec2 vUv;

vec2 distort(vec2 v, float o){
	v = (v * 2.0) - 1.0;
	
	v = v * o * .975;
	
	return (v * .5) + 0.5;
}

vec3 weighted_av(vec4 c, vec3 w){
	return c.rgb * w;
}

void main() {
  vec3 res = vec3(0.0);
  res += weighted_av(texture2D(inTex, distort(vUv, 1.02)), vec3(0.9, 0.0, 0.2));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.018)), vec3(.9, 0.2, 0.0));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.016)), vec3(.7, 0.3, 0.0));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.014)), vec3(.5, 0.5, 0.0));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.012)), vec3(.4, 0.6, 0.2));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.010)), vec3(.6, 0.8, 0.6));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.008)), vec3(0.2, 0.6, 0.4));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.006)), vec3(0.0, 0.5, 0.5));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.004)), vec3(0.0, 0.3, 0.7));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.002)), vec3(0.0, 0.2, 0.9));
  res += weighted_av(texture2D(inTex, distort(vUv, 1.)), vec3(0.2, 0.0, .90));
  
	res /= 4.0;
  gl_FragColor = vec4(res, 1.0);
}