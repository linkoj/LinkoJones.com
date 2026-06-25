import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, AlertTriangle, Lightbulb, CheckCircle2, Zap, Layers, Share2 } from 'lucide-react';
import { auditStore } from '../state/audit';

const FRAMEWORK_NAMES = [
  'Evidence', 'Empathy', 'Exploration', 'Philosophy', 'Creativity',
  'Finesse', 'Experimentation', 'Psychology', 'Collaboration', 'Execution',
];

const LEVEL_STYLE = {
  High: 'bg-ice/12 text-ice border-ice/30',
  Medium: 'bg-amber-400/15 text-amber-600 border-amber-400/30',
  Low: 'bg-night/5 text-mist border-night/15',
};

const Badge = ({ label, level }) => (
  <span className={`text-[10px] uppercase tracking-widest2 px-2 py-1 rounded-full border ${LEVEL_STYLE[level] || LEVEL_STYLE.Low}`}>
    {label}: {level}
  </span>
);

const List = ({ items, icon: Icon, tone }) =>
  items && items.length ? (
    <ul className="space-y-1.5 mt-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm text-night/80 leading-relaxed">
          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${tone}`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  ) : null;

function Loading({ url }) {
  return (
    <div className="p-8 md:p-12 text-center" data-testid="audit-loading">
      <div className="kicker text-ice mb-3">Auditing {url}</div>
      <h3 className="font-display text-2xl md:text-3xl text-night mb-2">Running the 10-step UX read</h3>
      <p className="text-sm text-mist mb-8">Fetching the page, then evaluating it through the LinkoJones framework. This takes around a minute.</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {FRAMEWORK_NAMES.map((n, i) => (
          <div
            key={n}
            className="rounded-xl border border-ice/15 bg-[#f3f6fc] px-2 py-3 text-xs text-mist audit-pulse"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step }) {
  return (
    <article className="rounded-2xl border border-night/10 bg-white p-5 md:p-6" data-testid={`audit-step-${step.number}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="kicker text-ice">Step {step.number} · {step.framework}</div>
          <h4 className="font-display text-xl text-night mt-1">{step.title}</h4>
        </div>
        <div className="flex gap-1.5">
          <Badge label="Conf" level={step.confidence} />
          <Badge label="Prio" level={step.priority} />
        </div>
      </div>
      <p className="text-sm text-mist mt-2 leading-relaxed">{step.description}</p>
      {step.findings?.length > 0 && (
        <div className="mt-4"><div className="text-[11px] uppercase tracking-widest2 text-night/50">Findings</div>
          <List items={step.findings} icon={CheckCircle2} tone="text-ice" /></div>
      )}
      {step.issues?.length > 0 && (
        <div className="mt-4"><div className="text-[11px] uppercase tracking-widest2 text-night/50">Issues</div>
          <List items={step.issues} icon={AlertTriangle} tone="text-gold" /></div>
      )}
      {step.opportunities?.length > 0 && (
        <div className="mt-4"><div className="text-[11px] uppercase tracking-widest2 text-night/50">Opportunities</div>
          <List items={step.opportunities} icon={Lightbulb} tone="text-ice" /></div>
      )}
    </article>
  );
}

function Report({ report, input }) {
  const goContact = () => {
    auditStore.close();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max, behavior: 'smooth' });
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch (e) { /* noop */ }
  };
  return (
    <div className="p-6 md:p-9 space-y-8" data-testid="audit-report">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="kicker text-ice">LinkoJones UX Audit</div>
          <h3 className="font-display text-2xl md:text-3xl text-night mt-1 break-words">{input?.url}</h3>
        </div>
        <button onClick={share} data-testid="audit-share-btn" className="shrink-0 inline-flex items-center gap-1.5 text-xs text-ice border border-ice/25 rounded-full px-3 py-1.5 hover:bg-ice/10 transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Copy link
        </button>
      </div>

      {report.executiveSummary?.length > 0 && (
        <section className="rounded-2xl bg-ice/8 border border-ice/20 p-5 md:p-6">
          <div className="kicker text-ice mb-3">Executive summary</div>
          <ul className="space-y-2">
            {report.executiveSummary.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-night/85 leading-relaxed">
                <span className="text-ice mt-1">—</span><span>{b}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4">
        {report.steps?.map((s) => <StepCard key={s.number} step={s} />)}
      </section>

      {report.impactMap && (
        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-night/10 bg-[#f3f6fc] p-5">
            <div className="flex items-center gap-2 text-ice mb-3"><Zap className="w-4 h-4" /><span className="kicker">High impact · low effort</span></div>
            <List items={report.impactMap.highImpactLowEffort} icon={CheckCircle2} tone="text-ice" />
          </div>
          <div className="rounded-2xl border border-night/10 bg-[#f3f6fc] p-5">
            <div className="flex items-center gap-2 text-night mb-3"><Layers className="w-4 h-4" /><span className="kicker">High impact · high effort</span></div>
            <List items={report.impactMap.highImpactHighEffort} icon={Lightbulb} tone="text-night/60" />
          </div>
        </section>
      )}

      {report.nextAction && (
        <section className="rounded-2xl bg-night text-white p-6 md:p-7" data-testid="audit-next-action">
          <div className="kicker text-ice mb-2">Suggested next action · {report.nextAction.recommendation}</div>
          <p className="text-white/85 leading-relaxed">{report.nextAction.summary}</p>
          <button onClick={goContact} data-testid="audit-cta-contact" className="mt-5 inline-flex items-center gap-2 bg-ice text-white text-sm font-medium rounded-xl px-5 py-3 hover:bg-[#0040a4] transition-colors">
            Discuss this with LinkoJones <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}
    </div>
  );
}

export default function AuditModal() {
  const s = useSyncExternalStore(auditStore.subscribe, auditStore.get, auditStore.get);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && auditStore.get().active) auditStore.close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return createPortal(
    <AnimatePresence>
      {s.active && (
        <motion.div
          data-testid="audit-modal"
          className="fixed inset-0 z-[95] overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onClick={() => auditStore.close()}
          style={{ background: 'rgba(4,10,30,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div className="min-h-full flex items-start justify-center p-4 md:p-8">
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              className="relative w-full max-w-3xl my-6 bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                data-testid="audit-modal-close"
                aria-label="Close audit"
                onClick={() => auditStore.close()}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 text-night grid place-items-center hover:bg-white transition-colors shadow"
              >
                <X className="w-5 h-5" />
              </button>

              {s.status === 'processing' && <Loading url={s.input?.url || 'your site'} />}
              {s.status === 'complete' && s.report && <Report report={s.report} input={s.input} />}
              {s.status === 'error' && (
                <div className="p-10 text-center" data-testid="audit-error-state">
                  <AlertTriangle className="w-10 h-10 text-gold mx-auto mb-3" />
                  <h3 className="font-display text-2xl text-night mb-2">We couldn't finish that audit</h3>
                  <p className="text-sm text-mist">{s.error || 'Please try a different URL.'}</p>
                  <button onClick={() => auditStore.close()} className="mt-6 inline-flex items-center gap-2 text-sm text-ice hover:text-[#0040a4]">
                    Back to the journey <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
