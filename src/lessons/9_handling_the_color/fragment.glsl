// here you go
varying vec3 vColor;


void main(){


  vec2 center = vec2(0.5);

  float strength = distance(gl_PointCoord, center); 


  strength = 1.0 - strength;

  strength = pow(strength, 10.0);

  // here is our color mix
  vec3 blackColor = vec3(0.0);

  vec3 mixedColor = mix(blackColor, vColor, strength);

  // instead of this
  // gl_FragColor = vec4(vec3(strength), 1.0);
  // we write this
  gl_FragColor = vec4(mixedColor, 1.0);


}


