"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createOrderAction } from "@/app/actions";
import { Send, Upload, RefreshCw, Loader2, WalletCards } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

const storage = getStorage(app);

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama harus memiliki minimal 2 karakter." }),
  contact: z.string().min(5, { message: "Info kontak (Email/Telepon) wajib diisi." }),
  service: z.string({ required_error: "Silakan pilih layanan." }),
  description: z.string().min(10, { message: "Deskripsi harus memiliki minimal 10 karakter." }).max(500),
});

type FormValues = z.infer<typeof formSchema>;

export default function OrderForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      description: "",
    },
  });

  useEffect(() => {
    // This cleanup function prevents memory leaks by revoking the object URL
    // when the component unmounts or when the preview dependency changes.
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: "destructive",
          title: "Ukuran file terlalu besar",
          description: "Ukuran file maksimal adalah 10MB.",
        });
        return;
      }
      setFile(selectedFile);
      // The useEffect will handle cleaning up the old preview URL.
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  async function onSubmit(data: FormValues) {
    if (!file) {
      toast({
        variant: "destructive",
        description: "Silakan unggah file foto atau video.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      const response = await createOrderAction({
        ...data,
        fileUrl: downloadURL,
      });

      if (response.success) {
        toast({
          title: "✅ Pesanan Terkirim!",
          description: "Kami telah menerima permintaan Anda. Silakan selesaikan pembayaran.",
        });
        setIsSuccess(true);
        form.reset();
        setFile(null);
        setPreview(null);
      } else {
        throw new Error(response.error || "Terjadi kesalahan saat memproses pesanan.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gagal mengirim pesanan. Silakan coba lagi.";
      toast({
        variant: "destructive",
        title: "Oh tidak! Terjadi kesalahan.",
        description: errorMessage,
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  const resetForm = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
    form.reset();
    setFile(null);
    setPreview(null); // This will also trigger the useEffect cleanup
  }

  if (isSuccess) {
    return (
      <Card className="p-6 md:p-8 bg-card">
        <div className="flex flex-col items-center text-center">
          <WalletCards className="h-16 w-16 text-primary mb-4" />
          <h3 className="text-2xl font-bold font-headline text-primary-foreground mb-2">Satu Langkah Terakhir: Pembayaran</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Pesanan Anda telah kami terima. Untuk memulai proses edit, silakan selesaikan pembayaran melalui salah satu metode di bawah ini.
          </p>
          
          <div className="w-full max-w-md text-left grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Transfer Bank</h4>
              <div className="text-sm">
                <p className="text-muted-foreground">Bank:</p>
                <p className="font-mono">BCA (Bank Central Asia)</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Nomor Rekening:</p>
                <p className="font-mono">1234567890</p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">Atas Nama:</p>
                <p className="font-mono">PT Jasa Edit AI</p>
              </div>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h4 className="font-semibold text-lg">QRIS</h4>
              <p className="text-sm text-muted-foreground">Scan kode di bawah ini menggunakan aplikasi e-wallet Anda (GoPay, OVO, Dana, dll).</p>
              <Image
                src="https://placehold.co/300x300.png"
                data-ai-hint="qr code"
                alt="Kode QRIS Pembayaran"
                width={200}
                height={200}
                className="mx-auto md:mx-0 rounded-lg border p-1"
              />
            </div>
          </div>

          <div className="w-full max-w-lg bg-secondary/50 rounded-lg p-4 text-sm mb-8">
            <h4 className="font-semibold mb-2">Penting: Konfirmasi Pembayaran</h4>
            <p className="text-muted-foreground">Setelah melakukan pembayaran, mohon kirimkan bukti transfer ke WhatsApp kami di <span className="font-mono text-primary">0812-3456-7890</span>. Hasil editan akan dikirimkan ke kontak yang Anda berikan dalam 1x24 jam setelah pembayaran dikonfirmasi.</p>
          </div>
          
          <Button onClick={resetForm} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" /> Buat Pesanan Baru
          </Button>
        </div>
      </Card>
    );
  }


  return (
    <Card className="p-6 md:p-8 bg-card">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Anda" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Nomor WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="email@contoh.com" {...field} disabled={isSubmitting}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Layanan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis editan yang Anda inginkan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Supercar Scene">Adegan Supercar</SelectItem>
                    <SelectItem value="Future Career Video">Video Karir Masa Depan</SelectItem>
                    <SelectItem value="AI Graduation Photo">Foto Wisuda AI</SelectItem>
                    <SelectItem value="Pet to Cartoon">Hewan Peliharaan Jadi Karakter Kartun</SelectItem>
                    <SelectItem value="Fantasy Portrait">Potret Fantasi/Pahlawan Super</SelectItem>
                    <SelectItem value="Other">Lainnya (Jelaskan di bawah)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi Tambahan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Contoh: Ubah latar belakang saya agar terlihat seperti di depan Ferrari merah."
                    className="resize-none"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormItem>
            <FormLabel>Unggah Foto/Video</FormLabel>
            <FormControl>
                <div className="relative">
                    <Input id="file-upload" type="file" accept="image/*,video/*" onChange={handleFileChange} className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer" disabled={isSubmitting}/>
                    <label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-background/50  transition-colors ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-secondary/60'}`}>
                        {preview ? (
                            <Image src={preview} alt="Pratinjau File" width={100} height={100} className="max-h-28 w-auto object-contain rounded-md" />
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold text-primary">Klik untuk mengunggah</span> atau seret dan lepas</p>
                                <p className="text-xs text-muted-foreground">Gambar atau Video (MAKS. 10MB)</p>
                            </div>
                        )}
                    </label>
                </div>
            </FormControl>
            <FormMessage />
          </FormItem>


          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Mengirim...' : 'Kirim Pesanan'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
