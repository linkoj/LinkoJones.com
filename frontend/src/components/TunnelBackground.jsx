import React, { useEffect, useRef } from 'react';
import { scrollState } from '../state/scroll';

const GIF = 'https://linkojones.com/img/Pagani_Zonda_Tunnel_Sound.gif';

// Full-bleed Pagani Zonda tunnel backdrop. Scroll drives a slow push-in so it
// feels like accelerating down the tunnel; gradients keep the copy legible.
export default function TunnelBackground() {
  const imgRef = useRef(null);

  useEffect(() => {
    let raf;
    const loop = () => {
      const p = scrollState.target; // 0..1
      if (imgRef.current) {
        // Scale-only push-in. Origin above centre crops the bottom corners
        // (hides the source GIF's baked-in watermark) and never reveals them.
        const scale = 1.16 + p * 0.22;
        imgRef.current.style.transform = `scale(${scale})`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      <img
        ref={imgRef}
        src={GIF}
        alt=""
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ transformOrigin: 'center 38%' }}
      />
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
