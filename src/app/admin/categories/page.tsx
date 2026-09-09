'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');

  async function load() {
    const auth = await fetch('/api/auth', { cache: 'no-store' });
    const { authenticated } = await auth.json();
    if (!authenticated) {
      router.replace('/admin/login');
      return;
    }
    const res = await fetch('/api/categories', { cache: 'no-store' });
    setCategories(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    await load();
  }

  async function toggle(category: Category) {
    await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...category, active: !category.active }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-5xl leading-none">Categories</h1>
      <p className="mt-3 text-sm text-ink/55">Control the tabs guests swipe through on the menu.</p>

      <form onSubmit={onSubmit} className="glass-panel mt-6 flex animate-soft-pop flex-wrap gap-3 rounded-[28px] p-4">
        <input
          className="min-w-[220px] flex-1 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm outline-none focus:border-ember"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wide text-cream">
          Add category
        </button>
      </form>

      <div className="stagger-children mt-8 grid gap-3 sm:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="glass-panel flex items-center justify-between rounded-[24px] p-5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <p className="font-display text-2xl">{category.name}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/40">
                {category.active ? 'Visible' : 'Hidden'} · order {category.sortOrder}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toggle(category)}
                className="rounded-full bg-ink/5 px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-ink hover:text-cream"
              >
                {category.active ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={() => remove(category.id)}
                className="rounded-full border border-rose-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-rose-700"
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
