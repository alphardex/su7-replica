import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

export default class Furina extends kokomi.Component {
  declare base: Experience;
  model: THREE.Group;
  realModel: THREE.Group;
  modelParts: THREE.Object3D[];
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  currentAction: THREE.AnimationAction | null;
  isPaused: boolean;
  constructor(base: Experience) {
    super(base);

    const model = new THREE.Group();
    this.model = model;

    // const realModel = this.base.am.items["furina"] as THREE.Group;
    const realModel = this.base.am.items["driving"] as THREE.Group;
    this.realModel = realModel;

    this.model.add(this.realModel);

    const modelParts = kokomi.flatModel(this.realModel);
    // kokomi.printModel(modelParts);
    this.modelParts = modelParts;

    this.handleModel();

    const mixer = new THREE.AnimationMixer(this.model);
    this.mixer = mixer;

    this.actions = {};

    this.currentAction = null;

    this.addAction("driving", "driving");

    this.playAction("driving");

    this.mixer.update(1);
    this.isPaused = true;
  }
  addExisting() {
    this.container.add(this.model);
  }
  update(): void {
    if (this.isPaused) {
      return;
    }

    this.mixer.update(this.base.clock.deltaTime);
  }
  handleModel() {
    this.model.scale.setScalar(0.074);

    this.model.rotation.y = Math.PI * 0.5;

    this.model.position.set(0.225, 0.15, -0.4);

    // @ts-ignore
    this.modelParts.forEach((item: THREE.Mesh) => {
      if (item.isMesh) {
        if ((item.material as THREE.MeshPhongMaterial).isMeshPhongMaterial) {
          const newMat = new THREE.MeshBasicMaterial({
            transparent: true,
            // @ts-ignore
            map: item.material.map || null,
            // color: new THREE.Color("#666666"),
          });
          item.material = newMat;
        }
      }
    });
  }
  addAction(assetName: string, name: string) {
    const animation = (this.base.am?.items[assetName] as THREE.Group)
      .animations[0];
    const action = this.mixer.clipAction(animation);
    this.actions[name] = action;
  }
  playAction(name: string) {
    if (this.currentAction) {
      this.currentAction.fadeOut(0.5);
    }
    const action = this.actions[name];
    action.weight = 1;
    action.reset().fadeIn(0.5).play();
    this.currentAction = action;
    return action;
  }
  setColor(color: THREE.Color) {
    // @ts-ignore
    this.modelParts.forEach((item: THREE.Mesh) => {
      if (item.isMesh) {
        const mat = item.material as THREE.MeshBasicMaterial;
        mat.color.set(color);
      }
    });
  }
  pause() {
    this.isPaused = true;
  }
  drive() {
    this.isPaused = false;
  }
}
