"use client";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Copy,
  MessageCircle,
  X,
  Sparkles,
  User,
  CreditCard,
  ImageIcon,
  PenLine,
  Loader2,
} from "lucide-react";
import type { Service } from "@/app/actions";
import { createOrderAction } from "@/app/actions";
import { HARDCODED_SERVICES, SITE_CONFIG } from "@/data/site-config";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, label: "Layanan", icon: Sparkles },
  { id: 2, label: "Data Diri", icon: User },
  { id: 3, label: "Detail", icon: ImageIcon },
  { id: 4, label: "Bayar", icon: CreditCard },
];

const personalSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid.")
    .regex(/^[0-9+\-\s()]+$/, "Masukkan nomor yang valid."),
  email: z.string().email("Format email salah.").optional().or(z.literal("")),
});

const detailSchema = z.object({
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter.")
    .max(600, "Deskripsi maksimal 600 karakter."),
});

type PersonalValues = z.infer<typeof personalSchema>;
type DetailValues = z.infer<typeof detailSchema>;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const done = current > step.id;
        const active = current === step.id;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted-foreground/30 text-muted-foreground/50"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-14 mx-1 mb-4 rounded-full transition-all duration-300 ${
                  current > step.id ? "bg-primary" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-primary hover:bg-primary/10 transition-colors"
      title="Salin"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

import type { SiteSettings } from "@/types/settings";

