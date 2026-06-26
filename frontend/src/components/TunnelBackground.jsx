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

    const nearestLoaded = (idx) => {
      if (ready(images[idx])) return idx;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (ready(images[idx - d])) return idx - d;
        if (ready(images[idx + d])) return idx + d;
      }
      return -1;
    };

    const scrollIndex = () => {
      const p = Math.min(1, Math.max(0, scrollState.target));
      return Math.round(p * (FRAME_COUNT - 1));
    };

    let lastDrawn = -1;

    const draw = (target) => {
      const idx = nearestLoaded(target);
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
      draw(lastDrawn < 0 ? 0 : lastDrawn);
    };

    // Preload all frames; redraw the current frame as each arrives.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.onload = () => draw(lastDrawn < 0 ? 0 : lastDrawn);
      img.src = framePath(i);
      images[i] = img;
    }

    // Mode: auto-play the full drive on landing; hand over to scroll-scrubbing
    // the moment the visitor scrolls, taps or presses a key.
    let mode = 'auto';
    const AUTOPLAY_MS = 6500;
    const startTime = performance.now();
    const goScroll = () => { mode = 'scroll'; };
    const interactions = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    interactions.forEach((e) => window.addEventListener(e, goScroll, { passive: true }));

    let raf;
    const loop = () => {
      if (mode === 'auto' && scrollState.target > 0.001) mode = 'scroll';
      let target;
      if (mode === 'auto') {
        const frac = ((performance.now() - startTime) % AUTOPLAY_MS) / AUTOPLAY_MS;
        target = Math.round(frac * (FRAME_COUNT - 1));
      } else {
        target = scrollIndex();
      }
      if (target !== lastDrawn) {
        lastDrawn = target;
        draw(target);
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    loop();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      interactions.forEach((e) => window.removeEventListener(e, goScroll));
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* White brand scrim — keeps the tunnel as soft motion while copy stays legible */}
      <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.6)' }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 95% at 50% 44%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 62%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0) 26%, rgba(255,255,255,0) 64%, rgba(255,255,255,0.74) 100%)',
        }}
      />
      {/* subtle brand-blue depth at the edges */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(110% 92% at 50% 30%, rgba(0,40,128,0) 56%, rgba(0,40,128,0.10) 100%)' }}
      />
    </div>
  );
}
