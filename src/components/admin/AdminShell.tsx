'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  BadgePercent,
  ClipboardList,
  MessageSquareQuote,
  Settings,
  LogOut,
  Flame,
} from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/offers', label: 'Offers', icon: BadgePercent },
  { href: '/admin/testimonials', label: 'Feedback', icon: MessageSquareQuote },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-canvas admin-grain relative min-h-screen text-ink">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 p-5 lg:block">
          <div className="ink-panel flex h-full flex-col overflow-hidden rounded-[28px] p-5 text-cream animate-float-in">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-ember to-saffron text-ink shadow-lg shadow-ember/30">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-3xl leading-none tracking-tight">Qissa</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-cream/45">Admin kitchen</p>
              </div>
            </div>

            <nav className="mt-10 space-y-1.5">
              {links.map(({ href, label, icon: Icon }, index) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`nav-pill group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold ${
                      active ? 'is-active text-white' : 'text-cream/65 hover:text-white'
                    }`}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <span className="nav-glow rounded-2xl" />
                    <Icon className="relative z-10 h-4 w-4" />
                    <span className="relative z-10">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 pt-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-saffron/80">Live kitchen</p>
                <p className="mt-2 font-display text-xl leading-tight">Orders sync from the website in real time.</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-cream/60 hover:border-white/25 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col px-3 py-4 sm:px-6 lg:pl-2 lg:pr-6 lg:pt-5">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                  pathname === href
                    ? 'bg-ink text-cream shadow-md shadow-ink/20'
                    : 'bg-white/70 text-ink/70 ring-1 ring-ink/10'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div key={pathname} className="w-full min-w-0 animate-rise-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
