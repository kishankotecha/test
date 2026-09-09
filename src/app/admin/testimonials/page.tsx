'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/types';

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>([]);

  async function load() {
    const auth = await fetch('/api/auth', { cache: 'no-store' });
    const { authenticated } = await auth.json();
    if (!authenticated) {
      router.replace('/admin/login');
      return;
    }
    const res = await fetch('/api/testimonials', { cache: 'no-store' });
    setItems(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function approve(item: Testimonial) {
    await fetch('/api/testimonials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, approved: true }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this feedback?')) return;
    await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-5xl leading-none">Feedback → Testimonials</h1>
      <p className="mt-3 text-sm text-ink/55">
        Approve guest notes and they start rotating on the homepage.
      </p>

      <div className="stagger-children mt-8 grid gap-4 lg:grid-cols-2">
        {items.length === 0 && <p className="text-sm text-ink/50">No feedback yet.</p>}
        {items.map((item) => (
          <article
            key={item.id}
            className="glass-panel flex flex-col rounded-[28px] p-5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl">{item.customerName}</h2>
                <div className="mt-1 flex gap-0.5 text-saffron">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  item.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {item.approved ? 'Live' : 'Waiting'}
              </span>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">{item.message}</p>
            <div className="mt-5 flex gap-2">
              {!item.approved && (
                <button
                  type="button"
                  onClick={() => approve(item)}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wide text-cream"
                >
                  Approve
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-700"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
