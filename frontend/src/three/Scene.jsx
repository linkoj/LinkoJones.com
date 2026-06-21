import React from 'react';
import { Sparkles, Float } from '@react-three/drei';
import Corridor from './Corridor';
import Exhibit from './Exhibit';
import CameraRig from './CameraRig';
import { STATIONS_COUNT, STATION_SPACING, STATION_ACCENTS } from '../config';

export default function Scene({ mobile = false, reduced = false }) {
  // Exhibits live at stations 1..7 (intro & finale get bespoke pieces).
  const exhibits = [1, 2, 3, 4, 5, 6, 7];

  return (
    <>
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 9, 60]} />

      <CameraRig reduced={reduced} />

      {/* Lighting — kept lean (few lights) for fast fill-rate & 60fps */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 9, 6]} intensity={0.7} color="#cfe2ff" />
      <pointLight position={[0, 3.4, 0]} intensity={16} color="#7dd3fc" distance={30} decay={2} />
      <pointLight position={[0, 3.4, -64]} intensity={16} color="#f5c77e" distance={36} decay={2} />

      <Corridor mobile={mobile} />

      {/* Entry portal */}
      <Float speed={reduced ? 0 : 0.8} floatIntensity={reduced ? 0 : 0.4} position={[0, 2.4, -1]}>
        <mesh>
          <torusGeometry args={[1.5, 0.045, 16, 80]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
      </Float>

      {/* Case-study / chapter exhibits */}
      {exhibits.map((i) => (
        <Exhibit
          key={i}
          position={[i % 2 === 0 ? -3.4 : 3.4, 1.7, -i * STATION_SPACING]}
          side={i % 2 === 0 ? -1 : 1}
          accent={STATION_ACCENTS[i]}
          reduced={reduced}
        />
      ))}

      {/* Finale monolith */}
      <Float speed={reduced ? 0 : 0.7} floatIntensity={reduced ? 0 : 0.5} position={[0, 2.4, -(STATIONS_COUNT - 1) * STATION_SPACING]}>
        <mesh>
          <boxGeometry args={[1.1, 3.4, 0.18]} />
          <meshStandardMaterial color="#0a0f18" emissive="#7dd3fc" emissiveIntensity={1.2} metalness={0.6} roughness={0.2} toneMapped={false} />
        </mesh>
      </Float>

      {!reduced && (
        <Sparkles count={mobile ? 30 : 60} scale={[14, 5, 120]} position={[0, 2.5, -60]} size={2} speed={0.25} color="#bcd6f5" opacity={0.45} />
      )}
    </>
  );
}
