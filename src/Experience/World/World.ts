import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";
import { Howl } from "howler";

import type Experience from "../Experience";

import TestObject from "./TestObject";
import DynamicEnv from "./DynamicEnv";
import StartRoom from "./StartRoom";
import Car from "./Car";
import Speedup from "./Speedup";
import CameraShake from "./CameraShake";

export default class World extends kokomi.Component {
  declare base: Experience;
  testObject: TestObject | null;
  dynamicEnv!: DynamicEnv;
  startRoom!: StartRoom;
  car!: Car;
  speedup!: Speedup;
  environment!: kokomi.Environment;
  cameraShake!: CameraShake;
  t1!: ReturnType<typeof gsap.timeline>;
  t2!: ReturnType<typeof gsap.timeline>;
  t3!: ReturnType<typeof gsap.timeline>;
  t4!: ReturnType<typeof gsap.timeline>;
  t5!: ReturnType<typeof gsap.timeline>;
  t6!: ReturnType<typeof gsap.timeline>;
  t7!: ReturnType<typeof gsap.timeline>;
  t8!: ReturnType<typeof gsap.timeline>;
  t9!: ReturnType<typeof gsap.timeline>;
  constructor(base: Experience) {
    super(base);

    this.testObject = null;

    this.base.am.on("ready", () => {
      this.handleAssets();

      // this.testObject = new TestObject(this.base);
      // this.testObject.addExisting();

      const t1 = gsap.timeline();
      this.t1 = t1;
      const t2 = gsap.timeline();
      this.t2 = t2;
      const t3 = gsap.timeline();
      this.t3 = t3;
      const t4 = gsap.timeline();
      this.t4 = t4;
      const t5 = gsap.timeline();
      this.t5 = t5;
      const t6 = gsap.timeline();
      this.t6 = t6;
      const t7 = gsap.timeline();
      this.t7 = t7;
      const t8 = gsap.timeline();
      this.t8 = t8;
      const t9 = gsap.timeline();
      this.t9 = t9;

      this.base.scene.background = new THREE.Color("black");

      const envmap1 = kokomi.getEnvmapFromHDRTexture(
        this.base.renderer,
        this.base.am.items["ut_env_night"]
      );
      const envmap2 = kokomi.getEnvmapFromHDRTexture(
        this.base.renderer,
        this.base.am.items["ut_env_light"]
      );
      const dynamicEnv = new DynamicEnv(this.base, {
        envmap1,
        envmap2,
      });
      this.dynamicEnv = dynamicEnv;
      this.base.scene.environment = dynamicEnv.envmap;
      dynamicEnv.setWeight(1);
      // dynamicEnv.lerpWeight(1, 4);

      const startRoom = new StartRoom(this.base);
      this.startRoom = startRoom;
      startRoom.addExisting();

      const car = new Car(this.base);
      this.car = car;
      car.addExisting();

      const speedup = new Speedup(this.base);
      this.speedup = speedup;
      speedup.addExisting();

      const environment = new kokomi.Environment(this.base, {
        resolution: 512,
        scene: this.base.scene,
        options: {
          minFilter: THREE.LinearMipMapLinearFilter,
          anisotropy: 0,
          depthBuffer: false,
          generateMipmaps: true,
        },
        textureType: THREE.UnsignedByteType,
      });
      this.environment = environment;

      const cameraShake = new CameraShake(this.base);
      this.cameraShake = cameraShake;
      cameraShake.setIntensity(0);

      this.base.interactionManager.add(car.model.scene);
      car.model.scene.addEventListener("click", () => {
        this.rush();
      });

      this.on("enter", () => {
        this.base.params.disableInteract = false;
      });

      this.enter();
      // this.enterDirectly();

      const bgm = new Howl({
        src: "audio/bgm.mp3",
        loop: true,
      });
      bgm.play();
    });
  }
  handleAssets() {
    const items = this.base.am.items;
    (items["ut_car_body_ao"] as THREE.Texture).flipY = false;
    (items["ut_car_body_ao"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_car_body_ao"] as THREE.Texture).minFilter = THREE.NearestFilter;
    (items["ut_car_body_ao"] as THREE.Texture).magFilter = THREE.NearestFilter;
    (items["ut_car_body_ao"] as THREE.Texture).channel = 1;
    (items["ut_startroom_ao"] as THREE.Texture).flipY = false;
    (items["ut_startroom_ao"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_startroom_ao"] as THREE.Texture).channel = 1;
    (items["ut_startroom_light"] as THREE.Texture).flipY = false;
    (items["ut_startroom_light"] as THREE.Texture).colorSpace =
      THREE.SRGBColorSpace;
    (items["ut_startroom_light"] as THREE.Texture).channel = 1;
    (items["ut_floor_normal"] as THREE.Texture).flipY = false;
    (items["ut_floor_normal"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_floor_normal"] as THREE.Texture).wrapS = THREE.RepeatWrapping;
    (items["ut_floor_normal"] as THREE.Texture).wrapT = THREE.RepeatWrapping;
    (items["ut_floor_roughness"] as THREE.Texture).flipY = false;
    (items["ut_floor_roughness"] as THREE.Texture).colorSpace =
      THREE.LinearSRGBColorSpace;
    (items["ut_floor_roughness"] as THREE.Texture).wrapS = THREE.RepeatWrapping;
    (items["ut_floor_roughness"] as THREE.Texture).wrapT = THREE.RepeatWrapping;
  }
  clearAllTweens() {
    this.t1.clear();
    this.t2.clear();
    this.t3.clear();
    this.t4.clear();
    this.t5.clear();
    this.t6.clear();
    this.t7.clear();
    this.t8.clear();
    this.t9.clear();
  }
  enter() {
    this.base.params.disableInteract = true;
    this.dynamicEnv.setWeight(0);
    this.startRoom.lightMat.emissive.set(new THREE.Color("#000000"));
    this.startRoom.lightMat.emissiveIntensity = 0;
    this.dynamicEnv.setIntensity(0);
    this.startRoom.customFloorMat.uniforms.uColor.value.set(
      new THREE.Color("#000000")
    );
    this.startRoom.customFloorMat.uniforms.uReflectIntensity.value = 0;

    document.querySelector(".loader-screen")?.classList.add("hollow");

    this.base.params.isCameraMoving = true;
    this.t1.to(this.base.params.cameraPos, {
      x: 0,
      y: 0.8,
      z: -7,
      duration: 4,
      ease: "power2.inOut",
      onComplete: () => {
        this.base.params.isCameraMoving = false;
        this.emit("enter");
      },
    });
    const lightColor = new THREE.Color();
    const blackColor = new THREE.Color("#000000");
    const whiteColor = new THREE.Color("#ffffff");
    this.t2.to(this.base.params, {
      lightAlpha: 1,
      lightIntensity: 1,
      reflectIntensity: 25,
      duration: 4,
      delay: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        lightColor
          .copy(blackColor)
          .lerp(whiteColor, this.base.params.lightAlpha);

        this.startRoom.lightMat.emissive.set(lightColor);
        this.startRoom.lightMat.emissiveIntensity =
          this.base.params.lightIntensity;

        this.startRoom.customFloorMat.uniforms.uColor.value.set(lightColor);
        this.startRoom.customFloorMat.uniforms.uReflectIntensity.value =
          this.base.params.reflectIntensity;
      },
    });
    this.t3
      .to(this.base.params, {
        envIntensity: 1,
        duration: 4,
        delay: 0.5,
        ease: "power2.inOut",
        onUpdate: () => {
          this.dynamicEnv.setIntensity(this.base.params.envIntensity);
        },
      })
      .to(
        this.base.params,
        {
          envWeight: 1,
          duration: 4,
          ease: "power2.inOut",
          onUpdate: () => {
            this.dynamicEnv.setWeight(this.base.params.envWeight);
          },
        },
        "-=2.5"
      );
  }
  enterDirectly() {
    document.querySelector(".loader-screen")?.classList.add("hollow");
    this.base.params.isCameraMoving = false;
    this.base.controls.controls.setPosition(0, 0.8, -7);
    this.base.params.envIntensity = 1;
    this.emit("enter");
  }
  async rush() {
    if (this.base.params.isRushing) {
      this.rushDone();
      return;
    }

    if (this.base.params.disableInteract) {
      return;
    }

    this.base.params.disableInteract = true;
    this.clearAllTweens();
    // this.base.controls.controls.setPosition(6.4, 1, -3);
    const floorColor = new THREE.Color();
    const blackColor = new THREE.Color("#000000");
    const camera = this.base.camera as THREE.PerspectiveCamera;

    this.t4
      .to(this.base.params, {
        speed: 4,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          this.base.params.isRushing = true;
          this.base.params.disableInteract = false;
        },
      })
      .to(this.base.params, {
        speed: 10,
        duration: 4,
        ease: "power2.out",
      });
    this.t5.to(this.base.params, {
      lightOpacity: 0,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.to(this.base.params, {
      floorLerpColor: 1,
      duration: 4,
      ease: "none",
      onUpdate: () => {
        floorColor.lerp(blackColor, this.base.params.floorLerpColor);
        this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);
      },
    });
    this.t7.to(this.base.params, {
      envIntensity: 0.01,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
    this.t8.to(this.base.params, {
      speedUpOpacity: 1,
      cameraFov: 36,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        this.speedup.material.uniforms.uOpacity.value =
          this.base.params.speedUpOpacity;

        camera.fov = this.base.params.cameraFov;
        camera.updateProjectionMatrix();
      },
    });
    await kokomi.sleep(1000);
    this.base.scene.environment = this.environment.texture;
    this.t9.to(this.base.params, {
      carBodyEnvIntensity: 5,
      cameraShakeIntensity: 1,
      bloomLuminanceSmoothing: 0.4,
      bloomIntensity: 2,
      duration: 4,
      ease: "power2.out",
      onUpdate: () => {
        this.car.setBodyEnvmapIntensity(this.base.params.carBodyEnvIntensity);
        this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
        this.base.post.setLuminanceSmoothing(
          this.base.params.bloomLuminanceSmoothing
        );
        this.base.post.setIntensity(this.base.params.bloomIntensity);
      },
    });
  }
  rushDone() {
    if (this.base.params.disableInteract) {
      return;
    }

    this.base.params.disableInteract = true;
    this.clearAllTweens();
    const floorColor = new THREE.Color();
    const whiteColor = new THREE.Color("#ffffff");
    const camera = this.base.camera as THREE.PerspectiveCamera;

    this.t4.to(this.base.params, {
      speed: 0,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        this.base.params.isRushing = false;
        this.base.params.disableInteract = false;
      },
    });
    this.t5.to(this.base.params, {
      lightOpacity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.startRoom.lightMat.opacity = this.base.params.lightOpacity;
      },
    });
    this.t6.fromTo(
      this.base.params,
      { floorLerpColor: 0 },
      {
        floorLerpColor: 1,
        duration: 4,
        ease: "none",
        onUpdate: () => {
          floorColor.lerp(whiteColor, this.base.params.floorLerpColor);
          this.startRoom.customFloorMat.uniforms.uColor.value.set(floorColor);
        },
      }
    );
    this.t7.to(this.base.params, {
      envIntensity: 1,
      duration: 1,
      ease: "power2.out",
      onUpdate: () => {
        this.dynamicEnv.setIntensity(this.base.params.envIntensity);
      },
    });
    this.t8.to(this.base.params, {
      speedUpOpacity: 0,
      cameraFov: 33.4,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        this.speedup.material.uniforms.uOpacity.value =
          this.base.params.speedUpOpacity;

        camera.fov = this.base.params.cameraFov;
        camera.updateProjectionMatrix();
      },
    });
    this.t9.to(this.base.params, {
      carBodyEnvIntensity: 1,
      cameraShakeIntensity: 0,
      bloomLuminanceSmoothing: 1.6,
      bloomIntensity: 1,
      duration: 4,
      ease: "power2.out",
      onUpdate: () => {
        this.car.setBodyEnvmapIntensity(this.base.params.carBodyEnvIntensity);
        this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
        this.base.post.setLuminanceSmoothing(
          this.base.params.bloomLuminanceSmoothing
        );
        this.base.post.setIntensity(this.base.params.bloomIntensity);
      },
    });
    this.base.scene.environment = this.dynamicEnv.envmap;
  }
}
