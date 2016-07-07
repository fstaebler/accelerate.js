precision highp float;

uniform sampler2D inTex;

varying vec2 vUv;

uniform float w;
uniform float h;

bool isAlive(vec3 c) {
	return (c.g > 0.4);
}

const float tau =6.283185307179586;

void main() {

	vec3 neighbours[8];
	float xsize = .8 / w;
	float ysize = .8 / h;
	float j = 0.;
	neighbours[0] = texture2D(inTex, vUv + vec2(-xsize, -ysize)).rgb;
	neighbours[1] = texture2D(inTex, vUv + vec2(0.0, -ysize)).rgb;
	neighbours[2] = texture2D(inTex, vUv + vec2(xsize, -ysize)).rgb;
	neighbours[3] = texture2D(inTex, vUv + vec2(-xsize, 0.0)).rgb;
	neighbours[4] = texture2D(inTex, vUv + vec2(xsize, 0.0)).rgb;
	neighbours[5] = texture2D(inTex, vUv + vec2(-xsize, ysize)).rgb;
	neighbours[6] = texture2D(inTex, vUv + vec2(0.0, ysize)).rgb;
	neighbours[7] = texture2D(inTex, vUv + vec2(xsize, ysize)).rgb;
	vec3 me = texture2D(inTex, vUv).rgb;
	float totalRs = 0.0;
	float totalRc = 0.0;
	if(isAlive(neighbours[0])){
		j += 1.0;
		totalRs += sin(neighbours[0].r * tau);
		totalRc += cos(neighbours[0].r * tau);
	}
	if(isAlive(neighbours[1])){
		j += 1.0;
		totalRs += sin(neighbours[1].r * tau);
		totalRc += cos(neighbours[1].r * tau);
	}	if(isAlive(neighbours[2])){
		j += 1.0;
		totalRs += sin(neighbours[2].r * tau);
		totalRc += cos(neighbours[2].r * tau);
	}	if(isAlive(neighbours[3])){
		j += 1.0;
		totalRs += sin(neighbours[3].r * tau);
		totalRc += cos(neighbours[3].r * tau);
	}	if(isAlive(neighbours[4])){
		j += 1.0;
		totalRs += sin(neighbours[4].r * tau);
		totalRc += cos(neighbours[4].r * tau);
	}	if(isAlive(neighbours[5])){
		j += 1.0;
		totalRs += sin(neighbours[5].r * tau);
		totalRc += cos(neighbours[5].r * tau);
	}	if(isAlive(neighbours[6])){
		j += 1.0;
		totalRs += sin(neighbours[6].r * tau);
		totalRc += cos(neighbours[6].r * tau);
	}	if(isAlive(neighbours[7])){
		j += 1.0;
		totalRs += sin(neighbours[7].r * tau);
		totalRc += cos(neighbours[7].r * tau);
	}
	bool IMAlive = isAlive(me);
	//gl_FragColor = vec4(aliveNeighbours * .125);
	if (
		(j >= 2. && j <= 3. && IMAlive) || 
		(!IMAlive && j == 3.)){
	//if (isAlive(vUv)){
		if(IMAlive){
			j += 1.0;
			totalRs += sin(me.r * tau);
			totalRc += cos(me.r * tau);
			}
		float avgRs = totalRs / j;
		float avgRc = totalRc / j;
		gl_FragColor = vec4(mod(atan(avgRs, avgRc) / tau, 1.0), 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}