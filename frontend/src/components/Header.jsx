import React from 'react';
import { PROFILE } from '../data/content';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-10 py-5 pointer-events-none">
      <a
        href="#intro"
        data-testid="wordmark"
        className="pointer-events-auto font-display text-lg tracking-tight text-white hover:text-ice transition-colors"
      >
        {PROFILE.name.split(' ')[0]}
        <span className="text-ice">.</span>
      </a>
      <div className="hidden md:flex items-center gap-2 pointer-events-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs tracking-widest2 uppercase text-mist">{PROFILE.availability}</span>
      </div>
      <a
        href="#contact"
        data-testid="header-contact"
        className="pointer-events-auto text-xs tracking-widest2 uppercase glass rounded-full px-4 py-2 text-white hover:text-ice transition-colors"
      >
        Get in touch
      </a>
    </header>
  );
}
