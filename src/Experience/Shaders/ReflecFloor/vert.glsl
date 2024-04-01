uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv_;
varying vec4 vWorldPosition;

void main(){
    vec3 p=position;
    
    csm_Position=p;
    
    vUv_=uv;
    vWorldPosition=modelMatrix*vec4(p,1);
}