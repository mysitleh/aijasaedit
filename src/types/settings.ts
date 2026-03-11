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
  whatsappNumber: "6281353658705",
  bankName: "Bank BRI",
  bankAccount: "3896 0100 3715 509",
  bankHolder: "Hamada Zein",
  qrisImage: "/qris-payment.webp",
};
