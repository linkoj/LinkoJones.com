import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './three/Scene';
import FallbackStage from './components/FallbackStage';
import Overlay from './components/Overlay';
import Header from './components/Header';
import Nav, { ScrollHint, StepControls } from './components/Nav';
import Loader from './components/Loader';
import useIsMobile, { prefersReducedMotion } from './hooks/useIsMobile';
import { SECTIONS } from './data/content';

function webglAvailable() {
  try {
    if (typeof window !== 'undefined' && window.location.search.includes('no3d')) return false;
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export default function App() {
  const mobile = useIsMobile();
  const reduced = prefersReducedMotion;
  const [mountScene, setMountScene] = useState(false);
  const [use3D] = useState(webglAvailable);
  const skipIntro = typeof window !== 'undefined' && window.location.search.includes('nointro');

  useEffect(() => {
    // Let the loader paint first, then bring the 3D stage online.
    const t = setTimeout(() => setMountScene(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grain">
      {!skipIntro && <Loader />}

      {/* Fixed cinematic stage */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
        {use3D && mountScene ? (
          <Canvas
            dpr={[1, mobile ? 1.4 : 1.75]}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
            camera={{ position: [0, 1.5, 7], fov: 48, near: 0.1, far: 200 }}
          >
            <Suspense fallback={null}>
              <Scene mobile={mobile} reduced={reduced} />
            </Suspense>
          </Canvas>
        ) : (
          <FallbackStage />
        )}
      </div>

      {/* HTML overlay (the story) */}
      <Header />
      <Overlay />
      <Nav />
      <StepControls />
      <ScrollHint />

      {/* Scroll length driver — creates the journey distance */}
      <div id="scroll-spacer" style={{ height: `${SECTIONS.length * 110}vh` }} aria-hidden="true" />
    </div>
  );
}
