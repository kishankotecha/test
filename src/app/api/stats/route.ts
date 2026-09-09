import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [orders, menu, offers, testimonials, categories] = await Promise.all([
    db.getOrders(),
    db.getMenu(),
    db.getOffers(),
    db.getTestimonials(),
    db.getCategories(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = orders.filter((o) => o.createdAt.slice(0, 10) === today);
  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const todayRevenue = todaysOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const byStatus = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const topDishes = Object.entries(
    orders
      .flatMap((o) => o.items)
      .reduce<Record<string, { name: string; qty: number; revenue: number }>>((acc, item) => {
        const key = item.menuItemId;
        if (!acc[key]) acc[key] = { name: item.name, qty: 0, revenue: 0 };
        acc[key].qty += item.quantity;
        acc[key].revenue += item.unitPrice * item.quantity;
        return acc;
      }, {})
  )
    .map(([id, value]) => ({ id, ...value }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return NextResponse.json({
    totals: {
      orders: orders.length,
      todayOrders: todaysOrders.length,
      revenue,
      todayRevenue,
      pending: byStatus.pending || 0,
      menuItems: menu.length,
      categories: categories.length,
      activeOffers: offers.filter((o) => o.active).length,
      pendingFeedback: testimonials.filter((t) => !t.approved).length,
      approvedTestimonials: testimonials.filter((t) => t.approved).length,
    },
    byStatus,
    topDishes,
    recentOrders: orders.slice(0, 8),
  });
}
