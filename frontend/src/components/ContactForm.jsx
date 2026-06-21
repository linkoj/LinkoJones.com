import React from 'react';
import { Send, Check, Loader2 } from 'lucide-react';
import { PROFILE } from '../data/content';
import useContactForm from '../hooks/useContactForm';

export default function ContactForm() {
  const { form, status, onChange, onSubmit } = useContactForm();

  return (
    <form data-testid="contact-form" onSubmit={onSubmit} className="space-y-3 max-w-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          data-testid="contact-name"
          required
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Your name"
          className="glass rounded-xl px-4 py-3 text-sm text-white placeholder-mist/50 focus:outline-none focus:border-ice/60"
        />
        <input
          data-testid="contact-email"
          required
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          className="glass rounded-xl px-4 py-3 text-sm text-white placeholder-mist/50 focus:outline-none focus:border-ice/60"
        />
      </div>
      <textarea
        data-testid="contact-message"
        required
        name="message"
        value={form.message}
        onChange={onChange}
        rows={3}
        placeholder="Tell me about the role or project…"
        className="glass rounded-xl px-4 py-3 text-sm text-white placeholder-mist/50 w-full focus:outline-none focus:border-ice/60 resize-none"
      />
      <div className="flex items-center gap-4">
        <button
          data-testid="contact-submit"
          type="submit"
          disabled={status === 'sending' || status === 'done'}
          className="inline-flex items-center gap-2 rounded-full bg-ice text-ink font-medium text-sm px-6 py-3 hover:bg-white transition-colors disabled:opacity-60"
        >
          {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'done' && <Check className="w-4 h-4" />}
          {status === 'idle' || status === 'error' ? <Send className="w-4 h-4" /> : null}
          {status === 'done' ? 'Message sent' : 'Send message'}
        </button>
        <a
          data-testid="contact-email-link"
          href={`mailto:${PROFILE.email}`}
          className="text-sm text-mist hover:text-ice transition-colors"
        >
          {PROFILE.email}
        </a>
      </div>
      {status === 'error' && (
        <p data-testid="contact-error" className="text-xs text-red-300">
          Something went wrong — email me directly above.
        </p>
      )}
    </form>
  );
}
