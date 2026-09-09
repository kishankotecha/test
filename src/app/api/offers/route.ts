import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db, generateId } from '@/lib/store';
import type { Offer } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const offers = await db.getOffers();
  const publicOnly = !getAdminSession();
  return NextResponse.json(publicOnly ? offers.filter((o) => o.active) : offers);
}

export async function POST(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const offer: Offer = {
    id: body.id || generateId('offer'),
    title: String(body.title || '').trim(),
    description: String(body.description || '').trim(),
    code: body.code ? String(body.code).trim() : undefined,
    discountPercent: body.discountPercent ? Number(body.discountPercent) : undefined,
    active: body.active !== false,
    startsAt: body.startsAt,
    endsAt: body.endsAt,
  };

  if (!offer.title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const offers = await db.getOffers();
  offers.unshift(offer);
  await db.saveOffers(offers);
  return NextResponse.json(offer, { status: 201 });
}

export async function PUT(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const offers = await db.getOffers();
  const index = offers.findIndex((o) => o.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  offers[index] = { ...offers[index], ...body };
  await db.saveOffers(offers);
  return NextResponse.json(offers[index]);
}

export async function DELETE(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const offers = await db.getOffers();
  await db.saveOffers(offers.filter((o) => o.id !== id));
  return NextResponse.json({ ok: true });
}
