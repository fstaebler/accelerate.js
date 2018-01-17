precision highp float;

uniform sampler2D inTexCurrent;
uniform sampler2D inTexLast;
uniform float a;
uniform float ar;

varying vec2 vUv;

void main() {
  float val = 0.0008;
  vec3 res = texture2D(inTexCurrent, vUv).rgb;
  vec3 old = texture2D(inTexLast, vUv + vec2(val, 0.0)).rgb;
  old += texture2D(inTexLast, vUv - vec2(val, 0.0)).rgb;
  old += texture2D(inTexLast, vUv + vec2(0.0, val * ar)).rgb;
  old += texture2D(inTexLast, vUv - vec2(0.0, val * ar)).rgb;
  old /= 3.9;
  old = 1.01 * old -.01;
  gl_FragColor = vec4(max(res, old * a), 1.0);
}
