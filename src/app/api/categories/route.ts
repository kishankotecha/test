import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db, generateId } from '@/lib/store';
import type { Category } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = await db.getCategories();
  const publicOnly = !getAdminSession();
  const data = publicOnly
    ? categories.filter((c) => c.active).sort((a, b) => a.sortOrder - b.sortOrder)
    : categories.sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const categories = await db.getCategories();
  const category: Category = {
    id: body.id || generateId('cat'),
    name: String(body.name || '').trim(),
    sortOrder: Number(body.sortOrder ?? categories.length + 1),
    active: body.active !== false,
  };

  if (!category.name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  categories.push(category);
  await db.saveCategories(categories);
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const categories = await db.getCategories();
  const index = categories.findIndex((c) => c.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  categories[index] = {
    ...categories[index],
    ...body,
    name: String(body.name ?? categories[index].name).trim(),
    sortOrder: Number(body.sortOrder ?? categories[index].sortOrder),
    active: body.active ?? categories[index].active,
  };
  await db.saveCategories(categories);
  return NextResponse.json(categories[index]);
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

  const categories = await db.getCategories();
  await db.saveCategories(categories.filter((c) => c.id !== id));
  return NextResponse.json({ ok: true });
}
