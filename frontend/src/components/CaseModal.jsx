import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { caseModal } from '../state/caseModal';

export default function CaseModal() {
  const data = useSyncExternalStore(caseModal.subscribe, caseModal.get, () => null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && caseModal.get()) caseModal.close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return createPortal(
    <AnimatePresence>
      {data && (
        <motion.div
          data-testid="case-modal"
          className="fixed inset-0 z-[90] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => caseModal.close()}
          style={{ background: 'rgba(4,10,30,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div className="min-h-full flex items-start justify-center p-4 md:p-8">
            <motion.article
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="relative w-full max-w-3xl my-6 bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Hero */}
              <div className="relative">
                <img src={data.image} alt={`${data.project} interface`} className="w-full h-52 md:h-64 object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f18] via-[#0a0f18]/30 to-transparent" />
                <button
                  data-testid="case-modal-close"
                  aria-label="Close case study"
                  onClick={() => caseModal.close()}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-night grid place-items-center hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-5 left-6 right-6">
                  <div className="kicker text-white/85">Case {data.index} · {data.company} · {data.year}</div>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight text-white">{data.name}</h2>
                  <p className="text-sm text-white/75 mt-1">{data.role}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-9 space-y-9">
                <p className="text-base text-night/80 leading-relaxed">{data.deepDive.overview}</p>

                <div>
                  <div className="kicker text-ice mb-4">The work</div>
                  <div className="space-y-6">
                    {data.deepDive.steps.map((s, i) => (
                      <div key={s.title} className="grid md:grid-cols-2 gap-4 md:gap-6 items-center">
                        <img
                          src={s.image}
                          alt={s.title}
                          loading="lazy"
                          className={`w-full h-40 object-cover rounded-2xl border border-night/10 ${i % 2 ? 'md:order-2' : ''}`}
                        />
                        <div>
                          <div className="font-display text-xl text-night mb-1">{String(i + 1).padStart(2, '0')} — {s.title}</div>
                          <p className="text-sm text-mist leading-relaxed">{s.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="kicker text-ice mb-4">Highlights</div>
                  <div className="grid grid-cols-3 gap-3">
                    {data.impact.map((m) => (
                      <div key={m.label} className="rounded-2xl bg-[#f3f6fc] px-3 py-4 text-center border border-night/5">
                        <div className="font-display text-lg md:text-xl text-ice">{m.value}</div>
                        <div className="text-[11px] uppercase tracking-widest2 text-mist mt-1">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-ice/8 border border-ice/20 p-5">
                  <div className="kicker text-ice mb-2">Outcome</div>
                  <p className="text-night/85 leading-relaxed">{data.deepDive.outcome}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.tags.map((t) => (
                    <span key={t} className="text-[11px] text-mist border border-night/10 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>

                <button
                  onClick={() => caseModal.close()}
                  className="inline-flex items-center gap-2 text-sm text-ice hover:text-[#0040a4] transition-colors"
                >
                  Back to the journey <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
