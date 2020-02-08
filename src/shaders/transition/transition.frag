uniform float mixRatio;
uniform vec2 ratio;
uniform float seed;

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

float quadraticThroughAGivenPoint (float x, float a, float b){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  float min_param_b = 0.0;
  float max_param_b = 1.0;
  a = min(max_param_a, max(min_param_a, a));  
  b = min(max_param_b, max(min_param_b, b)); 
  
  float A = (1.-b)/(1.-a) - (b/a);
  float B = (A*(a*a)-b)/a;
  float y = A*(x*x) - B*(x);
  y = min(1.,max(0.,y)); 
  
  return y;
}


float doubleExponentialSigmoid (float x, float a){

  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  a = min(max_param_a, max(min_param_a, a));
  a = 1.0-a; // for sensible results
  
  float y = 0.;
  if (x<=0.5){
    y = (pow(2.0*x, 1.0/a))/2.0;
  } else {
    y = 1.0 - (pow(2.0*(1.0-x), 1.0/a))/2.0;
  }
  return y;
}


void main() {

    vec2 m = vec2(0.5,0.5) * ratio * 2.;
    vec2 st = vUv * ratio * 2.;

	
    float xSeed = step(fract(seed * 100.), .5);
    float xCoord = mix(vUv.x, 1. - vUv.x, xSeed);
    
    float ySeed = step(fract(seed * 10.), .5);
    float yCoord = mix(vUv.y, 1. - vUv.y, ySeed); 

    float distt = distance(.5, quadraticThroughAGivenPoint(xCoord / 1.1 - .05, yCoord / 1.1 + .05, .5 + seed / 2.));
	float dist = (pow(distt + (1. - mixRatio) * .4, 1.5) + 0.1) * (1. - mixRatio) * .4;

    float noise = pNoise(st * 5., 5);
    noise = noise * 10. + noise * (1. - 1.) * 10.;
    float ring = smoothstep(.3, .8, dist);
    float a = pow(1., .5) - pow(1., .5) * clamp(noise * dist * 1. * 1. + dist * 0.9, 0., 1.);
    a = doubleExponentialSigmoid(smoothstep(0.9 - mixRatio * 0.4, 1., a), 0.6);
    
    vec3 color = vec3(a);
    vec4 texel1 = texture2D( tDiffuse1, vUv );
    vec4 texel2 = texture2D( tDiffuse2, vUv );

    gl_FragColor = mix( texel2, texel1, a );
    
}
