// Shared geometry / pacing constants for the cinematic corridor.
export const STATIONS_COUNT = 9; // matches SECTIONS length in content.js
export const STATION_SPACING = 16;
export const CAM_START_Z = 7;
export const TRAVEL = (STATIONS_COUNT - 1) * STATION_SPACING;

// Accent colour per station — cohesive ice-blue theme with warm gold punctuation.
export const STATION_ACCENTS = [
  '#7DD3FC',
  '#7DD3FC',
  '#F5C77E',
  '#7DD3FC',
  '#A5B4FC',
  '#7DD3FC',
  '#F5C77E',
  '#7DD3FC',
  '#7DD3FC',
];

// UI / pacing constants.
export const MOBILE_BREAKPOINT = 768;
export const SECTION_SCROLL_VH = 110; // scroll length per section
export const SCENE_MOUNT_DELAY_MS = 250; // let the loader paint before WebGL
export const SPARKLES_DESKTOP = 60;
export const SPARKLES_MOBILE = 30;
