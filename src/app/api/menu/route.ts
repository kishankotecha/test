import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db, generateId } from '@/lib/store';
import type { MenuItem, PriceVariant } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const menu = await db.getMenu();
  const publicOnly = !getAdminSession();
  return NextResponse.json(publicOnly ? menu.filter((item) => item.available) : menu);
}

export async function POST(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const variants: PriceVariant[] = Array.isArray(body.variants)
    ? body.variants.map((v: PriceVariant, i: number) => ({
        id: v.id || `v${i + 1}`,
        label: String(v.label || '').trim(),
        price: Number(v.price || 0),
      }))
    : [];

  const item: MenuItem = {
    id: body.id || generateId('dish'),
    name: String(body.name || '').trim(),
    categoryId: String(body.categoryId || ''),
    description: String(body.description || '').trim(),
    image: String(body.image || '/menu/chicken-dum-biryani.png'),
    tag: body.tag ? String(body.tag) : undefined,
    available: body.available !== false,
    variants,
  };

  if (!item.name || !item.categoryId || item.variants.length === 0) {
    return NextResponse.json(
      { error: 'Name, category and at least one price variant are required' },
      { status: 400 }
    );
  }

  const menu = await db.getMenu();
  menu.push(item);
  await db.saveMenu(menu);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const menu = await db.getMenu();
  const index = menu.findIndex((item) => item.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  menu[index] = {
    ...menu[index],
    ...body,
    name: String(body.name ?? menu[index].name).trim(),
    categoryId: String(body.categoryId ?? menu[index].categoryId),
    description: String(body.description ?? menu[index].description).trim(),
    image: String(body.image ?? menu[index].image),
    available: body.available ?? menu[index].available,
    variants: Array.isArray(body.variants) ? body.variants : menu[index].variants,
  };

  await db.saveMenu(menu);
  return NextResponse.json(menu[index]);
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

  const menu = await db.getMenu();
  await db.saveMenu(menu.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
