'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Reveal } from '@/components/Reveal';
import type {
  Category,
  MenuItem,
  Offer,
  OrderLine,
  RestaurantSettings,
  Testimonial,
} from '@/types';

type CartKey = string;

function cartKey(menuItemId: string, variantId: string): CartKey {
  return `${menuItemId}::${variantId}`;
}

function parseCartKey(key: CartKey) {
  const [menuItemId, variantId] = key.split('::');
  return { menuItemId, variantId };
}

export default function QissaHome() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<Record<CartKey, number>>({});
  const [orderMode, setOrderMode] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const [settingsRes, categoriesRes, menuRes, offersRes, testimonialsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/categories'),
        fetch('/api/menu'),
        fetch('/api/offers'),
        fetch('/api/testimonials'),
      ]);
      const [settingsData, categoriesData, menuData, offersData, testimonialsData] = await Promise.all([
        settingsRes.json(),
        categoriesRes.json(),
        menuRes.json(),
        offersRes.json(),
        testimonialsRes.json(),
      ]);
      setSettings(settingsData);
      setCategories(categoriesData);
      setMenuItems(menuData);
      setOffers(offersData);
      setTestimonials(testimonialsData);

      const defaults: Record<string, string> = {};
      for (const item of menuData as MenuItem[]) {
        defaults[item.id] = item.variants[0]?.id || '';
      }
      setSelectedVariants(defaults);
    }
    load();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const visibleItems = useMemo(
    () =>
      activeCategory === 'all'
        ? menuItems
        : menuItems.filter((item) => item.categoryId === activeCategory),
    [activeCategory, menuItems]
  );

  const cartEntries = useMemo(() => {
    return Object.entries(cart)
      .map(([key, quantity]) => {
        const { menuItemId, variantId } = parseCartKey(key);
        const item = menuItems.find((m) => m.id === menuItemId);
        const variant = item?.variants.find((v) => v.id === variantId);
        if (!item || !variant || quantity <= 0) return null;
        return { key, item, variant, quantity };
      })
      .filter(Boolean) as Array<{
      key: string;
      item: MenuItem;
      variant: MenuItem['variants'][number];
      quantity: number;
    }>;
  }, [cart, menuItems]);

  const totalItems = cartEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalPrice = cartEntries.reduce(
    (sum, entry) => sum + entry.variant.price * entry.quantity,
    0
  );

  function updateQuantity(key: CartKey, delta: number) {
    setCart((current) => {
      const nextQuantity = Math.max(0, (current[key] ?? 0) + delta);
      const next = { ...current };
      if (nextQuantity === 0) delete next[key];
      else next[key] = nextQuantity;
      return next;
    });
  }

  function addSelected(item: MenuItem) {
    const variantId = selectedVariants[item.id] || item.variants[0]?.id;
    if (!variantId) return;
    updateQuantity(cartKey(item.id, variantId), 1);
  }

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    if (cartEntries.length === 0 || submitting) return;
    setSubmitting(true);

    const items: OrderLine[] = cartEntries.map((entry) => ({
      menuItemId: entry.item.id,
      name: entry.item.name,
      variantId: entry.variant.id,
      variantLabel: entry.variant.label,
      unitPrice: entry.variant.price,
      quantity: entry.quantity,
    }));

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        phone,
        address: orderMode === 'Delivery' ? address : undefined,
        orderMode,
        note,
        items,
      }),
    });

    setSubmitting(false);
    if (!res.ok) return;

    const data = await res.json();
    setWhatsappUrl(data.whatsappUrl);
    setOrderPlaced(true);
    window.open(data.whatsappUrl, '_blank');
  }

  async function submitFeedback(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: feedbackName,
        message: feedbackMessage,
        rating: 5,
      }),
    });
    setFeedbackName('');
    setFeedbackMessage('');
    setFeedbackSent(true);
  }

  const activeOffer = offers[0];
  const activeTestimonial = testimonials[testimonialIndex];

  return (
    <div className="min-h-screen bg-brand text-cream">
      <header className="sticky top-0 z-40 border-b border-cream/10 bg-brand/80 backdrop-blur-xl animate-rise-in">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-2xl tracking-tight sm:text-3xl">Qissa Khawani</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50">Stories served hot</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="#menu" className="hidden text-cream/70 transition hover:text-cream sm:inline">
              Menu
            </a>
            <a
              href="#order"
              className="inline-flex items-center gap-2 rounded-full bg-accent-hot px-3 py-1.5 text-xs font-semibold text-brand shadow-md shadow-accent-hot/30 transition hover:scale-[1.03] hover:brightness-110"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart {totalItems > 0 ? `(${totalItems})` : ''}
            </a>
          </div>
        </div>
      </header>

      {activeOffer && (
        <div className="overflow-hidden border-b border-saffron/30 bg-gradient-to-r from-saffron via-[#ffe566] to-saffron text-brand">
          <div className="marquee-track py-3 text-sm font-semibold">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center gap-10 px-6">
                <span>
                  <span className="font-bold">{activeOffer.title}</span> — {activeOffer.description}
                </span>
                {activeOffer.code && (
                  <span className="rounded-full border border-brand/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    Code {activeOffer.code}
                  </span>
                )}
                <span className="text-brand/40">★</span>
                <span>
                  <span className="font-bold">{activeOffer.title}</span> — {activeOffer.description}
                </span>
                {activeOffer.code && (
                  <span className="rounded-full border border-brand/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    Code {activeOffer.code}
                  </span>
                )}
                <span className="text-brand/40">★</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="relative overflow-hidden">
        <div className="hero-stripes absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise-in">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron">
              <Flame className="h-4 w-4" /> Indiranagar · Lucknowi kitchen
            </p>
            <h1 className="mt-5 max-w-[12ch] font-display text-5xl leading-[0.9] tracking-tight sm:text-7xl">
              STORIES <span className="text-accent-hot">SERVED HOT</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream/70">
              {settings?.tagline ||
                "We're an authentic north Indian eatery only trying to compete with your grandma at what we do."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-brand"
              >
                Browse menu <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#order"
                className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-4 py-2 text-sm font-semibold text-cream"
              >
                <MessageCircle className="h-4 w-4" /> Order on WhatsApp
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-cream/60">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-hot" /> {settings?.address || 'Indiranagar'}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-saffron" />
                {settings?.openingTime || '12pm'}–{settings?.closingTime || '11pm'}
              </span>
            </div>
          </div>

          <div className="relative animate-float-in [animation-delay:180ms]">
            <div className="relative aspect-[4/5] -skew-x-3 overflow-hidden border border-cream/10 bg-brand-2 shadow-2xl shadow-brand">
              <Image
                src="/menu/chicken-dum-biryani.png"
                alt="Lucknowi dum biryani at Qissa Khawani"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/80 via-transparent to-brand/10" />
            </div>
            <div className="animate-stamp-in absolute -bottom-5 -left-4 -skew-x-12 bg-saffron px-5 py-3 font-display text-2xl text-brand shadow-xl shadow-brand/40 [animation-delay:700ms]">
              <span className="skew-x-12">★ 4.9 · DIRECT ORDERS</span>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="bg-cream text-brand">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-hot">The kitchen list</p>
                <h2 className="mt-2 font-display text-5xl leading-none tracking-tight sm:text-7xl">
                  TASTE THE <span className="text-accent-hot">TALE</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm font-semibold leading-relaxed text-brand/50">
                Pick the portion, add to cart, and send a clean WhatsApp order — no 10-message back and forth.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Menu categories">
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-5 py-2.5 font-display text-lg transition-colors ${
                activeCategory === 'all' ? 'bg-brand text-cream' : 'bg-brand/10 text-brand'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 px-5 py-2.5 font-display text-lg transition-colors ${
                  activeCategory === category.id ? 'bg-brand text-cream' : 'bg-brand/10 text-brand'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, index) => {
              const selected = selectedVariants[item.id] || item.variants[0]?.id;
              const variant = item.variants.find((v) => v.id === selected) || item.variants[0];
              return (
                <Reveal key={item.id} delay={index * 55}>
                  <article className="menu-card-hover group overflow-hidden border border-brand/15 bg-background">
                    <div className="relative aspect-[4/3] overflow-hidden bg-brand-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand/50 to-transparent opacity-80" />
                      {item.tag && (
                        <span className="absolute left-4 top-4 animate-stamp-in bg-saffron px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-2xl leading-none">{item.name}</h3>
                        <span className="shrink-0 font-display text-xl text-accent-hot">
                          {formatPrice(variant?.price || 0)}
                        </span>
                      </div>
                      <p className="mt-3 min-h-12 text-sm leading-relaxed text-brand/60">{item.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.variants.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariants((s) => ({ ...s, [item.id]: v.id }))}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              selected === v.id
                                ? 'scale-105 bg-brand text-cream shadow-md'
                                : 'bg-brand/10 text-brand hover:bg-brand/20'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addSelected(item)}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent-hot px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand shadow-md shadow-accent-hot/20 hover:brightness-110"
                      >
                        Add to order <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-cream/10 bg-brand-2">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">Guest stories</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">What people keep saying</h2>
          </Reveal>
          {activeTestimonial ? (
            <Reveal delay={120}>
              <div
                key={activeTestimonial.id}
                className="mt-8 max-w-3xl animate-soft-pop border-l-4 border-accent-hot pl-6"
              >
                <div className="flex gap-1 text-saffron">
                  {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 font-display text-2xl leading-snug text-cream sm:text-3xl">
                  “{activeTestimonial.message}”
                </p>
                <p className="mt-4 text-sm uppercase tracking-[0.18em] text-cream/50">
                  {activeTestimonial.customerName}
                </p>
              </div>
            </Reveal>
          ) : (
            <p className="mt-6 text-cream/60">Be the first to leave a note after your order.</p>
          )}
        </div>
      </section>

      <section id="order" className="bg-brand">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <p className="inline-flex -skew-x-12 bg-accent-hot px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
              <span className="skew-x-12">Direct order</span>
            </p>
            <h2 className="mt-4 max-w-[10ch] font-display text-5xl leading-[0.9] tracking-tight sm:text-7xl">
              SKIP THE <span className="text-accent-hot">WAIT.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/70">
              Build your order here. We save it for the kitchen and open WhatsApp with everything filled —
              address, bill items, total. You only confirm and pay.
            </p>
            <div className="mt-8 space-y-4 border-l-4 border-accent-hot pl-5 text-sm text-cream/60">
              <p className="inline-flex items-center gap-2 font-bold text-cream">
                <MapPin className="h-4 w-4 text-accent-hot" /> {settings?.address || 'Indiranagar, Bengaluru'}
              </p>
              <p className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-saffron" /> WhatsApp {settings?.phone || '+91 96867 54003'}
              </p>
              <ol className="space-y-2 pt-2">
                <li>1. Add dishes with exact portions</li>
                <li>2. Share name / phone / address</li>
                <li>3. Tap send — WhatsApp opens with the full order</li>
                <li>4. Pay & send screenshot · kitchen confirms</li>
              </ol>
            </div>
          </Reveal>

          <Reveal delay={140}>
          <div className="rounded-[28px] border border-cream/10 bg-brand-2/90 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            {orderPlaced ? (
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-saffron text-brand">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="font-display text-3xl">Order ready for WhatsApp</h3>
                <p className="text-sm text-cream/65">
                  Your order is saved on our side. If WhatsApp didn’t open, use the button below.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-hot px-4 py-2 text-sm font-semibold text-brand"
                >
                  Open WhatsApp <ChevronRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setOrderPlaced(false);
                    setCart({});
                  }}
                  className="block w-full text-sm text-cream/50 underline"
                >
                  Place another order
                </button>
              </div>
            ) : (
              <form onSubmit={placeOrder} className="space-y-4">
                <div className="flex gap-2">
                  {(['Pickup', 'Delivery'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setOrderMode(mode)}
                      className={`flex-1 px-3 py-2 text-sm font-semibold ${
                        orderMode === mode ? 'bg-cream text-brand' : 'bg-brand text-cream/70'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="max-h-48 space-y-3 overflow-y-auto border border-cream/10 p-3">
                  {cartEntries.length === 0 && (
                    <p className="text-sm text-cream/50">Your cart is empty — add something delicious above.</p>
                  )}
                  {cartEntries.map((entry) => (
                    <div key={entry.key} className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-semibold">{entry.item.name}</p>
                        <p className="text-cream/50">
                          {entry.variant.label} · {formatPrice(entry.variant.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(entry.key, -1)}
                          className="bg-brand p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span>{entry.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(entry.key, 1)}
                          className="bg-brand p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-cream/15 bg-brand px-4 py-3 text-sm outline-none focus:border-accent-hot"
                />
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full border border-cream/15 bg-brand px-4 py-3 text-sm outline-none focus:border-accent-hot"
                />
                {orderMode === 'Delivery' && (
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Delivery address"
                    rows={2}
                    className="w-full border border-cream/15 bg-brand px-4 py-3 text-sm outline-none focus:border-accent-hot"
                  />
                )}
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note for kitchen (optional)"
                  rows={2}
                  className="w-full border border-cream/15 bg-brand px-4 py-3 text-sm outline-none focus:border-accent-hot"
                />

                <div className="flex items-center justify-between border-t border-cream/10 pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-cream/45">Total</p>
                    <p className="font-display text-3xl text-saffron">{formatPrice(totalPrice)}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={cartEntries.length === 0 || submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-accent-hot px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand disabled:opacity-50"
                  >
                    {submitting ? 'Sending…' : 'Send via WhatsApp'}
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream text-brand">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-4xl">Leave a qissa</h2>
            <p className="mt-3 text-sm text-brand/60">
              Loved the meal? Your note can become a live testimonial after we approve it.
            </p>
          </Reveal>
          {feedbackSent ? (
            <Reveal>
              <div className="rounded-[24px] border border-brand/15 bg-background p-6 animate-soft-pop">
                <p className="font-display text-2xl">Thank you.</p>
                <p className="mt-2 text-sm text-brand/60">We’ll review it and feature the best ones on the site.</p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={100}>
              <form onSubmit={submitFeedback} className="space-y-3 rounded-[24px] border border-brand/15 bg-background p-6 shadow-lg shadow-brand/5">
                <input
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm outline-none focus:border-accent-hot"
                />
                <textarea
                  required
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Tell us what hit different…"
                  rows={4}
                  className="w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-sm outline-none focus:border-accent-hot"
                />
                <button type="submit" className="rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream hover:brightness-110">
                  Submit feedback
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <footer className="border-t border-cream/10 bg-brand py-10 text-center text-sm text-cream/50">
        <p className="font-display text-2xl text-cream">Qissa Khawani</p>
        <p className="mt-2">{settings?.phone} · {settings?.address}</p>
        <a href="/admin/login" className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-cream/30 hover:text-cream/60">
          Kitchen admin
        </a>
      </footer>

      {totalItems > 0 && !orderPlaced && (
        <a
          href="#order"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 bg-accent-hot px-4 py-3 font-bold text-brand shadow-xl sm:hidden"
        >
          <ShoppingBag className="h-4 w-4" />
          {totalItems} · {formatPrice(totalPrice)}
        </a>
      )}
    </div>
  );
}