export default function OrderForm({ 
  services: firebaseServices,
  settings 
}: { 
  services: Service[],
  settings: SiteSettings 
}) {
  const services = firebaseServices.length > 0 ? firebaseServices : HARDCODED_SERVICES;
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customServiceName, setCustomServiceName] = useState("");
  const [customNameError, setCustomNameError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [personal, setPersonal] = useState<PersonalValues | null>(null);
  const [description, setDescription] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Baca referral code dari URL (?ref=KODE)
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  const effectiveServiceTitle = isOtherSelected
    ? customServiceName || "Layanan Lainnya"
    : selectedService?.title ?? "";
  const effectiveServicePrice = isOtherSelected
    ? "Diskusi"
    : selectedService?.price ?? "";

  const personalForm = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: { name: "", whatsapp: "", email: "" },
  });

  const detailForm = useForm<DetailValues>({
    resolver: zodResolver(detailSchema),
    defaultValues: { description: "" },
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileError(null);
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) {
      setFileError("Ukuran file maksimal 15MB.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, [preview]);

  const removeFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const goToStep2 = () => {
    if (!selectedService && !isOtherSelected) return;
    if (isOtherSelected) {
      if (!customServiceName.trim()) {
        setCustomNameError("Jelaskan layanan yang Anda inginkan.");
        return;
      }
      setCustomNameError(null);
    }
    setStep(2);
  };

  const onPersonalSubmit = (data: PersonalValues) => {
    setPersonal(data);
    setStep(3);
  };

  const onDetailSubmit = async (data: DetailValues) => {
    if (!file) {
      setFileError("Silakan unggah foto atau video Anda.");
      return;
    }
    
    setIsSubmitting(true);
    setFileError(null);

    console.log("Memulai pengunggahan file:", file.name, file.size);

    // Validasi ukuran file di sisi client (15MB)
    if (file.size > 15 * 1024 * 1024) {
      setFileError("Ukuran file terlalu besar. Maksimal 15MB.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Pastikan Firebase sudah siap
      if (!storage || !storage.app) {
        throw new Error("Firebase Storage tidak terdeteksi. Periksa konfigurasi .env");
      }

      let fileUrl = "";
      
      // 1. Upload file ke Firebase Storage
      const fileRef = ref(storage, `orders/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(uploadResult.ref);
      
      console.log("File berhasil diunggah, URL:", fileUrl);

      // 2. Simpan order ke Firestore via Server Action
      const result = await createOrderAction({
        name: personal?.name || "Customer",
        contact: personal?.whatsapp || "No Contact",
        service: effectiveServiceTitle,
        description: data.description,
        fileUrl: fileUrl,
        referralCode: referralCode || undefined,
      });

      if (result.success) {
        console.log("Pesanan berhasil dicatat di Firestore.");
        setDescription(data.description);
        setStep(4);
        toast({
          title: "Sukses!",
          description: "Pesanan Anda telah kami terima.",
        });
      } else {
        console.error("Gagal simpan Firestore:", result.error);
        setFileError(result.error || "Gagal mencatat pesanan. Silakan hubungi admin.");
        toast({
          variant: "destructive",
          title: "Gagal Mengirim",
          description: result.error || "Gagal mencatat pesanan.",
        });
      }
    } catch (error: any) {
      console.error("Proses Pesanan Gagal:", error);
      const msg = error.message?.includes("storage/unauthorized") 
        ? "Izin ditolak oleh Firebase Storage. Pastikan Security Rules sudah diset." 
        : "Terjadi kesalahan koneksi. Pastikan internet stabil dan periksa konfigurasi Firebase.";
      
      setFileError(msg);
      toast({
        variant: "destructive",
        title: "Koneksi Bermasalah",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      "Halo, saya ingin konfirmasi pembayaran pesanan:",
      "",
      `*Nama:* ${personal?.name}`,
      `*WhatsApp:* ${personal?.whatsapp}`,
      personal?.email ? `*Email:* ${personal.email}` : "",
      `*Layanan:* ${effectiveServiceTitle} (${effectiveServicePrice})`,
      `*Deskripsi:* ${description}`,
      `*File:* ${file?.name}`,
      "",
      "Saya sudah melakukan pembayaran dan akan melampirkan bukti transfer + file foto/video saya di sini.",
    ]
      .filter((l) => l !== null)
      .join("\n");
    return encodeURIComponent(lines);
  };

  const openWhatsApp = () => {
    const msg = buildWhatsAppMessage();
    // Gunakan nomor WA dari settings yang bisa diubah via Admin
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

  return (
    <Card className="bg-card border border-border rounded-2xl overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <StepIndicator current={step} />

        {/* Referral Badge */}
        {referralCode && (
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in-up">
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-3 py-1 text-xs font-semibold">
              🎁 Referral: {referralCode}
            </Badge>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold text-foreground">Pilih Layanan</h3>
              <p className="text-sm text-muted-foreground mt-1">Pilih salah satu layanan di bawah ini</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((svc) => {
                const isSelected = !isOtherSelected && selectedService?.id === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setSelectedService(svc);
                      setIsOtherSelected(false);
                      setCustomNameError(null);
                    }}
                    className={`group flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={svc.image_placeholder}
                        alt={svc.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{svc.title}</p>
                        {isSelected && (
                          <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{svc.description}</p>
                      <Badge
                        variant={isSelected ? "default" : "secondary"}
                        className="mt-1.5 text-xs font-bold"
                      >
                        {svc.price}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground">atau</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOtherSelected(true);
                setSelectedService(null);
                setCustomNameError(null);
              }}
              className={`w-full flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 ${
                isOtherSelected
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-dashed border-border bg-card"
              }`}
            >
              <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                isOtherSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {isOtherSelected ? <Check className="h-5 w-5" /> : <PenLine className="h-5 w-5" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Layanan Lainnya</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Punya permintaan khusus yang belum ada di daftar? Ceritakan di sini.
                </p>
              </div>
              {!isOtherSelected && (
                <Badge variant="outline" className="flex-shrink-0 text-xs">Kustom</Badge>
              )}
            </button>

            {isOtherSelected && (
              <div className="space-y-1.5 animate-fade-in-up">
                <label className="text-sm font-medium text-foreground">
                  Ceritakan layanan yang Anda inginkan <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Contoh: Edit foto pernikahan dengan gaya vintage Jepang..."
                  value={customServiceName}
                  onChange={(e) => {
                    setCustomServiceName(e.target.value);
                    if (e.target.value.trim()) setCustomNameError(null);
                  }}
                  className={customNameError ? "border-destructive" : ""}
                />
                {customNameError && (
                  <p className="text-xs text-destructive">{customNameError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Harga akan didiskusikan setelah kami memahami kebutuhan Anda.
                </p>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={goToStep2}
              disabled={!selectedService && !isOtherSelected}
            >
              Lanjut <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold text-foreground">Data Diri</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Isi data Anda agar kami bisa menghubungi setelah pesanan selesai
              </p>
            </div>
            {(selectedService || isOtherSelected) && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 p-3">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-sm font-medium text-primary">{effectiveServiceTitle}</span>
                  <span className="mx-2 text-muted-foreground">·</span>
                  <span className="text-sm font-bold text-primary">{effectiveServicePrice}</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="ml-auto text-muted-foreground hover:text-foreground text-xs underline flex-shrink-0"
                >
                  Ganti
                </button>
              </div>
            )}
            <Form {...personalForm}>
              <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
                <FormField
                  control={personalForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Budi Santoso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nomor WhatsApp <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 08123456789" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Hasil editan akan dikirim ke nomor ini.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={personalForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-muted-foreground text-xs">(opsional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="email@contoh.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/3"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button type="submit" className="flex-1">
                    Lanjut <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in-up">
            <div className="text-center mb-2">
              <h3 className="text-lg font-bold text-foreground">Unggah Foto & Deskripsi</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Unggah foto/video Anda dan jelaskan keinginan Anda
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">
                Unggah Foto/Video <span className="text-destructive">*</span>
              </p>
              {!file ? (
                <label
                  htmlFor="file-upload"
                  className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border rounded-xl bg-background/50 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center px-4">
                    <span className="font-semibold text-primary">Klik untuk memilih</span> atau seret file ke sini
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, MP4, MOV — maks. 15MB
                  </p>
                </label>
              ) : (
                <div className="relative group rounded-xl overflow-hidden border border-border bg-background/50 flex items-center gap-3 p-3">
                  {preview && file.type.startsWith("image/") ? (
                    <Image
                      src={preview}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center rounded-lg bg-secondary flex-shrink-0">
                      <ImageIcon className="h-7 w-7 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {fileError && <p className="text-xs text-destructive mt-1.5">{fileError}</p>}
            </div>

            <Form {...detailForm}>
              <form onSubmit={detailForm.handleSubmit(onDetailSubmit)} className="space-y-4">
                <FormField
                  control={detailForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Deskripsi Pesanan <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Contoh: Saya ingin background diganti menjadi pemandangan Paris saat malam hari, dengan efek bokeh yang indah. Tolong pertahankan wajah asli saya."
                          className="resize-none min-h-[110px]"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <FormMessage />
                        <span className="text-xs text-muted-foreground ml-auto">
                          {field.value.length}/600
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/3"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim Pesanan...
                      </>
                    ) : (
                      <>
                        Lanjut ke Pembayaran <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground">Selesaikan Pembayaran</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Lakukan pembayaran terlebih dahulu, lalu konfirmasi via WhatsApp
              </p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Pesanan Anda</p>
                  <p className="font-bold text-foreground">{effectiveServiceTitle}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">untuk {personal?.name} · WA {personal?.whatsapp}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-2xl font-black text-primary">{effectiveServicePrice}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                  Transfer Bank
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Bank</p>
                    <p className="font-semibold">{settings.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nomor Rekening</p>
                    <div className="flex items-center">
                      <p className="font-mono font-bold tracking-wider">{settings.bankAccount}</p>
                      <CopyButton text={settings.bankAccount.replace(/-/g, "")} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Atas Nama</p>
                    <p className="font-semibold">{settings.bankHolder}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-2">
                <h4 className="text-sm font-semibold flex items-center gap-1.5 self-start">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                  QRIS
                </h4>
                <p className="text-xs text-muted-foreground text-center">
                  Scan dengan GoPay, OVO, Dana, ShopeePay, dll.
                </p>
                {settings.qrisImage && (
                  <Image
                    src={settings.qrisImage}
                    alt="QRIS Pembayaran"
                    width={140}
                    height={140}
                    className="rounded-lg border p-1 bg-white"
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                ⚠️ Penting — Baca Sebelum Bayar
              </h4>
              <ul className="space-y-1.5">
                {SITE_CONFIG.payment.notes.map((note, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold mt-0.5">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border-2 border-green-500/40 bg-green-500/5 p-5 text-center space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Setelah membayar, klik tombol di bawah untuk mengirim bukti bayar &amp; file Anda ke WhatsApp kami
              </p>
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-base h-12"
                onClick={openWhatsApp}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Konfirmasi via WhatsApp
              </Button>
              <p className="text-xs text-muted-foreground">
                WhatsApp akan terbuka dengan detail pesanan Anda. Lampirkan bukti bayar &amp; foto/video Anda di sana.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground"
                onClick={() => setStep(3)}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Kembali
              </Button>
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => {
                  setStep(1);
                  setSelectedService(null);
                  setIsOtherSelected(false);
                  setCustomServiceName("");
                  setCustomNameError(null);
                  setFile(null);
                  setPreview(null);
                  setPersonal(null);
                  setDescription("");
                  personalForm.reset();
                  detailForm.reset();
                }}
              >
                Buat Pesanan Baru
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
