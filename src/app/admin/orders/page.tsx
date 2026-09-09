'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, StickyNote } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { StatusPicker } from '@/components/admin/StatusPicker';
import type { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const auth = await fetch('/api/auth', { cache: 'no-store' });
    const { authenticated } = await auth.json();
    if (!authenticated) {
      router.replace('/admin/login');
      return;
    }
    const res = await fetch('/api/orders', { cache: 'no-store' });
    if (res.ok) setOrders(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((current) => current.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  }

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-ember">WhatsApp-ready</p>
      <h1 className="mt-2 font-display text-4xl leading-none sm:text-5xl">Orders</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink/55">
        Website orders land here with full item details. Guests also get a pre-filled WhatsApp message for
        confirmation and payment.
      </p>

      <div className="stagger-children mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        {orders.length === 0 && (
          <div className="glass-panel rounded-2xl border-dashed p-6 text-sm text-ink/55 sm:rounded-[28px] sm:p-10">
            No orders yet. When a guest places an order on the site, it appears here automatically.
          </div>
        )}
        {orders.map((order) => (
          <article
            key={order.id}
            className="glass-panel rounded-2xl p-4 transition duration-300 hover:shadow-lg hover:shadow-ink/10 sm:rounded-[28px] sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl leading-none sm:text-3xl">{order.customerName}</h2>
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink/50">
                    {order.source}
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5 text-sm text-ink/55 sm:mt-3 sm:flex-row sm:flex-wrap sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 break-all">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-ember" /> {order.phone}
                  </span>
                  <span>{order.orderMode}</span>
                  {order.address && (
                    <span className="inline-flex items-start gap-1.5">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-saffron" />
                      <span className="break-words">{order.address}</span>
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-ink/35 break-all">{order.id}</p>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-ink/5 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                <p className="font-display text-2xl text-ember sm:text-3xl">{formatPrice(order.totalPrice)}</p>
                <StatusPicker value={order.status} onChange={(status) => updateStatus(order.id, status)} />
              </div>
            </div>

            <ul className="mt-4 grid gap-2">
              {order.items.map((item, idx) => (
                <li
                  key={`${order.id}-${idx}`}
                  className="rounded-xl bg-ink/[0.03] px-3 py-2.5 text-sm sm:rounded-2xl sm:px-4 sm:py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block font-semibold leading-snug">{item.name}</span>
                      <span className="mt-0.5 block text-xs text-ink/45 sm:text-sm">
                        {item.variantLabel} × {item.quantity}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-ink/70">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {order.note && (
              <p className="mt-3 inline-flex max-w-full items-start gap-2 rounded-xl bg-saffron/15 px-3 py-2 text-sm text-ink/70 sm:rounded-2xl">
                <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                <span className="break-words">{order.note}</span>
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
