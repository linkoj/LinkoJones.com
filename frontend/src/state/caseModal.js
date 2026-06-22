// Tiny external store for the case-study deep-dive modal (no prop drilling,
// no re-renders of the scroll overlay).
let current = null;
const subs = new Set();

export const caseModal = {
  open(data) {
    current = data;
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
    subs.forEach((f) => f());
  },
  close() {
    current = null;
    if (typeof document !== 'undefined') document.body.style.overflow = '';
    subs.forEach((f) => f());
  },
  get: () => current,
  subscribe(f) {
    subs.add(f);
    return () => subs.delete(f);
  },
};
