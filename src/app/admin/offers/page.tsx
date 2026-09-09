'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Offer } from '@/types';

export default function AdminOffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  async function load() {
    const auth = await fetch('/api/auth', { cache: 'no-store' });
    const { authenticated } = await auth.json();
    if (!authenticated) {
      router.replace('/admin/login');
      return;
    }
    const res = await fetch('/api/offers', { cache: 'no-store' });
    setOffers(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, code: code || undefined, active: true }),
    });
    setTitle('');
    setDescription('');
    setCode('');
    await load();
  }

  async function toggle(offer: Offer) {
    await fetch('/api/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...offer, active: !offer.active }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this offer?')) return;
    await fetch(`/api/offers?id=${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-5xl leading-none">Offers</h1>
      <p className="mt-3 text-sm text-ink/55">Push promotions to the homepage banner with one click.</p>

      <form onSubmit={onSubmit} className="glass-panel mt-6 grid animate-soft-pop gap-3 rounded-[28px] p-5">
        <input
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm outline-none focus:border-ember"
          placeholder="Offer title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm outline-none focus:border-ember"
          placeholder="Short description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm outline-none focus:border-ember"
          placeholder="Code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="w-fit rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wide text-cream">
          Publish offer
        </button>
      </form>

      <div className="stagger-children mt-8 space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="glass-panel shine-border flex flex-wrap items-start justify-between gap-4 rounded-[24px] p-5 transition hover:-translate-y-1"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl">{offer.title}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    offer.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {offer.active ? 'Live' : 'Paused'}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/60">{offer.description}</p>
              {offer.code && (
                <p className="mt-3 inline-flex rounded-full bg-saffron/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  Code {offer.code}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggle(offer)}
                className="rounded-full bg-ink/5 px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-ink hover:text-cream"
              >
                {offer.active ? 'Pause' : 'Activate'}
              </button>
              <button
                type="button"
                onClick={() => remove(offer.id)}
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
