import React, { useMemo } from 'react';
import { STATIONS_COUNT, STATION_SPACING } from '../config';

const HALL_W = 6.4; // distance from centre to each wall
const HALL_H = 5.2; // ceiling height
const START_Z = 12;
const END_Z = -(STATIONS_COUNT - 1) * STATION_SPACING - 16;
const LENGTH = START_Z - END_Z;
const MID_Z = (START_Z + END_Z) / 2;

export default function Corridor({ mobile = false }) {
  // Ceiling light battens marching into the distance — the perspective lines.
  const battens = useMemo(() => {
    const arr = [];
    for (let z = START_Z; z >= END_Z; z -= 6) arr.push(z);
    return arr;
  }, []);

  // Vertical accent strips on the walls at each station.
  const stations = useMemo(
    () => Array.from({ length: STATIONS_COUNT }, (_, i) => -i * STATION_SPACING),
    []
  );

  return (
    <group>
      {/* Floor — unlit dark surface (cheap fill); depth comes from fog + glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID_Z]}>
        <planeGeometry args={[HALL_W * 2, LENGTH]} />
        <meshBasicMaterial color="#070a11" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HALL_H, MID_Z]}>
        <planeGeometry args={[HALL_W * 2, LENGTH]} />
        <meshBasicMaterial color="#05070c" />
      </mesh>

      {/* Side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * HALL_W, HALL_H / 2, MID_Z]} rotation={[0, -s * Math.PI / 2, 0]}>
          <planeGeometry args={[LENGTH, HALL_H]} />
          <meshBasicMaterial color="#080b13" />
        </mesh>
      ))}

      {/* Ceiling light battens */}
      {battens.map((z, i) => (
        <mesh key={`b${i}`} position={[0, HALL_H - 0.06, z]}>
          <boxGeometry args={[2.6, 0.05, 0.42]} />
          <meshStandardMaterial color="#dfeaff" emissive="#cfe2ff" emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      ))}

      {/* Floor edge glow lines */}
      {[-1, 1].map((s) => (
        <mesh key={`fl${s}`} position={[s * (HALL_W - 0.15), 0.03, MID_Z]}>
          <boxGeometry args={[0.05, 0.05, LENGTH]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      ))}

      {/* Station wall strips */}
      {stations.map((z, i) =>
        [-1, 1].map((s) => (
          <mesh key={`w${i}-${s}`} position={[s * (HALL_W - 0.05), HALL_H / 2, z]}>
            <boxGeometry args={[0.05, HALL_H * 0.7, 0.12]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#7dd3fc" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        ))
      )}
    </group>
  );
}
