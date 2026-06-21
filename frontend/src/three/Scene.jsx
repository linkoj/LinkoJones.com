import React from 'react';
import { Sparkles } from '@react-three/drei';

// Transparent 3D layer over the tunnel: warm embers + sparks drifting up from
// the flames, adding depth and motion without competing with the backdrop.
export default function Scene({ mobile = false, reduced = false }) {
  if (reduced) return null;

  return (
    <>
      <Sparkles
        count={mobile ? 50 : 110}
        scale={[18, 11, 8]}
        position={[0, 0.5, 0]}
        size={6}
        speed={0.7}
        noise={2}
        color="#FF7A29"
        opacity={0.85}
      />
      <Sparkles
        count={mobile ? 24 : 48}
        scale={[14, 9, 6]}
        position={[0, 1.5, 2]}
        size={3}
        speed={0.5}
        noise={1.5}
        color="#FFC178"
        opacity={0.7}
      />
      <Sparkles
        count={mobile ? 14 : 28}
        scale={[10, 6, 4]}
        position={[0, -1, 3]}
        size={9}
        speed={0.9}
        noise={3}
        color="#FF4D16"
        opacity={0.6}
      />
    </>
  );
}
