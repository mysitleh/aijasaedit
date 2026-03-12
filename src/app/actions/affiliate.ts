"use server";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import {
  affiliateRegistrationSchema,
  type Affiliate,
  type CommissionLog,
} from "@/types/affiliate";

// ── Generate unique referral code ──
function generateReferralCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${random}`;
}

// ── Register new affiliate ──
export async function registerAffiliate(formData: FormData) {
  if (!isFirebaseEnabled) {
    return { success: false, error: "Firebase belum dikonfigurasi." };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validation = affiliateRegistrationSchema.safeParse(rawData);

  if (!validation.success) {
    const errorMessage = validation.error.issues.map((i) => i.message).join(", ");
    return { success: false, error: errorMessage };
  }

  const { name, email, whatsapp } = validation.data;

  try {
    // Cek apakah email sudah terdaftar
    const existingQuery = query(
      collection(db, "affiliates"),
      where("email", "==", email)
    );
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      return { success: false, error: "Email ini sudah terdaftar sebagai affiliator." };
    }

    // Generate kode referral unik
    let referralCode = generateReferralCode(name);

    // Pastikan kode unik
    const codeQuery = query(
      collection(db, "affiliates"),
      where("referral_code", "==", referralCode)
    );
    const codeDocs = await getDocs(codeQuery);
    if (!codeDocs.empty) {
      referralCode = generateReferralCode(name + Math.random().toString());
    }

    await addDoc(collection(db, "affiliates"), {
      name,
      email,
      whatsapp,
      referral_code: referralCode,
      commission_rate: 10, // Default 10%
      status: "pending",
      total_referrals: 0,
      total_commission: 0,
      created_at: serverTimestamp(),
    });

    return { success: true, referralCode };
  } catch (error) {
    console.error("Error registering affiliate:", error);
    return { success: false, error: "Gagal mendaftar. Silakan coba lagi." };
  }
}

// ── Get affiliate by referral code ──
export async function getAffiliateByCode(
  code: string
): Promise<Affiliate | null> {
  if (!isFirebaseEnabled || !code) return null;

  try {
    const q = query(
      collection(db, "affiliates"),
      where("referral_code", "==", code),
      where("status", "==", "active")
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      referral_code: data.referral_code,
      commission_rate: data.commission_rate,
      status: data.status,
      total_referrals: data.total_referrals || 0,
      total_commission: data.total_commission || 0,
      created_at: data.created_at?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching affiliate by code:", error);
    return null;
  }
}

// ── Get affiliate by email (untuk dashboard affiliator) ──
export async function getAffiliateByEmail(
  email: string
): Promise<Affiliate | null> {
  if (!isFirebaseEnabled || !email) return null;

  try {
    const q = query(
      collection(db, "affiliates"),
      where("email", "==", email)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      referral_code: data.referral_code,
      commission_rate: data.commission_rate,
      status: data.status,
      total_referrals: data.total_referrals || 0,
      total_commission: data.total_commission || 0,
      created_at: data.created_at?.toDate?.()?.toISOString?.() || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching affiliate by email:", error);
    return null;
  }
}

// ── Get commission logs for a specific affiliate ──
export async function getAffiliateCommissions(
  affiliateId: string
): Promise<CommissionLog[]> {
  if (!isFirebaseEnabled || !affiliateId) return [];

  try {
    const q = query(
      collection(db, "commissions"),
      where("affiliate_id", "==", affiliateId),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        affiliate_id: data.affiliate_id,
        affiliate_name: data.affiliate_name || "",
        referral_code: data.referral_code || "",
        order_id: data.order_id,
        order_service: data.order_service,
        order_amount: data.order_amount,
        commission_amount: data.commission_amount,
        status: data.status,
        created_at: data.created_at?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching commissions:", error);
    return [];
  }
}
