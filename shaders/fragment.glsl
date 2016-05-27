precision highp float;

uniform vec3 cameraPosition;
uniform vec3 cameraUp;
uniform vec3 cameraRight;
uniform vec3 cameraForward;

varying vec2 vUv;

const int iterations = 256;

const int ambientSamples = 256;

const float epsilon = 0.0001;

vec3 sunDirection = normalize(vec3(-3., 1.0, -2.));

const vec3 sphereCenter = vec3(0.0, 0.0, 0.0);
const float sphereRadius = 2.0;

const float floorHeight = -2.0;

float sphereDE(vec3 p){
    p.xy = mod(p.xy, 4.0) - 2.0;
    return distance(p, sphereCenter) - sphereRadius;
}

float floorDE(vec3 p){
  return p.y - floorHeight;
}

float DE(vec3 p){
  return min(floorDE(p), sphereDE(p));
}


void main() {
  const vec3 xAxis = vec3(epsilon, 0.0, 0.0);
  const vec3 yAxis = vec3(0.0, epsilon, 0.0);
  const vec3 zAxis = vec3(0.0, 0.0, epsilon);
  vec3 directRayDirection = normalize(
    cameraForward
    + (cameraRight*vUv.x)
    + (cameraUp*vUv.y)
    );
  vec3 currentPosition = cameraPosition;
  vec3 color = vec3(0.0, 0.0, 0.0);
  vec3 normal = vec3(0.0, 0.0, 0.0);
  
  //This casts rays, calculates normals and
  bool hit = false;
  float currentDistance = DE(currentPosition);
  for(int i = 0; i < iterations; ++i){
    vec3 nextPosition = currentPosition + directRayDirection * currentDistance;
    currentDistance = DE(nextPosition);
    if (currentDistance < epsilon) {
      normal = normalize(vec3(
        DE(currentPosition + xAxis) - DE(currentPosition - xAxis),
        DE(currentPosition + yAxis) - DE(currentPosition - yAxis),
        DE(currentPosition + zAxis) - DE(currentPosition - zAxis)
        ));
      color = vec3(0.2, 0.6, 1.0) * dot(normal, sunDirection);
      hit = true;
      break;
    }
    currentPosition = nextPosition;
  }
  vec3 castPosition = currentPosition;
  if(hit == true){
    //calculate sun shadow
    currentDistance = DE(currentPosition);
    for(int i = 0; i < iterations; i++){
      vec3 nextPosition = currentPosition + sunDirection * currentDistance;
      currentDistance = DE(nextPosition);
      if(currentDistance < epsilon) {
        color = vec3(0.0);
        break;
      }
      currentPosition = nextPosition;
    }
    vec3 ambientColor = vec3(0.5);
    currentPosition = castPosition;
    currentDistance = DE(currentPosition);
    //for (int j = 0; j < ambientSamples; j++){
      for (int i = 0; i < ambientSamples; i++){
        vec3 nextPosition = currentPosition + normal * currentDistance;
        currentDistance = DE(nextPosition);
        if (currentDistance < epsilon) {
          ambientColor = ambientColor * min(.01 * distance(currentPosition, castPosition), 1.0);
          break;
        }
        currentPosition = nextPosition;
      }
      color = ambientColor;

    //}
  }

  gl_FragColor = vec4(color, 1.0);
}