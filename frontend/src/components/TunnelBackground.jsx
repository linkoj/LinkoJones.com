import React, { useEffect, useRef } from 'react';
import { scrollState } from '../state/scroll';

const FRAME_COUNT = 180;
const ZOOM = 1.16; // extra crop to hide the source GIF's baked-in watermark
const ORIGIN_Y = 0.38; // anchor toward the top so the bottom corner is cropped
const framePath = (i) => `/zonda/frame_${String(i).padStart(3, '0')}.jpg`;

// Scroll-synced Pagani Zonda tunnel. Scroll position scrubs through the frame
// sequence drawn to a canvas, so scrolling literally drives the car forward —
// the same "camera tied to scroll" idea, rendered as an image sequence.
export default function TunnelBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const images = new Array(FRAME_COUNT);

    const ready = (im) => im && im.complete && im.naturalWidth > 0;

    const pickIndex = () => {
      const p = Math.min(1, Math.max(0, scrollState.target));
      let idx = Math.round(p * (FRAME_COUNT - 1));
      if (ready(images[idx])) return idx;
      // fall back to the nearest already-loaded frame while loading
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (ready(images[idx - d])) return idx - d;
        if (ready(images[idx + d])) return idx + d;
      }
      return -1;
    };

    const draw = () => {
      const idx = pickIndex();
      if (idx < 0) return;
      const im = images[idx];
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / im.naturalWidth, ch / im.naturalHeight) * ZOOM;
      const dw = im.naturalWidth * scale;
      const dh = im.naturalHeight * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) * ORIGIN_Y;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(im, dx, dy, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      draw();
    };

    // Preload all frames; redraw as each arrives.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = draw;
      img.src = framePath(i);
      images[i] = img;
    }

    let raf;
    let last = -1;
    const loop = () => {
      const p = Math.min(1, Math.max(0, scrollState.target));
      const idx = Math.round(p * (FRAME_COUNT - 1));
      if (idx !== last) {
        last = idx;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    loop();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* vignette + edge darkening for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 92% at 50% 34%, rgba(0,0,0,0) 20%, rgba(8,4,2,0.55) 64%, rgba(8,4,2,0.9) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,4,2,0.7) 0%, rgba(8,4,2,0) 22%, rgba(8,4,2,0) 52%, rgba(8,4,2,0.92) 100%)',
        }}
      />
      {/* warm flame glow rising from the floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'radial-gradient(58% 100% at 50% 100%, rgba(255,90,20,0.22), transparent 72%)' }}
      />
    </div>
  );
}
