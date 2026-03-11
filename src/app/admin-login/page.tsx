'use client';

import { useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '../admin/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2, ShieldAlert, AlertTriangle } from 'lucide-react';
import Logo from '@/components/icons/logo';

function LoginContent() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const hasConfigError = searchParams.get('error') === 'config';

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo className="h-8 w-auto" />
        <div>
          <h1 className="text-2xl font-bold font-headline">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Masukkan password untuk melanjutkan</p>
        </div>
      </div>

      {hasConfigError && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-400">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Konfigurasi belum lengkap.</strong> Tambahkan <code className="font-mono text-xs bg-black/30 px-1 rounded">ADMIN_PASSWORD</code> dan <code className="font-mono text-xs bg-black/30 px-1 rounded">ADMIN_SECRET_KEY</code> di Secrets.
          </span>
        </div>
      )}

      <Card className="border border-border rounded-2xl shadow-xl shadow-black/20">
        <CardHeader className="pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-center text-base">Masuk sebagai Administrator</CardTitle>
          <CardDescription className="text-center text-xs">
            Hanya pemilik yang memiliki akses ke halaman ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password Admin</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                autoComplete="current-password"
                autoFocus
                disabled={isPending}
                className="h-11 rounded-xl"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 rounded-xl" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Masuk
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        <a href="/" className="hover:text-primary transition-colors">← Kembali ke situs utama</a>
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}

