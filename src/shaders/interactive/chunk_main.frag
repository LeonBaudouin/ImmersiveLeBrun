vec2 m = mouse * ratio;
vec2 st = vUv * ratio;

float dist = (pow(distance(m, st) * 3. + distance(m, st) * (1. - enterProg) * 3., .5 + enterProg * 1.) + 0.1) * (1. - clickProg);
float noise = pNoise(st * 5., 5);
noise = noise * 10. + noise * (1. - enterProg) * 10.;
float ring = smoothstep(.3, .8, dist);
float a = pow(enterProg, .5) - pow(enterProg, .5) * clamp(noise * dist * enterProg * 1. + dist * 0.9, 0., 1.);


vec4 texelColor = mix(texture2D(sketch, vUv), texture2D(painting, vUv), a);
texelColor = mapTexelToLinear( texelColor );
diffuseColor *= texelColor;

