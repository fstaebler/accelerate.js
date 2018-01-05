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
  vec3 res = texture2D(inTex, vUv).rgb;
  res *= 12.0;
  res += texture2D(inTex, vUv + vec2(0.004, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(-0.004, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(0.008, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(-0.008, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(0.012, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(-0.012, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(0.002, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(-0.002, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(0.006, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(-0.006, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(0.010, 0.0)).rgb;
  res += texture2D(inTex, vUv + vec2(-0.010, 0.0)).rgb;
  res /= 24.0;
  gl_FragColor = vec4(res, 1.0);
}
