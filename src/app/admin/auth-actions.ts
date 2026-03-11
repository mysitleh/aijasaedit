'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function getSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) throw new Error('ADMIN_SECRET_KEY is not set.');

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

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const submitted = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { error: 'ADMIN_PASSWORD belum dikonfigurasi. Tambahkan di Secrets.' };
  }
  if (!process.env.ADMIN_SECRET_KEY) {
    return { error: 'ADMIN_SECRET_KEY belum dikonfigurasi. Tambahkan di Secrets.' };
  }

  if (!submitted || submitted !== adminPassword) {
    return { error: 'Password salah. Silakan coba lagi.' };
  }

  try {
    const token = await getSessionToken();
    cookies().set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
  } catch {
    return { error: 'Gagal membuat sesi. Coba lagi.' };
  }

  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  cookies().delete(COOKIE_NAME);
  redirect('/admin-login');
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get(COOKIE_NAME);
    if (!session) return false;
    const expected = await getSessionToken();
    return session.value === expected;
  } catch {
    return false;
  }
}

