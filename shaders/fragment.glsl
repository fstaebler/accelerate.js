precision highp float;

uniform sampler2D inTex;

varying vec2 vUv;

uniform float w;
uniform float h;

bool ia(vec3 c) {
	return (c.g > 0.3);
}

const float tau = 6.2831853;

void main() {

	vec3 ns[8];
	float xsize = .8 / w;
	float ysize = .8 / h;
	float j = 0.;
	ns[0] = texture2D(inTex, vUv + vec2(-xsize, -ysize)).rgb;
	ns[1] = texture2D(inTex, vUv + vec2(0.0, -ysize)).rgb;
	ns[2] = texture2D(inTex, vUv + vec2(xsize, -ysize)).rgb;
	ns[3] = texture2D(inTex, vUv + vec2(-xsize, 0.0)).rgb;
	ns[4] = texture2D(inTex, vUv + vec2(xsize, 0.0)).rgb;
	ns[5] = texture2D(inTex, vUv + vec2(-xsize, ysize)).rgb;
	ns[6] = texture2D(inTex, vUv + vec2(0.0, ysize)).rgb;
	ns[7] = texture2D(inTex, vUv + vec2(xsize, ysize)).rgb;
	vec3 me = texture2D(inTex, vUv).rgb;
	float trs = 0.0;
	float trc = 0.0;
	if(ia(ns[0])){
		j += 1.0;
		trs += sin(ns[0].r * tau);
		trc += cos(ns[0].r * tau);
	}
	if(ia(ns[1])){
		j += 1.0;
		trs += sin(ns[1].r * tau);
		trc += cos(ns[1].r * tau);
	}	if(ia(ns[2])){
		j += 1.0;
		trs += sin(ns[2].r * tau);
		trc += cos(ns[2].r * tau);
	}	if(ia(ns[3])){
		j += 1.0;
		trs += sin(ns[3].r * tau);
		trc += cos(ns[3].r * tau);
	}	if(ia(ns[4])){
		j += 1.0;
		trs += sin(ns[4].r * tau);
		trc += cos(ns[4].r * tau);
	}	if(ia(ns[5])){
		j += 1.0;
		trs += sin(ns[5].r * tau);
		trc += cos(ns[5].r * tau);
	}	if(ia(ns[6])){
		j += 1.0;
		trs += sin(ns[6].r * tau);
		trc += cos(ns[6].r * tau);
	}	if(ia(ns[7])){
		j += 1.0;
		trs += sin(ns[7].r * tau);
		trc += cos(ns[7].r * tau);
	}
	bool ima = ia(me);
	if (
		((j == 2. || j == 6.) && ima) || 
		(!ima && (j == 2. || j == 3.))){
		if(ima){
			j += 1.0;
			trs += sin(me.r * tau);
			trc += cos(me.r * tau);
			}
		float avgRs = trs / j;
		float avgRc = trc / j;
		gl_FragColor = vec4(mod(atan(avgRs, avgRc) / tau, 1.0), 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	}
}
