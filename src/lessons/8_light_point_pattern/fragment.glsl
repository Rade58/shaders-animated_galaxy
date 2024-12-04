

void main(){



  vec2 center = vec2(0.5);

  float strength = distance(gl_PointCoord, center); 

  // we don't do this
  // strength *= 2.0;

  strength = 1.0 - strength;

  // we do this
  strength = pow(strength, 10.0);


  gl_FragColor = vec4(vec3(strength), 1.0);


}


