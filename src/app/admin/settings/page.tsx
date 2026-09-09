'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RestaurantSettings } from '@/types';

const fallbackSettings: RestaurantSettings = {
  name: 'Qissa Khawani',
  tagline: "We're an authentic north Indian eatery only trying to compete with your grandma at what we do.",
  phone: '+91 96867 54003',
  whatsappNumber: '919686754003',
  email: 'hello@qissakhawani.com',
  address: 'Indiranagar, Bengaluru',
  city: 'Bengaluru',
  openingTime: '12:00 PM',
  closingTime: '11:00 PM',
  instagram: 'https://instagram.com/qissakhawani',
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<RestaurantSettings>(fallbackSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const auth = await fetch('/api/auth', { cache: 'no-store' });
        const authData = await auth.json();
        if (!authData.authenticated) {
          router.replace('/admin/login');
          return;
        }

        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (!res.ok) {
          setError('Could not load settings. Showing defaults.');
          setForm(fallbackSettings);
        } else {
          setForm({ ...fallbackSettings, ...(await res.json()) });
        }
      } catch {
        setError('Server not reachable. Showing defaults.');
        setForm(fallbackSettings);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError('Save failed. Check you are still logged in.');
      return;
    }
    setError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function loadDemoData() {
    setSeeding(true);
    const res = await fetch('/api/seed', { method: 'POST' });
    setSeeding(false);
    if (!res.ok) {
      setError('Could not load demo data.');
      return;
    }
    const settingsRes = await fetch('/api/settings', { cache: 'no-store' });
    if (settingsRes.ok) setForm(await settingsRes.json());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-ink/45">
        <span className="h-2 w-2 animate-pulse rounded-full bg-ember" />
        Loading settings…
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl leading-none">Settings</h1>
          <p className="mt-3 text-sm text-ink/55">
            WhatsApp number drives the one-tap order handoff. Keep it as 91XXXXXXXXXX.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDemoData}
          disabled={seeding}
          className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide backdrop-blur disabled:opacity-60"
        >
          {seeding ? 'Loading demo…' : 'Load demo kitchen data'}
        </button>
      </div>

      {error && <p className="mt-4 animate-soft-pop text-sm text-ember">{error}</p>}

      <form
        onSubmit={onSubmit}
        className="glass-panel mt-6 grid max-w-2xl animate-float-in gap-4 rounded-[28px] p-6"
      >
        {(
          [
            ['name', 'Restaurant name'],
            ['tagline', 'Tagline'],
            ['phone', 'Phone display'],
            ['whatsappNumber', 'WhatsApp number (with country code)'],
            ['email', 'Email'],
            ['address', 'Address'],
            ['city', 'City'],
            ['openingTime', 'Opening time'],
            ['closingTime', 'Closing time'],
            ['instagram', 'Instagram URL'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/40">
            {label}
            <input
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition focus:border-ember focus:shadow-[0_0_0_4px_rgba(196,92,38,0.12)]"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
        <button
          type="submit"
          className="mt-2 w-fit rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wide text-cream"
        >
          Save settings
        </button>
        {saved && <p className="animate-soft-pop text-sm text-emerald-700">Saved. Kitchen data is ready.</p>}
      </form>
    </div>
  );
}
