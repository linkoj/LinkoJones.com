import React from 'react';
import { Sparkles } from '@react-three/drei';

// Transparent 3D layer over the tunnel: warm embers + sparks drifting up from
// the flames, adding depth and motion without competing with the backdrop.
export default function Scene({ mobile = false, reduced = false }) {
  if (reduced) return null;

  return (
    <>
      <Sparkles
        count={mobile ? 40 : 90}
        scale={[18, 11, 8]}
        position={[0, 0.5, 0]}
        size={5}
        speed={0.5}
        noise={2}
        color="#5f8ce7"
        opacity={0.5}
      />
      <Sparkles
        count={mobile ? 18 : 36}
        scale={[14, 9, 6]}
        position={[0, 1.5, 2]}
        size={3}
        speed={0.4}
        noise={1.5}
        color="#cfefff"
        opacity={0.45}
      />
    </>
  );
}
