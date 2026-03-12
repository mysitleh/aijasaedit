"use client";

import { useState, useRef } from "react";
import { registerAffiliate } from "@/app/actions/affiliate";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  BadgeDollarSign,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Copy,
  Check,
  TrendingUp,
  Gift,
  Share2,
  Link2,
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    icon: Users,
    title: "Daftar Gratis",
    description: "Isi formulir pendaftaran singkat. Tidak ada biaya apapun.",
  },
  {
    icon: Link2,
    title: "Dapatkan Link Referral",
    description: "Setelah disetujui admin, Anda mendapat link unik untuk dibagikan.",
  },
  {
    icon: Share2,
    title: "Bagikan Link",
    description: "Sebarkan link referral Anda ke teman, keluarga, atau di media sosial.",
  },
  {
    icon: BadgeDollarSign,
    title: "Terima Komisi",
    description: "Setiap produk yang terjual melalui link Anda, Anda mendapat komisi 10%.",
  },
];

export default function AffiliatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultCode, setResultCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await registerAffiliate(formData);
    if (result.success) {
      setIsSuccess(true);
      setResultCode(result.referralCode || null);
      toast({
        title: "Pendaftaran Berhasil! 🎉",
        description: "Menunggu persetujuan admin. Kami akan menghubungi Anda.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Gagal Mendaftar",
        description: result.error,
      });
    }
    setIsSubmitting(false);
  };

  const copyCode = () => {
    if (resultCode) {
      navigator.clipboard.writeText(resultCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5" />
          <div className="container relative px-4 md:px-6 text-center">
            <Badge variant="secondary" className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-4 py-1.5">
              <Gift className="mr-1.5 h-3.5 w-3.5" />
              Program Affiliate
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline mb-4">
              Dapatkan{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-primary bg-clip-text text-transparent">
                Komisi 10%
              </span>
              <br />dari Setiap Referral
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-sm md:text-base mb-8">
              Bergabung dengan program affiliate AI Jasa Edit. Bagikan link unik Anda,
              dan dapatkan komisi untuk setiap pesanan yang berhasil masuk melalui referral Anda.
            </p>
            <div className="flex justify-center gap-3">
              <Button size="lg" asChild>
                <a href="#daftar">
                  Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/affiliate/dashboard">Cek Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="w-full py-12 md:py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-headline">
              Cara Kerja
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="absolute top-3 left-3 text-xs font-bold text-muted-foreground/50">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section id="daftar" className="w-full py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-lg">
              {isSuccess ? (
                <Card className="border-emerald-500/30 bg-emerald-500/5">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Pendaftaran Berhasil! 🎉</h3>
                    <p className="text-sm text-muted-foreground">
                      Pendaftaran Anda telah kami terima dan sedang menunggu persetujuan dari admin.
                      Kami akan menghubungi Anda via WhatsApp setelah akun Anda diaktifkan.
                    </p>
                    {resultCode && (
                      <div className="pt-4 space-y-2">
                        <p className="text-xs text-muted-foreground">Kode Referral Anda (akan aktif setelah di-approve):</p>
                        <div className="flex items-center justify-center gap-2">
                          <code className="bg-muted px-4 py-2 rounded-lg text-lg font-mono font-bold tracking-wider">
                            {resultCode}
                          </code>
                          <Button variant="outline" size="icon" onClick={copyCode} className="h-9 w-9">
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="pt-4 flex flex-col gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/affiliate/dashboard">Buka Dashboard Affiliate</Link>
                      </Button>
                      <Button variant="ghost" asChild>
                        <Link href="/">Kembali ke Beranda</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl font-headline">Daftar Sebagai Affiliator</CardTitle>
                    <CardDescription>
                      Isi data di bawah ini. Gratis, tanpa biaya apapun.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form ref={formRef} action={handleSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">
                          Nama Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Contoh: Budi Santoso"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@contoh.com"
                          required
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                          Digunakan untuk login ke dashboard affiliate Anda.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="whatsapp">
                          Nomor WhatsApp <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          placeholder="08123456789"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mendaftar...
                          </>
                        ) : (
                          <>
                            Daftar Affiliate <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="w-full py-12 md:py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-headline">
              Keuntungan Menjadi Affiliator
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-border bg-card hover:border-primary/40 transition-all">
                <CardContent className="p-6 text-center space-y-3">
                  <TrendingUp className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-bold">Komisi Kompetitif</h3>
                  <p className="text-sm text-muted-foreground">
                    Dapatkan 10% dari setiap transaksi yang berhasil melalui link referral Anda.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card hover:border-primary/40 transition-all">
                <CardContent className="p-6 text-center space-y-3">
                  <Gift className="h-8 w-8 mx-auto text-emerald-500" />
                  <h3 className="font-bold">Tanpa Modal</h3>
                  <p className="text-sm text-muted-foreground">
                    Pendaftaran gratis. Anda hanya perlu membagikan link, tanpa biaya apapun.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card hover:border-primary/40 transition-all">
                <CardContent className="p-6 text-center space-y-3">
                  <BadgeDollarSign className="h-8 w-8 mx-auto text-amber-500" />
                  <h3 className="font-bold">Pencairan Mudah</h3>
                  <p className="text-sm text-muted-foreground">
                    Komisi dicairkan langsung ke rekening Anda setelah diverifikasi admin.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
