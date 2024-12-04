void main(){

  // so gl_PointCoord is a vec2

  gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);

  // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}