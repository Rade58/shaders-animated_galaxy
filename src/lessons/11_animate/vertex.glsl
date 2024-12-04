attribute float aScale;

uniform float uSize;

varying vec3 vColor;

// this is our new uniform
uniform float uTime;

void main(){

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // to test if it will work
  // it will work your entire glaxy will move up because
  // we are moving every vertex the same way
  // modelPosition.y += uTime * 0.1;

  // we want to rotate the vertices
  // only over x and z
  // we want to do this because our galaxy looks kind of flat

  // idea is tha:
  // - we calculate the particle angle and its distance to the center
  // - we increase that angle according to uTime and the distance
  // - we update the position according to that new angle

  // mora bout arcus tangens
  // https://thebookofshaders.com/glossary/?search=atan

  float angle = atan(modelPosition.x, modelPosition.z);

  float distaceToCenter = length(modelPosition.xz);
  
  float angleOffset = (1.0 / distaceToCenter) * uTime * 0.2;
  
  angle += angleOffset;

  modelPosition.x = cos(angle) * distaceToCenter;
  modelPosition.z = sin(angle) * distaceToCenter;

  // 

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale;

  gl_PointSize *= ( 1.0 / - viewPosition.z );

  vColor = color;


}