varying vec3 vColor;


void main(){


  vec2 center = vec2(0.5);

  float strength = distance(gl_PointCoord, center); 


  strength = 1.0 - strength;

  strength = pow(strength, 10.0);

  // instead all of this
  // vec3 blackColor = vec3(0.0);
  // vec3 mixedColor = mix(blackColor, vColor, strength);
  // gl_FragColor = vec4(mixedColor, 1.0);

  //  we will do it like this
  gl_FragColor = vec4(vColor, strength);

}


