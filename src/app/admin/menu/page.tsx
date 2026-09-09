'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import type { Category, MenuItem } from '@/types';

const emptyForm = {
  id: '',
  name: '',
  categoryId: '',
  description: '',
  image: '/menu/chicken-dum-biryani.png',
  tag: '',
  available: true,
  variantsText: '1 Pc|100',
};

export default function AdminMenuPage() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const auth = await fetch('/api/auth', { cache: 'no-store' });
    const { authenticated } = await auth.json();
    if (!authenticated) {
      router.replace('/admin/login');
      return;
    }
    const [menuRes, catRes] = await Promise.all([
      fetch('/api/menu', { cache: 'no-store' }),
      fetch('/api/categories', { cache: 'no-store' }),
    ]);
    setMenu(await menuRes.json());
    setCategories(await catRes.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  function startEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      image: item.image,
      tag: item.tag || '',
      available: item.available,
      variantsText: item.variants.map((v) => `${v.label}|${v.price}`).join('\n'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const variants = form.variantsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const [label, price] = line.split('|');
        return { id: `v${i + 1}`, label: (label || '').trim(), price: Number(price || 0) };
      });

    const payload = {
      id: editingId || undefined,
      name: form.name,
      categoryId: form.categoryId,
      description: form.description,
      image: form.image,
      tag: form.tag || undefined,
      available: form.available,
      variants,
    };

    await fetch('/api/menu', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
    });

    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  async function removeItem(id: string) {
    if (!confirm('Delete this dish?')) return;
    await fetch(`/api/menu?id=${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-5xl leading-none">Menu</h1>
      <p className="mt-3 text-sm text-ink/55">
        Add dishes and portion prices. One variant per line as <code className="rounded bg-ink/5 px-1">Label|Price</code>.
      </p>

      <form
        onSubmit={onSubmit}
        className="glass-panel mt-6 grid animate-soft-pop gap-3 rounded-[28px] p-5 md:grid-cols-2"
      >
        <input
          className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-ember focus:shadow-[0_0_0_4px_rgba(196,92,38,0.12)]"
          placeholder="Dish name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <div className="relative">
          <select
            className="w-full appearance-none rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-ember"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <input
          className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-ember md:col-span-2"
          placeholder="Image path e.g. /menu/galouti-kebab.png"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <textarea
          className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-ember md:col-span-2"
          placeholder="Description"
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-ember"
          placeholder="Tag (optional)"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
        />
        <label className="flex items-center gap-3 rounded-2xl bg-ink/[0.03] px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="accent-ember"
          />
          Available on website
        </label>
        <textarea
          className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 font-mono text-sm outline-none transition focus:border-ember md:col-span-2"
          rows={4}
          placeholder={'2 Pcs|275\n3 Pcs|450\n5 Pcs|625'}
          value={form.variantsText}
          onChange={(e) => setForm({ ...form, variantsText: e.target.value })}
          required
        />
        <button
          type="submit"
          className="mt-1 w-fit rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wide text-cream"
        >
          {editingId ? 'Update dish' : 'Add dish'}
        </button>
      </form>

      <div className="stagger-children mt-8 grid gap-3">
        {menu.map((item) => (
          <div
            key={item.id}
            className="glass-panel flex flex-wrap items-start justify-between gap-4 rounded-[24px] p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <h2 className="font-display text-2xl">{item.name}</h2>
              <p className="text-sm text-ink/50">
                {categories.find((c) => c.id === item.categoryId)?.name || item.categoryId} ·{' '}
                <span className={item.available ? 'text-emerald-700' : 'text-rose-700'}>
                  {item.available ? 'Live' : 'Hidden'}
                </span>
              </p>
              <p className="mt-2 text-sm text-ember">
                {item.variants.map((v) => `${v.label} ${formatPrice(v.price)}`).join(' · ')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-ink hover:text-cream"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-700 hover:bg-rose-50"
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
