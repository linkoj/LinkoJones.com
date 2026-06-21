import React from 'react';

// Premium CSS fallback shown when WebGL is unavailable or disabled — keeps the
// museum mood (deep space, light corridor, glow) without the 3D canvas.
export default function FallbackStage() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink" aria-hidden="true">
      <div className="absolute inset-0" style={{
        background:
          'radial-gradient(120% 80% at 50% 8%, rgba(125,211,252,0.10), transparent 55%),' +
          'radial-gradient(80% 60% at 50% 120%, rgba(245,199,126,0.08), transparent 60%),' +
          'linear-gradient(#04050a, #04050a)',
      }} />
      {/* Perspective corridor lines */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ perspective: '600px' }}>
        <div style={{ transform: 'rotateX(72deg)', transformStyle: 'preserve-3d' }}>
          <div className="grid" style={{
            width: '140vw',
            height: '140vh',
            backgroundImage:
              'linear-gradient(rgba(125,211,252,0.12) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(125,211,252,0.12) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at 50% 40%, black, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black, transparent 70%)',
          }} />
        </div>
      </div>
    </div>
  );
}
