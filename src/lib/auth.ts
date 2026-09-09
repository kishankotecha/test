import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'qk_admin_session';

function getSecret() {
  return process.env.ADMIN_SECRET || 'qissa-khawani-dev-secret';
}

function getPassword() {
  return process.env.ADMIN_PASSWORD || 'qissaadmin';
}

export function createSessionToken() {
  return crypto.createHmac('sha256', getSecret()).update(getPassword()).digest('hex');
}

export function verifyPassword(password: string) {
  return password === getPassword();
}

export function isValidSessionToken(token?: string | null) {
  if (!token) return false;
  return token === createSessionToken();
}

export function getAdminSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
}

export { COOKIE_NAME };
