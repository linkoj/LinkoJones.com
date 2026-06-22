import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { scrollState } from '../state/scroll';
import { SECTIONS } from '../data/content';

const N = SECTIONS.length;

function scrollToSection(i) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const top = (Math.max(0, Math.min(N - 1, i)) / (N - 1)) * max;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function Nav() {
  const [active, setActive] = useState(0);
  const raf = useRef();

  useEffect(() => {
    const loop = () => {
      const a = Math.round(scrollState.progress * (N - 1));
      setActive((p) => (p !== a ? a : p));
      raf.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard navigation between stations.
  useEffect(() => {
    const onKey = (e) => {
      const cur = Math.round(scrollState.progress * (N - 1));
      if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        scrollToSection(cur + 1);
      } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        scrollToSection(cur - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(N - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-3"
    >
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          data-testid={`nav-dot-${s.id}`}
          onClick={() => scrollToSection(i)}
          aria-label={`Go to ${s.label}`}
          aria-current={active === i}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <span
            className={`text-[10px] uppercase tracking-widest2 transition-all duration-300 ${
              active === i ? 'text-ice opacity-100' : 'text-mist opacity-0 group-hover:opacity-70'
            }`}
          >
            {s.label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === i ? 'w-2.5 h-2.5 bg-ice' : 'w-1.5 h-1.5 bg-night/25 group-hover:bg-night/50'
            }`}
          />
        </button>
      ))}
    </nav>
  );
}

export function ScrollHint() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setGone(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (gone) return null;
  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-mist/70 pointer-events-none">
      <span className="text-[10px] uppercase tracking-widest2">Scroll to drive through</span>
      <ChevronDown className="w-4 h-4 animate-bounce" />
    </div>
  );
}

export function StepControls() {
  return (
    <div className="fixed bottom-6 right-4 md:right-8 z-30 flex flex-col gap-2">
      <button
        data-testid="step-prev"
        aria-label="Previous section"
        onClick={() => scrollToSection(Math.round(scrollState.progress * (N - 1)) - 1)}
        className="glass w-10 h-10 rounded-full grid place-items-center text-night/70 hover:text-ice transition-colors"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        data-testid="step-next"
        aria-label="Next section"
        onClick={() => scrollToSection(Math.round(scrollState.progress * (N - 1)) + 1)}
        className="glass w-10 h-10 rounded-full grid place-items-center text-night/70 hover:text-ice transition-colors"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}
