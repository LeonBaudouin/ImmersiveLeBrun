uniform float mixRatio;
uniform vec2 ratio;

uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;

varying vec2 vUv;

#define PI 3.14159265359

float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = 1./freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}


void main() {

    vec2 m = vec2(0.5,0.5) * ratio * 2.;
    vec2 st = vUv * ratio * 2.;

    float dist = (pow(distance(m, st) + (1. - mixRatio), 1.5) + 0.1) * (1. - mixRatio);
    float noise = pNoise(st * 5., 5);
    noise = noise * 10. + noise * (1. - 1.) * 10.;
    float ring = smoothstep(.3, .8, dist);
    float a = pow(1., .5) - pow(1., .5) * clamp(noise * dist * 1. * 1. + dist * 0.9, 0., 1.);

    vec4 texel1 = texture2D( tDiffuse1, vUv );
    vec4 texel2 = texture2D( tDiffuse2, vUv );

    gl_FragColor = mix( texel2, texel1, a );
    
}
