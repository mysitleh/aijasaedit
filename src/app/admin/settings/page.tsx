"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSiteSettings, updateSiteSettings } from "@/app/actions/settings";
import { type SiteSettings, siteSettingsSchema, DEFAULT_SETTINGS } from "@/types/settings";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, ImageIcon } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: DEFAULT_SETTINGS,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        form.reset(data);
      } catch (error) {
        toast({ title: "Error", description: "Gagal memuat pengaturan", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, [form, toast]);

  async function onSubmit(data: SiteSettings) {
    setIsSaving(true);
    try {
      const result = await updateSiteSettings(data);
      if (result.success) {
        toast({ title: "Berhasil", description: "Pengaturan berhasil disimpan." });
      } else {
        toast({ title: "Gagal", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Terjadi kesalahan", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">Pengaturan Situs</h1>
        <p className="text-muted-foreground">Kelola nomor WhatsApp dan detail pembayaran pesanan.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontak WhatsApp</CardTitle>
              <CardDescription>Nomor tujuan pengiriman pesan pesanan dan konfirmasi pembayaran dari pelanggan.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="whatsappNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 628123456789" {...field} />
                    </FormControl>
                    <FormDescription>Gunakan format internasional (contoh: 628... bukan 08...)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Bank</CardTitle>
              <CardDescription>Informasi rekening untuk menerima pembayaran manual dari pelanggan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Bank</FormLabel>
                    <FormControl>
                      <Input placeholder="BCA / Mandiri / BNI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Rekening</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atas Nama</FormLabel>
                      <FormControl>
                        <Input placeholder="PT Jasa Edit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
              <CardTitle>QRIS URL (Opsional)</CardTitle>
              <CardDescription>Masukkan link gambar QRIS Anda.</CardDescription>
            </CardHeader>
            <CardContent>
               <FormField
                  control={form.control}
                  name="qrisImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Gambar QRIS</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Kosongkan jika tidak ingin memunculkan QRIS. Untuk saat ini hanya mendukung URL.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
