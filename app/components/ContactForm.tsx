// app/components/ContactForm.tsx
'use client';

import { useState } from 'react';
import { Button } from './Button';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const ContactForm = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setForm({ name: '', email: '', projectType: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const inputBase =
    'w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-zinc-600 outline-none transition-all';
  const inputStyle = {
    background: 'var(--color-surface-container-lowest)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(110,168,254,0.5)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(78,140,255,0.1)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
    e.currentTarget.style.boxShadow = 'none';
  };

  // ── Success state ──────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div
        className="jims-card p-10 text-center space-y-4"
        style={{ border: '1px solid rgba(52,211,153,0.25)' }}
      >
        <div
          className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl"
          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}
        >
          ✓
        </div>
        <h3 className="text-lg font-bold text-white">Message sent!</h3>
        <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
          Thanks for reaching out! I'll personally review your message and get back to you within 24 hours to schedule your free call.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs underline transition-colors hover:text-white"
          style={{ color: 'var(--color-on-surface-variant)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Send another message
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────
  return (
    <div className="jims-card p-8 space-y-5">

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-on-surface-variant)' }}>
          Full Name
        </label>
        <input
          name="name"
          type="text"
          placeholder="Jane Smith"
          value={form.name}
          onChange={handleChange}
          className={inputBase}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={status === 'loading'}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-on-surface-variant)' }}>
          Email Address
        </label>
        <input
          name="email"
          type="email"
          placeholder="jane@company.com"
          value={form.email}
          onChange={handleChange}
          className={inputBase}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={status === 'loading'}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-on-surface-variant)' }}>
          Business Type
        </label>
        <select
          name="projectType"
          value={form.projectType}
          onChange={handleChange}
          className={`${inputBase} appearance-none`}
          style={{ ...inputStyle, color: form.projectType ? 'var(--color-on-surface)' : '#52525b' }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={status === 'loading'}
        >
          <option value="">What kind of business do you run?</option>
          <option>Hair or Beauty Salon</option>
          <option>Nail Studio</option>
          <option>Restaurant or Café</option>
          <option>Grocery / Convenience Store</option>
          <option>Fitness Studio</option>
              <option>Home or Cleaning Service</option>
              <option>Other Local Business</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--color-on-surface-variant)' }}>
          Tell us about your business
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us what you sell, your website address (if you have one), and what you want to improve..."
          value={form.message}
          onChange={handleChange}
          className={`${inputBase} resize-none`}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && (
        <div
          className="px-4 py-3 rounded-lg text-sm flex items-center gap-2"
          style={{
            background: 'rgba(255,75,75,0.08)',
            border: '1px solid rgba(255,75,75,0.25)',
            color: '#ff6b6b',
          }}
        >
          <span>⚠</span> {errorMsg}
        </div>
      )}

      <Button
        variant="primary"
        className="w-full justify-center"
        size="lg"
        onClick={handleSubmit}
        disabled={status === 'loading'}
        style={status === 'loading' ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
      >
        {status === 'loading' ? (
          <>
            <span
              className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
              style={{ flexShrink: 0 }}
            />
            Sending...
          </>
        ) : (
          'Book My Free Call →'
        )}
      </Button>
    </div>
  );
};
