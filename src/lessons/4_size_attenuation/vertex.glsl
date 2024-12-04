attribute float aScale;

uniform float uSize;

void main(){

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  


  
  gl_PointSize = uSize * aScale;

  // we pasted this but we don't need all of this
  // since I guess we are only using perspective camera
  // bool isPerspective = isPerspectiveMatrix( projectionMatrix );
	// if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	
  // for scale we have set 1.0, and as we said mvPosition is viewPosition 
  gl_PointSize *= ( 1.0 / - viewPosition.z );
  





}