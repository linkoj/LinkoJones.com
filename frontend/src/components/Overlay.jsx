import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SECTIONS } from '../data/content';
import { scrollState } from '../state/scroll';
import {
  IntroSection,
  AboutSection,
  ExperienceSection,
  CaseSection,
  ProcessSection,
  SkillsSection,
  ContactSection,
} from './Sections';

gsap.registerPlugin(ScrollTrigger);

const N = SECTIONS.length;

function renderSection(s, i) {
  const align = i % 2 === 0 ? 'start' : 'end';
  switch (s.type) {
    case 'intro':
      return <IntroSection />;
    case 'about':
      return <AboutSection />;
    case 'experience':
      return <ExperienceSection />;
    case 'case':
      return <CaseSection data={s.data} align={align} />;
    case 'process':
      return <ProcessSection />;
    case 'skills':
      return <SkillsSection />;
    case 'contact':
      return <ContactSection />;
    default:
      return null;
  }
}

export default function Overlay() {
  const refs = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline scrubbed by the page scroll. Also publishes the global
      // progress that the 3D camera reads each frame.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scroll-spacer',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            scrollState.target = self.progress;
            // When no 3D render loop is mounted (?no3d / no WebGL), drive
            // progress directly so DOM navigation keeps working.
            if (!scrollState.hasRenderLoop) scrollState.progress = self.progress;
          },
        },
      });

      refs.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) {
          // First section is visible at the very top (scroll progress 0).
          gsap.set(el, { autoAlpha: 1, y: 0 });
        } else {
          gsap.set(el, { autoAlpha: 0, y: 60 });
          tl.fromTo(
            el,
            { autoAlpha: 0, y: 60 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            i
          );
        }
        if (i < N - 1) {
          tl.to(el, { autoAlpha: 0, y: -60, duration: 0.5, ease: 'power2.in' }, i + 0.7);
        }
      });

      ScrollTrigger.refresh();
    });
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div aria-label="Portfolio content">
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          ref={(el) => (refs.current[i] = el)}
          data-testid={`section-${s.id}`}
          aria-label={s.label}
          className="overlay-section"
        >
          <div className="overlay-inner">{renderSection(s, i)}</div>
        </section>
      ))}
    </div>
  );
}
