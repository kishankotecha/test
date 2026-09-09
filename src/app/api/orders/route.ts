import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db, generateId } from '@/lib/store';
import type { Order, OrderLine } from '@/types';
import { buildWhatsAppOrderMessage, generateWhatsAppLink, getPublicWhatsAppNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orders = await db.getOrders();
  return NextResponse.json(
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const settings = await db.getSettings();

  const items: OrderLine[] = Array.isArray(body.items) ? body.items : [];
  if (!body.customerName || !body.phone || items.length === 0) {
    return NextResponse.json(
      { error: 'Name, phone and at least one item are required' },
      { status: 400 }
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const order: Order = {
    id: generateId('QK'),
    customerName: String(body.customerName).trim(),
    phone: String(body.phone).trim(),
    address: body.address ? String(body.address).trim() : undefined,
    orderMode: body.orderMode === 'Delivery' ? 'Delivery' : 'Pickup',
    items,
    totalPrice,
    totalItems,
    note: body.note ? String(body.note).trim() : undefined,
    createdAt: new Date().toISOString(),
    status: 'pending',
    source: 'website',
  };

  const orders = await db.getOrders();
  orders.unshift(order);
  await db.saveOrders(orders);

  const message = buildWhatsAppOrderMessage(order);
  const whatsappUrl = generateWhatsAppLink(getPublicWhatsAppNumber(settings), message);

  return NextResponse.json({ order, whatsappUrl }, { status: 201 });
}

export async function PUT(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const orders = await db.getOrders();
  const index = orders.findIndex((o) => o.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  orders[index] = {
    ...orders[index],
    status: body.status ?? orders[index].status,
    note: body.note ?? orders[index].note,
  };
  await db.saveOrders(orders);
  return NextResponse.json(orders[index]);
}
