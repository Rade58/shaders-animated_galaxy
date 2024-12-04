

// Get the distance between gl_PointCoord and the center
// Multiply it by 2.0, so it reaches 1.0 before touching the edge
//  Invert the value


void main(){



  vec2 center = vec2(0.5);

  float strength = distance(gl_PointCoord, center); 

  strength *= 2.0;

  strength = 1.0 - strength;

  gl_FragColor = vec4(vec3(strength), 1.0);


}


