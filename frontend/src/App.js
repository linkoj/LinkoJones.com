import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './three/Scene';
import TunnelBackground from './components/TunnelBackground';
import Overlay from './components/Overlay';
import Header from './components/Header';
import Nav from './components/Nav';
import CaseModal from './components/CaseModal';
import AuditModal from './components/AuditModal';
import Loader from './components/Loader';
import useIsMobile, { prefersReducedMotion } from './hooks/useIsMobile';
import { SECTIONS } from './data/content';
import { SECTION_SCROLL_VH, SCENE_MOUNT_DELAY_MS } from './config';
import { auditStore } from './state/audit';

function detectRenderer() {
  try {
    if (typeof window !== 'undefined' && window.location.search.includes('no3d')) {
      return { use3D: false, software: true };
    }
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return { use3D: false, software: true };
    let software = false;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '').toLowerCase();
      software = /swiftshader|llvmpipe|software|basic render/.test(r);
    }
    return { use3D: true, software };
  } catch (e) {
    return { use3D: false, software: true };
  }
}

export default function App() {
  const mobile = useIsMobile();
  const reduced = prefersReducedMotion;
  const [mountScene, setMountScene] = useState(false);
  const [{ use3D, software }] = useState(detectRenderer);
  const skipIntro = typeof window !== 'undefined' && window.location.search.includes('nointro');

  useEffect(() => {
    // Let the loader paint first, then bring the 3D ember layer online.
    const t = setTimeout(() => setMountScene(true), SCENE_MOUNT_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Deep-link: /?audit=<id> opens a shared audit report.
    const id = new URLSearchParams(window.location.search).get('audit');
    if (id) auditStore.open(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grain">
      {!skipIntro && <Loader />}

      {/* Pagani Zonda tunnel backdrop */}
      <TunnelBackground />

      {/* Transparent 3D ember layer over the tunnel */}
      <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
        {use3D && !software && mountScene && (
          <Canvas
            dpr={[1, mobile ? 1.3 : 1.6]}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
            camera={{ position: [0, 0, 10], fov: 55, near: 0.1, far: 100 }}
          >
            <Suspense fallback={null}>
              <Scene mobile={mobile} reduced={reduced} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* HTML overlay (the story) */}
      <Header />
      <Overlay />
      <Nav />
      <CaseModal />
      <AuditModal />

      {/* Scroll length driver — creates the journey distance */}
      <div id="scroll-spacer" style={{ height: `${SECTIONS.length * SECTION_SCROLL_VH}vh` }} aria-hidden="true" />
    </div>
  );
}
