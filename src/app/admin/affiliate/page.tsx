"use client";

import { useState, useEffect } from "react";
import {
  getAffiliates,
  updateAffiliateStatus,
  deleteAffiliate,
  getAllCommissionLogs,
  updateCommissionStatus,
} from "./actions";
import type { Affiliate, CommissionLog } from "@/types/affiliate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  BadgeDollarSign,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";

function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
}

export default function AdminAffiliatePage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<CommissionLog[]>([]);
  const [loadingAff, setLoadingAff] = useState(true);
  const [loadingComm, setLoadingComm] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoadingAff(true);
    setLoadingComm(true);
    try {
      const [affData, commData] = await Promise.all([
        getAffiliates(),
        getAllCommissionLogs(),
      ]);
      setAffiliates(affData);
      setCommissions(commData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data.",
      });
    } finally {
      setLoadingAff(false);
      setLoadingComm(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: "active" | "inactive" | "pending"
  ) => {
    const result = await updateAffiliateStatus(id, status);
    if (result.success) {
      toast({ title: "Sukses", description: `Status berhasil diperbarui.` });
      setAffiliates((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus affiliator ini?")) return;
    setDeletingId(id);
    const result = await deleteAffiliate(id);
    if (result.success) {
      toast({ title: "Sukses", description: "Affiliator berhasil dihapus." });
      setAffiliates((prev) => prev.filter((a) => a.id !== id));
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
    setDeletingId(null);
  };

  const handleCommissionStatusChange = async (
    id: string,
    status: "pending" | "paid"
  ) => {
    const result = await updateCommissionStatus(id, status);
    if (result.success) {
      toast({ title: "Sukses", description: "Status komisi diperbarui." });
      setCommissions((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "";
    }
  };

  // Stats
  const totalActive = affiliates.filter((a) => a.status === "active").length;
  const totalPending = affiliates.filter((a) => a.status === "pending").length;
  const totalCommPending = commissions
    .filter((c) => c.status === "pending")
    .reduce((s, c) => s + c.commission_amount, 0);
  const totalCommPaid = commissions
    .filter((c) => c.status === "paid")
    .reduce((s, c) => s + c.commission_amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Aktif</p>
              <p className="text-xl font-bold">{totalActive}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{totalPending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Komisi Dibayar</p>
              <p className="text-lg font-bold text-emerald-600">
                {formatRupiah(totalCommPaid)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <BadgeDollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Komisi Pending</p>
              <p className="text-lg font-bold text-amber-600">
                {formatRupiah(totalCommPending)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Affiliates List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Affiliator</CardTitle>
          <CardDescription>
            Kelola semua affiliator yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Affiliator</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Referral</TableHead>
                  <TableHead>Komisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingAff
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={7}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : affiliates.length > 0
                  ? affiliates.map((aff) => (
                      <TableRow key={aff.id}>
                        <TableCell>
                          <p className="font-semibold text-sm">{aff.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(aff.created_at), "dd MMM yyyy")}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs">{aff.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {aff.whatsapp}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <code className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded">
                              {aff.referral_code}
                            </code>
                            <button
                              onClick={() => copyCode(aff.referral_code)}
                              className="text-muted-foreground hover:text-primary"
                            >
                              {copiedCode === aff.referral_code ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {aff.total_referrals}
                        </TableCell>
                        <TableCell className="text-sm font-semibold">
                          {formatRupiah(aff.total_commission)}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={aff.status}
                            onValueChange={(v) =>
                              handleStatusChange(
                                aff.id,
                                v as "active" | "inactive" | "pending"
                              )
                            }
                          >
                            <SelectTrigger
                              className={`h-8 w-[110px] text-xs font-bold ${getStatusColor(
                                aff.status
                              )}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">ACTIVE</SelectItem>
                              <SelectItem value="pending">PENDING</SelectItem>
                              <SelectItem value="inactive">INACTIVE</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="icon"
                              asChild
                              className="h-8 w-8 text-green-600 border-green-500/30 hover:bg-green-500/10"
                            >
                              <a
                                href={`https://wa.me/${aff.whatsapp.replace(
                                  /[^0-9]/g,
                                  ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </a>
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(aff.id)}
                              disabled={deletingId === aff.id}
                            >
                              {deletingId === aff.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center h-24 text-muted-foreground"
                      >
                        Belum ada affiliator terdaftar.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {loadingAff
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))
              : affiliates.length > 0
              ? affiliates.map((aff) => (
                  <Card key={aff.id} className="overflow-hidden">
                    <div
                      className={`h-1.5 w-full ${
                        aff.status === "active"
                          ? "bg-green-500"
                          : aff.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{aff.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {aff.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            WA: {aff.whatsapp}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ${getStatusColor(aff.status)}`}
                        >
                          {aff.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between bg-muted/50 p-2.5 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Kode</p>
                          <code className="font-mono font-bold text-sm">
                            {aff.referral_code}
                          </code>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Referral: <span className="font-bold">{aff.total_referrals}</span>
                          </p>
                          <p className="text-sm font-bold text-primary">
                            {formatRupiah(aff.total_commission)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <Select
                          defaultValue={aff.status}
                          onValueChange={(v) =>
                            handleStatusChange(
                              aff.id,
                              v as "active" | "inactive" | "pending"
                            )
                          }
                        >
                          <SelectTrigger
                            className={`h-8 w-[110px] text-xs font-bold ${getStatusColor(
                              aff.status
                            )}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">ACTIVE</SelectItem>
                            <SelectItem value="pending">PENDING</SelectItem>
                            <SelectItem value="inactive">INACTIVE</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-green-600 border-green-500/30"
                          >
                            <a
                              href={`https://wa.me/${aff.whatsapp.replace(
                                /[^0-9]/g,
                                ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(aff.id)}
                            disabled={deletingId === aff.id}
                          >
                            {deletingId === aff.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              : (
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                  Belum ada affiliator terdaftar.
                </div>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Commission Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Log Komisi</CardTitle>
          <CardDescription>
            Riwayat komisi dari semua affiliator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Affiliator</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Komisi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingComm
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : commissions.length > 0
                  ? commissions.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="text-xs">
                          {format(new Date(c.created_at), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {c.affiliate_name}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{c.referral_code}</code>
                        </TableCell>
                        <TableCell className="text-sm">
                          {c.order_service}
                        </TableCell>
                        <TableCell className="font-bold text-sm">
                          {formatRupiah(c.commission_amount)}
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={c.status}
                            onValueChange={(v) =>
                              handleCommissionStatusChange(
                                c.id,
                                v as "pending" | "paid"
                              )
                            }
                          >
                            <SelectTrigger
                              className={`h-8 w-[110px] text-xs font-bold ${
                                c.status === "paid"
                                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              }`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">PENDING</SelectItem>
                              <SelectItem value="paid">PAID</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  :(
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center h-24 text-muted-foreground"
                      >
                        Belum ada log komisi.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {loadingComm
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              : commissions.length > 0
              ? commissions.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-border bg-card space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold">
                          {c.affiliate_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.order_service} ·{" "}
                          {format(new Date(c.created_at), "dd MMM yyyy")}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-primary">
                        {formatRupiah(c.commission_amount)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                        {c.referral_code}
                      </code>
                      <Select
                        defaultValue={c.status}
                        onValueChange={(v) =>
                          handleCommissionStatusChange(
                            c.id,
                            v as "pending" | "paid"
                          )
                        }
                      >
                        <SelectTrigger
                          className={`h-7 w-[100px] text-xs font-bold ${
                            c.status === "paid"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">PENDING</SelectItem>
                          <SelectItem value="paid">PAID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              : (
                <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-xl">
                  Belum ada log komisi.
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
