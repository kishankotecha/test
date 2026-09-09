'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError('Wrong password. Try again.');
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-ember/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-saffron/20 blur-3xl" />
        <div className="hero-stripes absolute inset-0 opacity-30" />
      </div>

      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-md animate-float-in overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-8 text-cream shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ember to-saffron text-ink shadow-lg shadow-ember/40 animate-pulse-glow">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-saffron">Qissa Khawani</p>
            <h1 className="font-display text-4xl leading-none">Kitchen access</h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-cream/60">
          Manage menu, offers, WhatsApp orders and guest stories from one animated control room.
        </p>

        <label className="mt-8 block text-[10px] uppercase tracking-[0.22em] text-cream/40">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition focus:border-ember focus:shadow-[0_0_0_4px_rgba(196,92,38,0.2)]"
            placeholder="Enter admin password"
            required
          />
        </label>

        {error && (
          <p className="mt-3 animate-soft-pop text-sm text-[#ff8f6b]">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ember to-[#e07a3a] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-ember/30 hover:brightness-110 disabled:opacity-60"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {loading ? 'Opening…' : 'Enter kitchen'}
        </button>
      </form>
    </div>
  );
}
