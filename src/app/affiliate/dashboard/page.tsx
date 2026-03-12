"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getAffiliateByEmail,
  getAffiliateCommissions,
} from "@/app/actions/affiliate";
import type { Affiliate, CommissionLog } from "@/types/affiliate";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Search,
  Copy,
  Check,
  Users,
  BadgeDollarSign,
} from "lucide-react";
import { format } from "date-fns";

function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

export default function AffiliateDashboardPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [commissions, setCommissions] = useState<CommissionLog[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setNotFound(false);
    setAffiliate(null);

    try {
      const aff = await getAffiliateByEmail(email.trim().toLowerCase());
      if (!aff) {
        setNotFound(true);
        return;
      }
      setAffiliate(aff);
      const logs = await getAffiliateCommissions(aff.id);
      setCommissions(logs);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data. Coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const referralLink = affiliate
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${affiliate.referral_code}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({ title: "Link Disalin!", description: "Link referral Anda berhasil disalin." });
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Aktif</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Menunggu Persetujuan</Badge>;
      case "inactive":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Nonaktif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const paidTotal = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.commission_amount, 0);
  const pendingTotal = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.commission_amount, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 py-10 md:py-16">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold font-headline mb-2">
              Dashboard Affiliate
            </h1>
            <p className="text-muted-foreground text-sm">
              Masukkan email yang Anda gunakan saat pendaftaran untuk melihat data Anda.
            </p>
          </div>

          {/* Login Email */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="aff-email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    id="aff-email"
                    type="email"
                    placeholder="Masukkan email affiliate Anda..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" disabled={loading} className="sm:w-auto">
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Cari
                </Button>
              </form>
              {notFound && (
                <p className="text-sm text-destructive mt-3">
                  Email tidak ditemukan. Pastikan email yang Anda masukkan benar, atau{" "}
                  <Link href="/affiliate" className="underline font-semibold text-primary">
                    daftar dulu di sini
                  </Link>
                  .
                </p>
              )}
            </CardContent>
          </Card>

          {/* Dashboard Content */}
          {affiliate && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Profile & Status */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-lg">{affiliate.name}</CardTitle>
                      <CardDescription>{affiliate.email} · {affiliate.whatsapp}</CardDescription>
                    </div>
                    {getStatusBadge(affiliate.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {affiliate.status === "active" ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Kode Referral Anda</p>
                        <code className="text-lg font-mono font-bold tracking-widest bg-muted px-3 py-1 rounded-lg">
                          {affiliate.referral_code}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Link Referral</p>
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                          <code className="text-xs bg-muted px-3 py-2 rounded-lg break-all flex-1 border border-border">
                            {referralLink}
                          </code>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={copyLink}>
                              {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                              {copied ? "Tersalin" : "Salin"}
                            </Button>
                            <ShareButton 
                              url={referralLink} 
                              title="Bergabunglah dengan AI Jasa Edit!" 
                              text={`Dapatkan hasil edit foto & video AI keren. Gunakan kode referralku (${affiliate.referral_code})`}
                              variant="default"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Komisi: <span className="font-bold text-primary">{affiliate.commission_rate}%</span> per transaksi berhasil
                      </p>
                    </div>
                  ) : affiliate.status === "pending" ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      <p>Akun Anda sedang menunggu persetujuan dari admin.</p>
                      <p>Kami akan menghubungi Anda via WhatsApp setelah akun diaktifkan.</p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-destructive">
                      <p>Akun Anda saat ini tidak aktif. Hubungi admin untuk informasi.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              {affiliate.status === "active" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Referral</p>
                          <p className="text-xl font-bold">{affiliate.total_referrals}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <BadgeDollarSign className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Komisi Dibayar</p>
                          <p className="text-xl font-bold text-emerald-600">{formatRupiah(paidTotal)}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                          <BadgeDollarSign className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Komisi Pending</p>
                          <p className="text-xl font-bold text-yellow-600">{formatRupiah(pendingTotal)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Commission Log */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Riwayat Komisi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {commissions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                          Belum ada riwayat komisi. Bagikan link referral Anda untuk mulai mendapatkan komisi!
                        </div>
                      ) : (
                        <>
                          {/* Desktop */}
                          <div className="hidden sm:block overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Tanggal</TableHead>
                                  <TableHead>Layanan</TableHead>
                                  <TableHead>Komisi</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {commissions.map((c) => (
                                  <TableRow key={c.id}>
                                    <TableCell className="text-xs">
                                      {format(new Date(c.created_at), "dd MMM yyyy")}
                                    </TableCell>
                                    <TableCell className="text-sm">{c.order_service}</TableCell>
                                    <TableCell className="font-bold text-sm">
                                      {formatRupiah(c.commission_amount)}
                                    </TableCell>
                                    <TableCell>
                                      {c.status === "paid" ? (
                                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Dibayar</Badge>
                                      ) : (
                                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">Menunggu</Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {/* Mobile */}
                          <div className="grid grid-cols-1 gap-3 sm:hidden">
                            {commissions.map((c) => (
                              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                                <div>
                                  <p className="text-sm font-medium">{c.order_service}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {format(new Date(c.created_at), "dd MMM yyyy")}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold">{formatRupiah(c.commission_amount)}</p>
                                  {c.status === "paid" ? (
                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Dibayar</Badge>
                                  ) : (
                                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">Menunggu</Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
