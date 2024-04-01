import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";

import { createNoise2D } from "simplex-noise";

import type Experience from "../Experience";

const noise2d = createNoise2D();

const fbm = ({
  octave = 3,
  frequency = 2,
  amplitude = 0.5,
  lacunarity = 2,
  persistance = 0.5,
} = {}) => {
  let value = 0;
  for (let i = 0; i < octave; i++) {
    const noiseValue = noise2d(frequency, frequency);
    value += noiseValue * amplitude;
    frequency *= lacunarity;
    amplitude *= persistance;
  }
  return value;
};

export interface CameraShakeConfig {
  intensity: number;
}

export default class CameraShake extends kokomi.Component {
  declare base: Experience;
  tweenedPosOffset: THREE.Vector3;
  intensity: number;
  constructor(base: Experience, config: Partial<CameraShakeConfig> = {}) {
    super(base);

    const { intensity = 1 } = config;
    this.intensity = intensity;

    const tweenedPosOffset = new THREE.Vector3(0, 0, 0);
    this.tweenedPosOffset = tweenedPosOffset;
  }
  update(): void {
    const t = this.base.clock.elapsedTime;
    const posOffset = new THREE.Vector3(
      fbm({
        frequency: t * 0.5 + THREE.MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      }),
      fbm({
        frequency: t * 0.5 + THREE.MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      }),
      fbm({
        frequency: t * 0.5 + THREE.MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      })
    );
    posOffset.multiplyScalar(0.1 * this.intensity);
    gsap.to(this.tweenedPosOffset, {
      x: posOffset.x,
      y: posOffset.y,
      z: posOffset.z,
      duration: 1.2,
    });
    this.base.camera.position.add(this.tweenedPosOffset);
  }
  setIntensity(value: number) {
    this.intensity = value;
  }
}
