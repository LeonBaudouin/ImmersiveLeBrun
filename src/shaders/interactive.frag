uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 mouse;
uniform vec2 ratio;
uniform float prog;
uniform float time;
varying vec2 vUv;

#define PI 3.14159265358979323846

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
    vec2 st = vUv * ratio;
    vec2 m = mouse *  ratio;
    
    float dist = pow(distance(m, st) * 4. + distance(m, st) * (1. - prog) * 3., .5 + prog * 1.);
    float newNoise = pNoise(st * 5., 5);
    newNoise = newNoise * 10. + newNoise * (1. - prog) * 10.;
    float ring = smoothstep(.3, .8, dist) - smoothstep(.5, 1., dist * .2);
    float a = pow(prog, .5) - pow(prog, .5) * clamp(newNoise * ring * prog * .1 + dist * .9, 0., 1.);
    
    vec4 color = mix(texture2D(texture1, vUv), texture2D(texture2, vUv), a);
    
    if (color.a != 1.0) discard;
    gl_FragColor = color;

}
