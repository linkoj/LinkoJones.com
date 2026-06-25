// External store for the UX Audit modal (no prop drilling).
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

let state = { active: false, id: null, status: 'idle', report: null, error: null, input: null };
const subs = new Set();

function emit() {
  subs.forEach((f) => f());
}

function lock(on) {
  if (typeof document !== 'undefined') document.body.style.overflow = on ? 'hidden' : '';
}

export const auditStore = {
  get: () => state,
  subscribe(f) {
    subs.add(f);
    return () => subs.delete(f);
  },
  set(partial) {
    state = { ...state, ...partial };
    emit();
  },
  close() {
    state = { active: false, id: null, status: 'idle', report: null, error: null, input: null };
    lock(false);
    emit();
  },
  async start({ url, industry, business_goal }) {
    lock(true);
    state = { active: true, id: null, status: 'processing', report: null, error: null, input: { url, industry, business_goal } };
    emit();
    try {
      const res = await fetch(`${API}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, industry: industry || null, business_goal: business_goal || null }),
      });
      if (!res.ok) throw new Error('Could not start the audit.');
      const data = await res.json();
      this.set({ id: data.id });
      try {
        const u = new URL(window.location.href);
        u.searchParams.set('audit', data.id);
        window.history.replaceState({}, '', u);
      } catch (e) { /* noop */ }
      this._poll(data.id);
    } catch (e) {
      this.set({ status: 'error', error: e.message });
    }
  },
  async open(id) {
    lock(true);
    state = { active: true, id, status: 'processing', report: null, error: null, input: null };
    emit();
    this._poll(id);
  },
  async _poll(id) {
    const tick = async () => {
      if (auditStore.get().id !== id) return; // modal changed/closed
      try {
        const res = await fetch(`${API}/audit/${id}`);
        if (!res.ok) throw new Error('Audit not found.');
        const data = await res.json();
        if (data.status === 'complete') {
          auditStore.set({ status: 'complete', report: data.report, input: { url: data.url, industry: data.industry, business_goal: data.business_goal } });
          return;
        }
        if (data.status === 'error') {
          auditStore.set({ status: 'error', error: data.error || 'Audit failed.' });
          return;
        }
        setTimeout(tick, 2500);
      } catch (e) {
        auditStore.set({ status: 'error', error: e.message });
      }
    };
    tick();
  },
};
