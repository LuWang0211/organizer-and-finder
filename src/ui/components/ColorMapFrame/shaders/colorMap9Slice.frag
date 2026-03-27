precision mediump float;

uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec2 sourceSize;
uniform vec4 sliceInsets;
uniform vec3 outerColor;
uniform vec3 panelTint;
uniform vec4 panelSourceBounds;
uniform vec4 panelScreenBounds;
uniform vec2 tileTextureSize;

varying vec2 fragCoord;

// Maps the current output-space coordinate back into the original source image
// according to the 9-slice insets.
float screenAxisToSourceAxis(float screenCoord, float screenSize, float sourceSizeValue, float startInset, float endInset) {
  float screenCenter = max(screenSize - startInset - endInset, 1.0);
  float sourceCenter = max(sourceSizeValue - startInset - endInset, 1.0);

  if (screenCoord < startInset) {
    return screenCoord;
  }

  if (screenCoord >= screenSize - endInset) {
    return sourceSizeValue - (screenSize - screenCoord);
  }

  return startInset + ((screenCoord - startInset) / screenCenter) * sourceCenter;
}

// Preserves the original source contribution for partially transparent pixels
// while using the mask alpha as the strength of the replacement.
vec4 writeMaskedPixel(vec4 sourceColor, float maskAlpha, vec3 replacementColor) {
  if (sourceColor.a >= 1.0) {
    return vec4(sourceColor.rgb, 1.0);
  }

  float sourceMix = clamp(sourceColor.a, 0.0, 1.0);
  float maskMix = clamp(maskAlpha, 0.0, 1.0);
  vec3 blendedColor = mix(replacementColor, sourceColor.rgb, sourceMix);
  vec3 finalColor = mix(sourceColor.rgb, blendedColor, maskMix);
  float finalAlpha = max(sourceColor.a, maskAlpha);

  return vec4(finalColor, finalAlpha);
}

void main() {
  vec2 screenUv = fragCoord / resolution.xy;
  float sourceX = screenAxisToSourceAxis(
    fragCoord.x,
    resolution.x,
    sourceSize.x,
    sliceInsets.x,
    sliceInsets.z
  );
  float sourceY = screenAxisToSourceAxis(
    fragCoord.y,
    resolution.y,
    sourceSize.y,
    sliceInsets.y,
    sliceInsets.w
  );

  vec2 sourceUv = vec2(sourceX / sourceSize.x, sourceY / sourceSize.y);
  vec4 sourceColor = texture2D(iChannel0, sourceUv);
  vec4 maskColor = texture2D(iChannel1, sourceUv);

  if (maskColor.b > 0.0) {
    // The blue region repeats in screen space, so it stays visually uniform
    // after the frame is stretched.
    vec2 tileUv = fract(fragCoord / tileTextureSize);
    vec3 tileColor = texture2D(iChannel3, tileUv).rgb * outerColor;
    gl_FragColor = writeMaskedPixel(sourceColor, maskColor.a, tileColor);
    return;
  }

  if (maskColor.r > 0.0) {
    if (
      panelSourceBounds.z <= 0.0 ||
      panelSourceBounds.w <= 0.0 ||
      panelScreenBounds.z <= 0.0 ||
      panelScreenBounds.w <= 0.0
    ) {
      gl_FragColor = sourceColor;
      return;
    }

    // The panel texture maps from the stretched on-screen red rectangle back
    // into the authored panel sub-rectangle inside the source texture.
    vec2 panelLocalUv = (screenUv - panelScreenBounds.xy) / panelScreenBounds.zw;
    vec2 panelUv =
      panelSourceBounds.xy +
      clamp(panelLocalUv, 0.0, 1.0) * panelSourceBounds.zw;
    vec3 panelColor = texture2D(iChannel2, panelUv).rgb;
    panelColor *= panelTint;
    gl_FragColor = vec4(panelColor, maskColor.a);
    return;
  }

  gl_FragColor = sourceColor;
}
