import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

export default class Car extends kokomi.Component {
  declare base: Experience;
  model: STDLIB.GLTF;
  modelParts: THREE.Object3D[];
  bodyMat!: THREE.MeshStandardMaterial;
  wheelModel!: THREE.Group;
  constructor(base: Experience) {
    super(base);

    const model = this.base.am.items["sm_car"] as STDLIB.GLTF;
    this.model = model;

    const modelParts = kokomi.flatModel(model.scene);
    kokomi.printModel(modelParts);
    this.modelParts = modelParts;

    this.handleModel();
  }
  addExisting() {
    this.container.add(this.model.scene);
  }
  update(): void {
    this.wheelModel?.children.forEach((item) => {
      item.rotateZ(-this.base.params.speed * 0.03);
    });
  }
  handleModel() {
    const body = this.modelParts[2] as THREE.Mesh;
    const bodyMat = body.material as THREE.MeshStandardMaterial;
    this.bodyMat = bodyMat;
    bodyMat.color = new THREE.Color("#26d6e9");

    // @ts-ignore
    this.modelParts.forEach((item: THREE.Mesh) => {
      if (item.isMesh) {
        const mat = item.material as THREE.MeshStandardMaterial;
        mat.aoMap = this.base.am.items["ut_car_body_ao"];
      }
    });

    const Wheel = this.modelParts[35] as THREE.Group;
    this.wheelModel = Wheel;
  }
  setBodyEnvmapIntensity(value: number) {
    if (this.bodyMat) {
      this.bodyMat.envMapIntensity = value;
    }
  }
}
