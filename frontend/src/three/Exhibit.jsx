import React from 'react';
import { Float, RoundedBox } from '@react-three/drei';

// Static layout data hoisted out of render to avoid re-allocating each frame.
const BARS = [0.55, 0.9, 0.42, 1.15, 0.7, 1.0];
const DOTS = [0, 1, 2];
const LINES = [0, 1, 2];

// An abstract holographic interface panel — a museum exhibit on the wall.
// Deliberately wordless: the overlay carries the story, the glass sets the stage.
export default function Exhibit({ position, side = -1, accent = '#7dd3fc', reduced = false }) {
  return (
    <Float
      speed={reduced ? 0 : 1.1}
      rotationIntensity={reduced ? 0 : 0.12}
      floatIntensity={reduced ? 0 : 0.5}
      position={position}
    >
      <group rotation={[0, side * 0.36, 0]}>
        {/* Glowing frame behind the glass */}
        <RoundedBox args={[4.6, 3.15, 0.06]} radius={0.14} smoothness={4} position={[0, 0, -0.05]}>
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.1} toneMapped={false} />
        </RoundedBox>

        {/* Glass panel */}
        <RoundedBox args={[4.5, 3.05, 0.12]} radius={0.13} smoothness={4}>
          <meshStandardMaterial
            color="#0a0f18"
            transparent
            opacity={0.32}
            roughness={0.06}
            metalness={0.7}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Holographic UI content */}
        <group position={[0, 0, 0.08]}>
          {/* header bar */}
          <mesh position={[-1.35, 1.05, 0]}>
            <planeGeometry args={[1.5, 0.18]} />
            <meshBasicMaterial color={accent} transparent opacity={0.95} toneMapped={false} />
          </mesh>
          {/* dot cluster */}
          {DOTS.map((d) => (
            <mesh key={d} position={[1.65 - d * 0.22, 1.05, 0]}>
              <circleGeometry args={[0.06, 16]} />
              <meshBasicMaterial color="#9fb1c7" transparent opacity={0.5} />
            </mesh>
          ))}
          {/* body lines */}
          {LINES.map((j) => (
            <mesh key={`l${j}`} position={[-0.25, 0.45 - j * 0.34, 0]}>
              <planeGeometry args={[3.4 - j * 0.5, 0.06]} />
              <meshBasicMaterial color="#9fb1c7" transparent opacity={0.32} />
            </mesh>
          ))}
          {/* mini chart */}
          {BARS.map((h, j) => (
            <mesh key={`bar${j}`} position={[-1.55 + j * 0.5, -1.0 + h / 2, 0]}>
              <planeGeometry args={[0.3, h]} />
              <meshBasicMaterial color={accent} transparent opacity={0.75} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}
