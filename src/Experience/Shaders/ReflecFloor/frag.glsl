#include "/node_modules/lygia/lighting/fresnel.glsl"
#include "/node_modules/lygia/sample/bicubic.glsl"
#include "/node_modules/furina/sample/packedTexture2DLOD.glsl"

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv_;
varying vec4 vWorldPosition;

uniform vec3 uColor;
uniform float uSpeed;
uniform mat4 uReflectMatrix;
uniform sampler2D uReflectTexture;
uniform float uReflectIntensity;
uniform vec2 uMipmapTextureSize;

void main(){
    vec2 p=vUv_;
    
    vec2 surfaceNormalUv=vWorldPosition.xz;
    surfaceNormalUv.x+=iTime*uSpeed;
    vec3 surfaceNormal=texture(normalMap,surfaceNormalUv).rgb*2.-1.;
    surfaceNormal=surfaceNormal.rbg;
    surfaceNormal=normalize(surfaceNormal);
    
    vec3 viewDir=vViewPosition;
    float d=length(viewDir);
    viewDir=normalize(viewDir);
    
    vec2 distortion=surfaceNormal.xz*(.001+1./d);
    
    vec4 reflectPoint=uReflectMatrix*vWorldPosition;
    reflectPoint=reflectPoint/reflectPoint.w;
    
    // vec3 reflectionSample=texture(uReflectTexture,reflectPoint.xy+distortion).xyz;
    vec2 roughnessUv=vWorldPosition.xz;
    roughnessUv.x+=iTime*uSpeed;
    float roughnessValue=texture(roughnessMap,roughnessUv).r;
    roughnessValue=roughnessValue*(1.7-.7*roughnessValue);
    roughnessValue*=4.;
    float level=roughnessValue;
    vec2 finalUv=reflectPoint.xy+distortion;
    vec3 reflectionSample=packedTexture2DLOD(uReflectTexture,finalUv,level,uMipmapTextureSize).rgb;
    reflectionSample*=uReflectIntensity;
    
    vec3 col=uColor;
    // col+=reflectionSample;
    col*=3.;
    vec3 fres=fresnel(vec3(0.),vNormal,viewDir);
    col=mix(col,reflectionSample,fres);
    
    csm_DiffuseColor=vec4(col,1.);
}