

void main(){

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // if you have black screen (which I don't), try setting this
  // gl_PointSize = 2.0;
  // particles have a 2x2 fragment size regardless of the
  // distance of the camera

  // the "on screen" size will be different according 
  // to the pixel ratio

}