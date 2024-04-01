uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

void main(){
    vec2 uv=vUv;
    gl_FragColor=vec4(uv,0.,1.);
}