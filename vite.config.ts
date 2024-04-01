import { defineConfig } from "vite";

import glsl from "vite-plugin-glsl";

export default defineConfig({
  server: {
    open: true,
  },
  plugins: [glsl()],
});
