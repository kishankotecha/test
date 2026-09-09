import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/store';
import {
  defaultCategories,
  defaultMenu,
  defaultOffers,
  defaultOrders,
  defaultSettings,
  defaultTestimonials,
} from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await Promise.all([
    db.saveSettings(defaultSettings),
    db.saveCategories(defaultCategories),
    db.saveMenu(defaultMenu),
    db.saveOffers(defaultOffers),
    db.saveOrders(defaultOrders),
    db.saveTestimonials(defaultTestimonials),
  ]);

  return NextResponse.json({
    ok: true,
    message: 'Demo kitchen data loaded',
    counts: {
      categories: defaultCategories.length,
      menu: defaultMenu.length,
      offers: defaultOffers.length,
      orders: defaultOrders.length,
      testimonials: defaultTestimonials.length,
    },
  });
}
