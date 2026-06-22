import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { scrollState } from '../state/scroll';
import { SECTIONS, PROFILE } from '../data/content';

const N = SECTIONS.length;

// Condensed bottom-bar links (each jumps to a representative section).
const NAV_LINKS = [
  { id: 'intro', label: 'Prelude' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Career' },
  { id: 'case-1', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
].map((l) => ({ ...l, idx: SECTIONS.findIndex((s) => s.id === l.id) }));

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

  const activeLinkId =
    [...NAV_LINKS].reverse().find((l) => l.idx <= active)?.id || NAV_LINKS[0].id;

  const go = (dir) => scrollToSection(Math.round(scrollState.progress * (N - 1)) + dir);

  return (
    <>
      {/* Edge arrows — sequential horizontal navigation */}
      <button
        data-testid="nav-prev"
        aria-label="Previous section"
        onClick={() => go(-1)}
        className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 bg-ice text-white w-10 h-20 md:w-12 md:h-24 rounded-xl grid place-items-center hover:bg-[#0040a4] transition-colors disabled:opacity-30"
        disabled={active === 0}
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
      </button>
      <button
        data-testid="nav-next"
        aria-label="Next section"
        onClick={() => go(1)}
        className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 bg-ice text-white w-10 h-20 md:w-12 md:h-24 rounded-xl grid place-items-center hover:bg-[#0040a4] transition-colors disabled:opacity-30"
        disabled={active === N - 1}
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
      </button>

      {/* Bottom brand bar with section nav */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-ice text-white shadow-[0_-10px_40px_rgba(0,40,128,0.25)]">
        <div className="flex items-center justify-between px-5 md:px-10 h-14 md:h-16">
          <a
            href="#intro"
            data-testid="bottombar-wordmark"
            aria-label={PROFILE.name}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(0);
            }}
            className="logo-reveal"
          >
            {/* Compact LJ monogram — default, fades out on hover */}
            <img
              src="/logo-mark-t.png"
              alt=""
              data-testid="logo-mark"
              className="logo-reveal__mark"
            />
            {/* Words unveil left-to-right (L→INKO, J→ONOO) simultaneously */}
            <span className="logo-reveal__words" aria-hidden="true">
              <img src="/lj-linko.png" alt="" data-testid="logo-full" className="logo-reveal__part" />
              <img src="/lj-jonoo.png" alt="" className="logo-reveal__part" />
            </span>
          </a>
          <nav aria-label="Section navigation" className="hidden md:flex items-center gap-6 lg:gap-10">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-link-${l.id}`}
                onClick={() => scrollToSection(l.idx)}
                aria-current={activeLinkId === l.id}
                className={`font-display text-sm lg:text-base tracking-wide transition-colors ${
                  activeLinkId === l.id ? 'text-white' : 'text-white/55 hover:text-white/90'
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>
          {/* Mobile: compact position indicator */}
          <span className="md:hidden text-xs tracking-widest2 text-white/80">
            {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </span>
        </div>
      </div>
    </>
  );
}
