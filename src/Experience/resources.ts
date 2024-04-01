import type * as kokomi from "kokomi.js";

export const resources: kokomi.ResourceItem[] = [
  {
    name: "bgm",
    type: "audio",
    path: "audio/bgm.mp3",
  },
  {
    name: "sm_car",
    type: "gltfModel",
    path: "mesh/sm_car.gltf",
  },
  {
    name: "sm_startroom",
    type: "gltfModel",
    path: "mesh/sm_startroom.raw.gltf",
  },
  {
    name: "sm_speedup",
    type: "gltfModel",
    path: "mesh/sm_speedup.gltf",
  },
  {
    name: "ut_car_body_ao",
    type: "texture",
    path: "texture/t_car_body_AO.raw.jpg",
  },
  {
    name: "ut_startroom_ao",
    type: "texture",
    path: "texture/t_startroom_ao.raw.jpg",
  },
  {
    name: "ut_startroom_light",
    type: "texture",
    path: "texture/t_startroom_light.raw.jpg",
  },
  {
    name: "ut_floor_normal",
    type: "texture",
    path: "texture/t_floor_normal.webp",
  },
  {
    name: "ut_floor_roughness",
    type: "texture",
    path: "texture/t_floor_roughness.webp",
  },
  {
    name: "ut_env_night",
    type: "hdrTexture",
    path: "texture/t_env_night.hdr",
  },
  {
    name: "ut_env_light",
    type: "hdrTexture",
    path: "texture/t_env_light.hdr",
  },
];
