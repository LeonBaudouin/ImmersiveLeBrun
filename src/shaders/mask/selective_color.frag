float texelMask = texture2D(textureMask, vUv).x;
float secondaryTexelMask = texture2D(secondaryTextureMask, vUv).x;
float colorMixProg = mix(secondaryTexelMask, texelMask, maskTransition);
vec4 diffuseColor = vec4(mix(diffuse, vec3(1.), colorMixProg), opacity);
