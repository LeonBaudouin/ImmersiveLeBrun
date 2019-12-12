vec2 m = mouse * ratio;
vec2 st = vUv * ratio;
float dist = pow(distance(m, st) * 4. + distance(m, st) * (1. - prog) * 3., .5 + prog * 1.);
float newNoise = pNoise(st * 5., 5);
newNoise = newNoise * 10. + newNoise * (1. - prog) * 10.;
float ring = smoothstep(.3, .8, dist) - smoothstep(.5, 1., dist * .2);
float a = pow(prog, .5) - pow(prog, .5) * clamp(newNoise * ring * prog * .1 + dist * .9, 0., 1.);


vec4 texelColor = mix(texture2D(texture1, vUv), texture2D(texture2, vUv), a);
texelColor = mapTexelToLinear( texelColor );
diffuseColor *= texelColor;

