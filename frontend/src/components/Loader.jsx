import React from 'react';
import { PROFILE } from '../data/content';

// Pure-CSS boot screen. The fade-out animates `opacity` (compositor thread) so
// it dismisses even while WebGL is busy compiling on the main thread.
export default function Loader() {
  return (
    <div
      data-testid="loader"
      className="loader-root fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <div className="kicker text-ice/70 mb-5">{PROFILE.role}</div>
      <div className="font-display text-3xl md:text-5xl tracking-tight text-glow">{PROFILE.name}</div>
      <div className="mt-10 h-px w-56 md:w-72 bg-white/10 overflow-hidden">
        <div className="h-full bg-ice loader-bar2" />
      </div>
      <div className="mt-4 text-xs tracking-widest2 text-mist/60">IGNITION</div>
    </div>
  );
}
