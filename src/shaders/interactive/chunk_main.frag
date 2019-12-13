vec2 m = mouse * ratio;
vec2 st = vUv * ratio;
float dist = (pow(distance(m, st) * 4. + distance(m, st) * (1. - enterProg) * 3., .5 + enterProg * 1.)) * (1. - clickProg);
float newNoise = pNoise(st * 5., 5);
newNoise = newNoise * 10. + newNoise * (1. - enterProg) * 10.;
float ring = smoothstep(.3, .8, dist) - smoothstep(.5, 1., dist * .2);
float a = pow(enterProg, .5) - pow(enterProg, .5) * clamp(newNoise * ring * enterProg * .1 + dist * .9, 0., 1.);


vec4 texelColor = mix(texture2D(sketch, vUv), texture2D(painting, vUv), a);
texelColor = mapTexelToLinear( texelColor );
diffuseColor *= texelColor;

