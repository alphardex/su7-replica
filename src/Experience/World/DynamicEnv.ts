import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";

import type Experience from "../Experience";

import dynamicEnvVertexShader from "../Shaders/DynamicEnv/vert.glsl";
import dynamicEnvFragmentShader from "../Shaders/DynamicEnv/frag.glsl";

export interface DynamicEnvConfig {
  envmap1: THREE.Texture;
  envmap2: THREE.Texture;
}

const t1 = gsap.timeline();

export default class DynamicEnv extends kokomi.Component {
  declare base: Experience;
  fbo: kokomi.FBO;
  material: THREE.ShaderMaterial;
  quad: kokomi.FullScreenQuad;
  constructor(base: Experience, config: Partial<DynamicEnvConfig> = {}) {
    super(base);

    const { envmap1, envmap2 } = config;

    const envData = envmap1?.source.data;

    const fbo = new kokomi.FBO(this.base, {
      width: envData.width,
      height: envData.height,
    });
    this.fbo = fbo;

    this.envmap.mapping = THREE.CubeUVReflectionMapping;

    const material = new THREE.ShaderMaterial({
      vertexShader: dynamicEnvVertexShader,
      fragmentShader: dynamicEnvFragmentShader,
      uniforms: {
        uEnvmap1: {
          value: envmap1,
        },
        uEnvmap2: {
          value: envmap2,
        },
        uWeight: {
          value: 0,
        },
        uIntensity: {
          value: 1,
        },
      },
    });
    this.material = material;

    const quad = new kokomi.FullScreenQuad(material);
    this.quad = quad;
  }
  update() {
    this.base.renderer.setRenderTarget(this.fbo.rt);
    this.quad.render(this.base.renderer);
    this.base.renderer.setRenderTarget(null);
  }
  get envmap() {
    return this.fbo.rt.texture;
  }
  setWeight(value: number) {
    this.material.uniforms.uWeight.value = value;
  }
  setIntensity(value: number) {
    this.material.uniforms.uIntensity.value = value;
  }
  lerpWeight(value: number, duration: number) {
    // t1.timeScale(0.2);
    t1.to(this.material.uniforms.uWeight, {
      value,
      duration,
      ease: "power2.out",
    });
  }
}
