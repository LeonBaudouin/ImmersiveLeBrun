varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float tTime;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float rand(float n){return fract(sin(n) * 43758.5453123);}

vec3 czm_saturation(vec3 rgb, float adjustment)
{
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

void main() {
	vec4 texel = texture2D( tDiffuse, vUv );
    texel.rgb = czm_saturation(texel.rgb, (sin(tTime / 100.) + 1.));
    gl_FragColor = texel + rand(vUv + rand(tTime)) * 0.12;
}
