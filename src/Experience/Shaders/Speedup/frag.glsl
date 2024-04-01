#include "/node_modules/furina/generative/simplex.glsl"
#include "/node_modules/lygia/generative/random.glsl"
#include "/node_modules/lygia/math/saturate.glsl"
#include "/node_modules/lygia/math/map.glsl"
#include "/node_modules/lygia/color/palette.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform float uSpeed;
uniform float uOpacity;

vec3 pos2col(vec2 i){
    i+=vec2(9.,0.);
    
    float r=random(i+vec2(12.,2.));
    float g=random(i+vec2(7.,5.));
    float b=random(i);
    
    vec3 col=vec3(r,g,b);
    return col;
}

vec3 colorNoise(vec2 uv){
    vec2 size=vec2(1.);
    vec2 pc=uv*size;
    vec2 base=floor(pc);
    
    vec3 v1=pos2col((base+vec2(0.,0.))/size);
    vec3 v2=pos2col((base+vec2(1.,0.))/size);
    vec3 v3=pos2col((base+vec2(0.,1.))/size);
    vec3 v4=pos2col((base+vec2(1.,1.))/size);
    
    vec2 f=fract(pc);
    
    f=smoothstep(0.,1.,f);
    
    vec3 px1=mix(v1,v2,f.x);
    vec3 px2=mix(v3,v4,f.x);
    vec3 v=mix(px1,px2,f.y);
    return v;
}

void main(){
    vec2 uv=vUv;
    
    vec3 col=vec3(1.);
    
    float mask=1.;
    
    vec2 noiseUv=uv;
    noiseUv.x+=-iTime*.5;
    float noiseValue=noise(noiseUv*vec2(3.,100.));
    mask=noiseValue;
    mask=map(mask,-1.,1.,0.,1.);
    mask=pow(saturate(mask-.1),11.);
    mask=smoothstep(0.,.04,mask);
    
    // col=palette(mask,vec3(.5),vec3(.5),vec3(1.),vec3(0.,.33,.67));
    col=colorNoise(noiseUv*vec2(10.,100.));
    col*=vec3(1.5,1.,400.);
    // mask=1.;
    mask*=smoothstep(.02,.5,uv.x)*smoothstep(.02,.5,1.-uv.x);
    mask*=smoothstep(.01,.1,uv.y)*smoothstep(.01,.1,1.-uv.y);
    mask*=smoothstep(1.,10.,uSpeed);
    
    gl_FragColor=vec4(col,mask*uOpacity);
}