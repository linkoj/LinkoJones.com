import React from 'react';
import { ArrowUpRight, Download } from 'lucide-react';
import { PROFILE, EXPERIENCE, PROCESS, SKILLS } from '../data/content';
import { caseModal } from '../state/caseModal';
import ContactForm from './ContactForm';
import AuditForm from './AuditForm';

const Kicker = ({ children }) => (
  <div className="kicker text-ice/80 mb-4" data-anim>{children}</div>
);

const ALIGN_CLASS = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

const Panel = ({ children, align = 'start', wide = false }) => (
  <div className={`flex w-full ${ALIGN_CLASS[align] || ALIGN_CLASS.start}`}>
    <div className={`glass-strong rounded-3xl p-6 md:p-10 ${wide ? 'max-w-3xl' : 'max-w-xl'}`} data-anim>
      {children}
    </div>
  </div>
);

export function IntroSection() {
  return (
    <div className="w-full flex justify-center text-center" data-anim>
      <div className="max-w-3xl">
        <div className="kicker text-ice/80 mb-6">{PROFILE.role} · {PROFILE.location}</div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-glow">
          {PROFILE.name}
        </h1>
        <p className="mt-7 text-lg md:text-2xl text-mist max-w-2xl mx-auto font-light">
          {PROFILE.tagline}
        </p>
        <p className="mt-4 text-sm text-mist/60">
          A drive through the work, the decisions behind it, and the outcomes they shaped.
        </p>
        <AuditForm />
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <Panel align="end" wide>
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start" data-anim>
        <div className="shrink-0">
          {PROFILE.photo ? (
            <img
              src={PROFILE.photo}
              alt={PROFILE.name}
              data-testid="about-photo"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl grid place-items-center font-display text-2xl text-white"
              style={{ background: 'linear-gradient(135deg,#004bc8,#5f8ce7)' }}
            >
              LJ
            </div>
          )}
        </div>
        <div>
          <Kicker>About</Kicker>
          <h2 className="font-display text-3xl md:text-5xl leading-tight tracking-tight">
            I design usable products by seeing a problem from every angle.
          </h2>
          <p className="mt-6 text-mist leading-relaxed">
            Across insurance, banking and investment platforms, I've designed the services and
            interfaces people rely on — pairing rigorous user research with a developer's sense of
            what's actually buildable. Being exposed to the whole business process taught me why
            user experience has to be done with laser-like precision, and keeping an open mind is how
            well thought-out, usable products come to life.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            {['UX Consultant', 'Research-led', 'Design systems', 'Front-end fluent'].map((t) => (
              <span key={t} className="glass rounded-full px-4 py-2 text-mist">{t}</span>
            ))}
          </div>
          <a
            href={PROFILE.cv}
            target="_blank"
            rel="noreferrer"
            data-testid="about-download-cv"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ice text-white text-sm font-medium px-5 py-2.5 hover:bg-[#0040a4] transition-colors"
          >
            <Download className="w-4 h-4" /> Download CV
          </a>
        </div>
      </div>
    </Panel>
  );
}

export function ExperienceSection() {
  return (
    <Panel align="start" wide>
      <Kicker>Experience</Kicker>
      <h2 className="font-display text-3xl md:text-4xl mb-8 tracking-tight">A timeline of teams & impact</h2>
      <ul className="space-y-5">
        {EXPERIENCE.map((e) => (
          <li key={e.company} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 border-t border-white/10 pt-4">
            <span className="text-xs tracking-widest2 text-ice/80 sm:w-32 shrink-0">{e.period}</span>
            <div>
              <div className="text-night font-medium">{e.role} · <span className="text-mist">{e.company}</span></div>
              <div className="text-sm text-mist/70">{e.note}</div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function CaseSection({ data, align }) {
  return (
    <div className={`flex w-full ${align === 'end' ? 'justify-end' : 'justify-start'}`}>
      <div className="glass-strong rounded-3xl overflow-hidden max-w-2xl w-full" data-anim>
        <div className="relative">
          <img
            src={data.image}
            alt={`${data.project} interface`}
            loading="lazy"
            className="w-full h-44 md:h-56 object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="kicker text-white/85">Case {data.index} · {data.year}</div>
              <h2 className="font-display text-2xl md:text-3xl tracking-tight text-white">{data.name}</h2>
            </div>
            <span className="text-xs text-white/70">{data.company}</span>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-sm text-mist/70 mb-4">{data.role}</p>
          <div className="space-y-4 text-sm leading-relaxed">
            <p><span className="text-ice/90 font-medium">Problem. </span><span className="text-mist">{data.problem}</span></p>
            <p><span className="text-ice/90 font-medium">Decision. </span><span className="text-mist">{data.decision}</span></p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {data.impact.map((m) => (
              <div key={m.label} className="glass rounded-2xl px-3 py-4 text-center">
                <div className="font-display text-xl md:text-2xl text-ice">{m.value}</div>
                <div className="text-[11px] uppercase tracking-widest2 text-mist/70 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {data.tags.map((t) => (
              <span key={t} className="text-[11px] text-mist/70 glass rounded-full px-3 py-1">{t}</span>
            ))}
          </div>
          <button
            data-testid={`case-open-${data.index}`}
            onClick={() => caseModal.open(data)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ice text-white text-sm font-medium px-5 py-2.5 hover:bg-[#0040a4] transition-colors"
          >
            View case study <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProcessSection() {
  return (
    <Panel align="end" wide>
      <Kicker>Process</Kicker>
      <h2 className="font-display text-3xl md:text-4xl mb-8 tracking-tight">Designed to be measured, not admired</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {PROCESS.map((p) => (
          <div key={p.no} className="border-t border-white/10 pt-4">
            <div className="font-display text-ice text-lg mb-1">{p.no} — {p.title}</div>
            <p className="text-sm text-mist leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function SkillsSection() {
  return (
    <Panel align="start" wide>
      <Kicker>Skills</Kicker>
      <h2 className="font-display text-3xl md:text-4xl mb-8 tracking-tight">Capabilities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {SKILLS.map((g) => (
          <div key={g.title}>
            <div className="text-xs uppercase tracking-widest2 text-ice/80 mb-3">{g.title}</div>
            <ul className="space-y-2">
              {g.items.map((it) => (
                <li key={it} className="text-sm text-mist">{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function ContactSection() {
  return (
    <div className="w-full flex justify-center" data-anim>
      <div className="glass-strong rounded-3xl p-6 md:p-10 max-w-2xl w-full text-center">
        <div className="kicker text-ice/80 mb-4">Contact</div>
        <h2 className="font-display text-3xl md:text-5xl tracking-tight">Let's build something worth trusting.</h2>
        <p className="mt-4 text-mist">{PROFILE.availability}</p>
        <div className="mt-8 flex justify-center">
          <ContactForm />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-sm">
          {PROFILE.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-mist hover:text-ice transition-colors"
            >
              {l.label} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
