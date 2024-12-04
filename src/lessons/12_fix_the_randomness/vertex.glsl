attribute float aScale;

uniform float uSize;

varying vec3 vColor;

uniform float uTime;

// this is our new attributr
attribute vec3 aRandomness;



void main(){

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  

  float angle = atan(modelPosition.x, modelPosition.z);

  float distaceToCenter = length(modelPosition.xz);
  
  float angleOffset = (1.0 / distaceToCenter) * uTime * 0.2;
  
  angle += angleOffset;

  modelPosition.x = cos(angle) * distaceToCenter;
  modelPosition.z = sin(angle) * distaceToCenter;

  // and here we are adding randomness the same way we did it outside
  // of the shader before we decided to do it like this
  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale;

  gl_PointSize *= ( 1.0 / - viewPosition.z );


  vColor = color;


}