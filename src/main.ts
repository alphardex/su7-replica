import "./style.css";

import { adaptMobileDOM } from "kokomi.js";

import Experience from "./Experience/Experience";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div id="sketch"></div>
<div class="loader-screen">
    <div class="loading-container">
        <div class="loading">
            <span style="--i: 0">L</span>
            <span style="--i: 1">O</span>
            <span style="--i: 2">A</span>
            <span style="--i: 3">D</span>
            <span style="--i: 4">I</span>
            <span style="--i: 5">N</span>
            <span style="--i: 6">G</span>
        </div>
    </div>
</div>
`;

const app = document.querySelector("#app")! as HTMLElement;

adaptMobileDOM(app);
window.addEventListener("resize", () => {
  adaptMobileDOM(app);
});

new Experience("#sketch");
