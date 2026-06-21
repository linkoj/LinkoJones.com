// A tiny shared store outside React's render cycle so the 3D loop and the
// navigation can read scroll progress at 60fps without triggering re-renders.
export const scrollState = {
  target: 0, // 0..1 written by GSAP ScrollTrigger
  progress: 0, // 0..1 smoothed inside the render loop
};
