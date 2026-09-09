'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, RefreshCw, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/types';

type Stats = {
  totals: {
    orders: number;
    todayOrders: number;
    revenue: number;
    todayRevenue: number;
    pending: number;
    menuItems: number;
    activeOffers: number;
    pendingFeedback: number;
  };
  topDishes: Array<{ id: string; name: string; qty: number; revenue: number }>;
  recentOrders: Order[];
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);

  async function load() {
    try {
      const auth = await fetch('/api/auth', { cache: 'no-store' });
      const { authenticated } = await auth.json();
      if (!authenticated) {
        router.replace('/admin/login');
        return;
      }
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (!res.ok) {
        setError('Stats API failed. Use Reload demo data.');
        return;
      }
      setStats(await res.json());
      setError('');
    } catch {
      setError('Could not reach the API.');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadDemo() {
    setSeeding(true);
    const res = await fetch('/api/seed', { method: 'POST' });
    setSeeding(false);
    if (!res.ok) {
      setError('Demo seed failed — log in again.');
      return;
    }
    await load();
  }

  if (error && !stats) {
    return (
      <div className="glass-panel animate-soft-pop space-y-4 rounded-[28px] p-8">
        <p className="text-sm text-ember">{error}</p>
        <button
          type="button"
          onClick={loadDemo}
          className="rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-cream"
        >
          Load demo kitchen data
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center gap-3 text-sm text-ink/45">
        <span className="h-2 w-2 animate-pulse rounded-full bg-ember" />
        Loading kitchen pulse…
      </div>
    );
  }

  const cards = [
    { label: "Today's orders", value: stats.totals.todayOrders, hint: 'Fresh today' },
    { label: "Today's revenue", value: formatPrice(stats.totals.todayRevenue), hint: 'In the till' },
    { label: 'Pending orders', value: stats.totals.pending, hint: 'Needs action' },
    { label: 'All-time revenue', value: formatPrice(stats.totals.revenue), hint: 'Lifetime so far' },
    { label: 'Menu dishes', value: stats.totals.menuItems, hint: 'Live items' },
    { label: 'Active offers', value: stats.totals.activeOffers, hint: 'On site now' },
    { label: 'Feedback waiting', value: stats.totals.pendingFeedback, hint: 'Approve these' },
    { label: 'Total orders', value: stats.totals.orders, hint: 'All sources' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-ember">Overview</p>
          <h1 className="mt-2 font-display text-5xl leading-none tracking-tight">Dashboard</h1>
          <p className="mt-3 max-w-lg text-sm text-ink/55">
            A live pulse of the kitchen — orders, revenue, and what guests are craving.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadDemo}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide backdrop-blur hover:bg-white disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Loading…' : 'Reload demo'}
          </button>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-cream shadow-md shadow-ink/20 hover:bg-smoke"
          >
            Open orders <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-ember">{error}</p>}

      <div className="stagger-children mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="glass-panel shine-border group rounded-[24px] p-5 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">{card.label}</p>
            <p className="mt-3 font-display text-4xl leading-none">{card.value}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ember/80">
              <TrendingUp className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              {card.hint}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="glass-panel animate-float-in rounded-[28px] p-6 [animation-delay:120ms]">
          <h2 className="font-display text-3xl">Top dishes</h2>
          <ul className="mt-5 space-y-3">
            {stats.topDishes.length === 0 && (
              <li className="text-sm text-ink/50">No orders yet — hit Reload demo.</li>
            )}
            {stats.topDishes.map((dish, i) => (
              <li
                key={dish.id}
                className="flex items-center justify-between rounded-2xl bg-ink/[0.03] px-4 py-3 text-sm transition hover:bg-ink/[0.06]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-cream">
                    {i + 1}
                  </span>
                  {dish.name}
                </span>
                <span className="font-semibold text-ember">
                  {dish.qty} · {formatPrice(dish.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-panel animate-float-in rounded-[28px] p-6 [animation-delay:220ms]">
          <h2 className="font-display text-3xl">Recent orders</h2>
          <ul className="mt-5 space-y-3">
            {stats.recentOrders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-ink/5 bg-white/50 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{order.customerName}</span>
                  <span className="font-display text-lg text-ember">{formatPrice(order.totalPrice)}</span>
                </div>
                <p className="mt-1 text-ink/45">
                  {order.status} · {order.orderMode} · {order.totalItems} items
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
