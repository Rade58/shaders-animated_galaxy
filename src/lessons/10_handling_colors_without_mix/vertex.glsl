// no need for redeclare, you would get error
// attribute vec3 color;


attribute float aScale;

uniform float uSize;

// we will put color into this varying
varying vec3 vColor;

void main(){

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
    
  gl_PointSize = uSize * aScale;

  gl_PointSize *= ( 1.0 / - viewPosition.z );

  // as you can see
  vColor = color;

  // and we will use it in fragment shader

}