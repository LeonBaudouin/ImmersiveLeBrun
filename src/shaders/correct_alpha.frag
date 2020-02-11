#ifdef USE_MAP
 	vec4 texelColor = texture2D( map, vUv );
 	texelColor = mapTexelToLinear( texelColor );

    #ifdef USE_ALPHAMAP
        vec3 texelRgb = texelColor.rgb;
        float alpha = texture2D(alphaMap, vUv).x;
        vec3 texelHsv = rgb2hsv(texelRgb);
        texelHsv.z -= (1. - alpha) * 0.5;
        texelColor.rgb = hsv2rgb(texelHsv);
    #endif

 	diffuseColor *= texelColor;
#endif
