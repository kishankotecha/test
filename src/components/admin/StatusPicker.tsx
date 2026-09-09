'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import type { OrderStatus } from '@/types';

const statuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
];

const tone: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-900 ring-amber-200',
  confirmed: 'bg-sky-100 text-sky-900 ring-sky-200',
  preparing: 'bg-orange-100 text-orange-900 ring-orange-200',
  ready: 'bg-emerald-100 text-emerald-900 ring-emerald-200',
  delivered: 'bg-stone-200 text-stone-800 ring-stone-300',
  cancelled: 'bg-rose-100 text-rose-900 ring-rose-200',
};

export function StatusPicker({
  value,
  onChange,
}: {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function updatePosition() {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuWidth = 148;
    const left = Math.min(
      Math.max(12, rect.right - menuWidth),
      window.innerWidth - menuWidth - 12
    );
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < 220 && rect.top > spaceBelow;
    setCoords({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left,
    });
  }

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onDoc(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onReposition() {
      updatePosition();
    }

    document.addEventListener('mousedown', onDoc);
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [open]);

  const menu =
    open &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          transform:
            coords.top < (buttonRef.current?.getBoundingClientRect().top ?? 0)
              ? 'translateY(-100%)'
              : undefined,
          zIndex: 80,
        }}
        className="w-[148px] animate-slide-down rounded-xl border border-ink/10 bg-white p-1 shadow-xl shadow-ink/15"
      >
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              onChange(status);
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide transition ${
              value === status ? 'bg-ink text-cream' : 'text-ink/65 hover:bg-ink/5 hover:text-ink'
            }`}
          >
            {status}
            {value === status && <Check className="h-3 w-3 shrink-0" />}
          </button>
        ))}
      </div>,
      document.body
    );

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`status-chip ring-1 ${tone[value]}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {value}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {menu}
    </div>
  );
}
