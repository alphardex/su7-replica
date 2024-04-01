import * as dat from "lil-gui";

export default class Debug {
  active: boolean;
  ui: dat.GUI | null;
  constructor() {
    this.active = window.location.hash === "#debug";

    this.ui = null;

    if (this.active) {
      this.ui = new dat.GUI();
    }
  }
}
