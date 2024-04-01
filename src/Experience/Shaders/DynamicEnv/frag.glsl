uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform sampler2D uEnvmap1;
uniform sampler2D uEnvmap2;
uniform float uWeight;
uniform float uIntensity;

void main(){
    vec2 uv=vUv;
    vec3 envmap1=texture(uEnvmap1,uv).xyz;
    vec3 envmap2=texture(uEnvmap2,uv).xyz;
    vec3 col=mix(envmap1,envmap2,uWeight)*uIntensity;
    gl_FragColor=vec4(col,1.);
}