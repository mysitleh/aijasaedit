import { z } from "zod";

// ── Affiliate Registration Schema ──
export const affiliateRegistrationSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Format email tidak valid."),
  whatsapp: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid.")
    .regex(/^[0-9+\-\s()]+$/, "Masukkan nomor yang valid."),
});

export type AffiliateRegistration = z.infer<typeof affiliateRegistrationSchema>;

// ── Affiliate Document (Firestore: 'affiliates') ──
export interface Affiliate {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  referral_code: string;
  commission_rate: number; // Persentase komisi (default 10)
  status: "active" | "inactive" | "pending";
  total_referrals: number;
  total_commission: number; // Dalam Rupiah
  created_at: string; // ISO date string
}

// ── Commission Log Document (Firestore: 'commissions') ──
export interface CommissionLog {
  id: string;
  affiliate_id: string;
  affiliate_name: string;
  referral_code: string;
  order_id: string;
  order_service: string;
  order_amount: string;
  commission_amount: number;
  status: "pending" | "paid";
  created_at: string;
}
