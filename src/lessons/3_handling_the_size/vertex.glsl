attribute float aScale;

uniform float uSize;

void main(){

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // instead hardcoded value
  // gl_PointSize = 2.0;
  // we can now use uniform
  // but we will multiply by our attribute
  // since attribute is different for every vertex
  // this will ensure that we have some randomness
  gl_PointSize = uSize * aScale;

  // as we said, uSize is actually uSize * pixelRatio
  // but we did this outside the shader in threejs

}