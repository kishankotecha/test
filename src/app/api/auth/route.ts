import { NextResponse } from 'next/server';
import {
  clearSessionCookieOptions,
  createSessionToken,
  getAdminSession,
  sessionCookieOptions,
  verifyPassword,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ authenticated: getAdminSession() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password || '');

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearSessionCookieOptions());
  return response;
}
