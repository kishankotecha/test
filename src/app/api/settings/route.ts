import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await db.getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const current = await db.getSettings();
  const next = { ...current, ...body };
  await db.saveSettings(next);
  return NextResponse.json(next);
}
