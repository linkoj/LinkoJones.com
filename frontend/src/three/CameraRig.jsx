import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../state/scroll';
import { CAM_START_Z, TRAVEL } from '../config';

// Moves the camera straight down the corridor, tied to scroll progress.
export default function CameraRig({ reduced = false }) {
  const look = useRef(new THREE.Vector3());

  useEffect(() => {
    // Signal that a render loop is driving `progress` (DOM nav relies on this).
    scrollState.hasRenderLoop = true;
    return () => {
      scrollState.hasRenderLoop = false;
    };
  }, []);

  useFrame((state, delta) => {
    // Extra smoothing on top of ScrollTrigger's scrub for a cinematic glide.
    const ease = 1 - Math.pow(0.0015, delta);
    scrollState.progress += (scrollState.target - scrollState.progress) * ease;
    const p = scrollState.progress;

    const z = CAM_START_Z - p * TRAVEL;
    const sway = reduced ? 0 : Math.sin(p * Math.PI * 4) * 1.05;
    const y = reduced ? 1.5 : 1.5 + Math.sin(p * Math.PI * 6) * 0.05;

    state.camera.position.set(sway, y, z);
    look.current.set(sway * 0.35, 1.32, z - 14);
    state.camera.lookAt(look.current);
  });

  return null;
}
