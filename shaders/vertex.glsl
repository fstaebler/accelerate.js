attribute vec3 pos;

varying vec2 vUv;

void main () {
  vUv = vec2(pos.x, pos.y);
  gl_Position = vec4(
    pos,
    1.0
  );
}