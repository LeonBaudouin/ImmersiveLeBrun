varying vec2 vUv;
uniform sampler2D tDiffuse;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


void main() {
	vec4 texel = texture2D( tDiffuse, vUv );
    gl_FragColor = texel + vec4(vec3(1.), rand(vUv) * 0.2);
    gl_FragColor = texel + rand(vUv) * 0.05;
}