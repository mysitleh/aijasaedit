import { z } from "zod";

export const siteSettingsSchema = z.object({
  whatsappNumber: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  bankName: z.string().min(1, "Nama Bank wajib diisi"),
  bankAccount: z.string().min(1, "Nomor Rekening wajib diisi"),
  bankHolder: z.string().min(1, "Nama Pemilik wajib diisi"),
  qrisImage: z.string().optional(),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;

export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "6281234567890",
  bankName: "BCA (Bank Central Asia)",
  bankAccount: "1234-5678-90",
  bankHolder: "PT Jasa Edit AI",
  qrisImage: "/qris-payment.webp",
};
