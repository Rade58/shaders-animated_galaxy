void main(){

  // here is how we drew circular mask pattern

  vec2 center = vec2(0.5);

  float strength = step(center.x, length(gl_PointCoord - center)); 

  strength = 1.0 - strength;

  gl_FragColor = vec4(vec3(strength), 1.0);

  // gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);

}


// there is other way that author of the workshop defined
// 

// void main(){

  // vec2 center = vec2(0.5);
  // float strength = distance(gl_PointCoord, center); 
  // strength = step(center.x, strength);
  // strength = 1.0 - strength;
  // gl_FragColor = vec4(vec3(strength), 1.0);
 
// }