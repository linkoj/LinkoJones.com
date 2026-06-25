import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { auditStore } from '../state/audit';

export default function AuditForm() {
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const value = url.trim();
    if (!value) {
      setErr('Enter a website URL to audit.');
      return;
    }
    setErr('');
    auditStore.start({ url: value, industry: industry.trim(), business_goal: goal.trim() });
  };

  return (
    <form onSubmit={submit} data-testid="audit-form" className="mt-7 max-w-xl mx-auto text-left">
      <div className="kicker text-ice/80 mb-2 text-center">Free AI-accelerated UX audit</div>
      <div className="flex items-stretch gap-2 rounded-2xl bg-white/80 backdrop-blur-md border border-ice/25 p-1.5 shadow-[0_8px_30px_rgba(0,40,128,0.12)]">
        <input
          data-testid="audit-url-input"
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a website URL — e.g. yourbrand.com"
          className="flex-1 bg-transparent px-4 text-sm md:text-base text-night placeholder:text-mist/70 focus:outline-none"
          aria-label="Website URL"
        />
        <button
          data-testid="audit-submit-btn"
          type="submit"
          className="shrink-0 inline-flex items-center gap-2 bg-ice text-white text-sm font-medium rounded-xl px-4 md:px-5 py-3 hover:bg-[#0040a4] transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Audit my UX <ArrowRight className="w-4 h-4 hidden md:block" />
        </button>
      </div>

      {err && <p data-testid="audit-error" className="text-gold text-xs mt-2 text-center">{err}</p>}

      <button
        type="button"
        data-testid="audit-context-toggle"
        onClick={() => setShowContext((s) => !s)}
        className="mt-3 mx-auto flex items-center gap-1 text-xs text-mist hover:text-ice transition-colors"
      >
        Add context (optional)
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showContext ? 'rotate-180' : ''}`} />
      </button>

      {showContext && (
        <div className="mt-3 grid sm:grid-cols-2 gap-2" data-testid="audit-context-fields">
          <input
            data-testid="audit-industry-input"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Industry (e.g. SaaS, fintech)"
            className="bg-white/70 border border-ice/20 rounded-xl px-3 py-2.5 text-sm text-night placeholder:text-mist/70 focus:outline-none focus:border-ice"
          />
          <input
            data-testid="audit-goal-input"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Business goal (e.g. conversion)"
            className="bg-white/70 border border-ice/20 rounded-xl px-3 py-2.5 text-sm text-night placeholder:text-mist/70 focus:outline-none focus:border-ice"
          />
        </div>
      )}
      <p className="mt-3 text-[11px] text-mist/60 text-center">
        AI accelerates the analysis — a senior consultancy mindset shapes the read.
      </p>
    </form>
  );
}
