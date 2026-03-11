import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'admin_session';

async function getSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode('admin_session_v1');

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    const loginUrl = new URL('/admin-login', request.url);
    loginUrl.searchParams.set('error', 'config');
    return NextResponse.redirect(loginUrl);
  }

  const session = request.cookies.get(COOKIE_NAME);
  if (!session) {
    const loginUrl = new URL('/admin-login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const expected = await getSessionToken(secret);
  if (session.value !== expected) {
    const loginUrl = new URL('/admin-login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
