import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

import reflecFloorVertexShader from "../Shaders/ReflecFloor/vert.glsl";
import reflecFloorFragmentShader from "../Shaders/ReflecFloor/frag.glsl";

import { MeshReflectorMaterial } from "../Utils/meshReflectorMaterial";

export default class StartRoom extends kokomi.Component {
  declare base: Experience;
  model: STDLIB.GLTF;
  uj: kokomi.UniformInjector;
  lightMat: THREE.MeshStandardMaterial;
  customFloorMat: kokomi.CustomShaderMaterial;
  constructor(base: Experience) {
    super(base);

    const model = this.base.am.items["sm_startroom"] as STDLIB.GLTF;
    this.model = model;

    const modelParts = kokomi.flatModel(model.scene);
    // kokomi.printModel(modelParts);

    const light001 = modelParts[1] as THREE.Mesh;
    const lightMat = light001.material as THREE.MeshStandardMaterial;
    this.lightMat = lightMat;
    lightMat.emissive = new THREE.Color("white");
    lightMat.emissiveIntensity = 1;
    lightMat.toneMapped = false;
    lightMat.transparent = true;
    this.lightMat.alphaTest = 0.1;

    const ReflecFloor = modelParts[2] as THREE.Mesh;
    const floorMat = ReflecFloor.material as THREE.MeshPhysicalMaterial;
    floorMat.aoMap = this.base.am.items["ut_startroom_ao"];
    floorMat.lightMap = this.base.am.items["ut_startroom_light"];
    floorMat.normalMap = this.base.am.items["ut_floor_normal"];
    floorMat.roughnessMap = this.base.am.items["ut_floor_roughness"];
    floorMat.envMapIntensity = 0;

    // const reflectPlane = new THREE.Mesh(
    //   new THREE.PlaneGeometry(100, 100),
    //   new THREE.MeshBasicMaterial()
    // );
    // reflectPlane.rotation.x = -Math.PI / 2;
    // this.container.add(reflectPlane);
    // const reflectMat = new kokomi.MeshReflectorMaterial(
    //   this.base,
    //   reflectPlane,
    //   {
    //     resolution: 1024,
    //     blur: [1000, 1000],
    //     mixBlur: 4,
    //     mixStrength: 1,
    //     mirror: 1,
    //   }
    // );
    // // @ts-ignore
    // reflectPlane.material = reflectMat.material;
    // ReflecFloor.visible = false;

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;

    const customFloorMat = new kokomi.CustomShaderMaterial({
      baseMaterial: floorMat,
      vertexShader: reflecFloorVertexShader,
      fragmentShader: reflecFloorFragmentShader,
      uniforms: {
        ...uj.shadertoyUniforms,
        uColor: {
          value: new THREE.Color("#ffffff"),
        },
        uSpeed: {
          value: this.base.params.speed,
        },
        uReflectMatrix: {
          value: new THREE.Matrix4(),
        },
        uReflectTexture: {
          value: null,
        },
        uReflectIntensity: {
          value: 25,
        },
        uMipmapTextureSize: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
    });
    this.customFloorMat = customFloorMat;
    ReflecFloor.material = customFloorMat;

    this.base.resizer.on("resize", () => {
      this.customFloorMat.uniforms.uMipmapTextureSize.value = new THREE.Vector2(
        window.innerWidth,
        window.innerHeight
      );
    });

    // const reflectMat = new kokomi.MeshReflectorMaterial(
    //   this.base,
    //   ReflecFloor,
    //   {
    //     resolution: 1024,
    //     blur: [1000, 1000],
    //     mixBlur: 4,
    //     mixStrength: 1,
    //     mirror: 1,
    //     ignoreObjects: [ReflecFloor],
    //   }
    // );
    // customFloorMat.uniforms.uReflectMatrix.value =
    //   reflectMat.material._textureMatrix.value;
    // customFloorMat.uniforms.uReflectTexture.value =
    //   reflectMat.material._tDiffuse.value;

    const reflectMat = new MeshReflectorMaterial(this.base, ReflecFloor, {
      resolution: 1024,
      ignoreObjects: [light001, ReflecFloor],
    });
    customFloorMat.uniforms.uReflectMatrix.value = reflectMat._reflectMatrix;
    // customFloorMat.uniforms.uReflectTexture.value =
    //   reflectMat._renderTexture.rt.texture;
    customFloorMat.uniforms.uReflectTexture.value =
      reflectMat.mipmapFBO.rt.texture;
  }
  addExisting() {
    this.container.add(this.model.scene);
  }
  update(): void {
    this.uj.injectShadertoyUniforms(this.customFloorMat.uniforms);

    this.customFloorMat.uniforms.uSpeed.value = this.base.params.speed;
  }
}
