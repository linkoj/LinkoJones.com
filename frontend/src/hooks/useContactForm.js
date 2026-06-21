import { useState } from 'react';

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const EMPTY = { name: '', email: '', message: '' };

// Encapsulates contact-form state + submission so the component stays presentational.
export default function useContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${BACKEND}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setForm(EMPTY);
      setStatus('done');
    } catch (err) {
      setStatus('error');
    }
  };

  return { form, status, onChange, onSubmit };
}
