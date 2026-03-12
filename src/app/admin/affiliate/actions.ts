"use server";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import type { Affiliate, CommissionLog } from "@/types/affiliate";
import { revalidatePath } from "next/cache";

// ── Get all affiliates ──
export async function getAffiliates(): Promise<Affiliate[]> {
  if (!isFirebaseEnabled) return [];

  try {
    const q = query(collection(db, "affiliates"), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => {
      const data = d.data();
      const createdAt = data.created_at as Timestamp;
      return {
        id: d.id,
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        referral_code: data.referral_code,
        commission_rate: data.commission_rate || 10,
        status: data.status || "pending",
        total_referrals: data.total_referrals || 0,
        total_commission: data.total_commission || 0,
        created_at: createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return [];
  }
}

// ── Update affiliate status ──
export async function updateAffiliateStatus(
  id: string,
  status: "active" | "inactive" | "pending"
) {
  if (!isFirebaseEnabled) return { success: false, error: "Firebase belum dikonfigurasi." };
  if (!id) return { success: false, error: "ID affiliator diperlukan." };

  try {
    const ref = doc(db, "affiliates", id);
    await setDoc(ref, { status }, { merge: true });
    revalidatePath("/admin/affiliate");
    return { success: true };
  } catch (error) {
    console.error("Error updating affiliate status:", error);
    return { success: false, error: "Gagal memperbarui status." };
  }
}

// ── Update affiliate commission rate ──
export async function updateAffiliateCommissionRate(id: string, rate: number) {
  if (!isFirebaseEnabled) return { success: false, error: "Firebase belum dikonfigurasi." };
  if (!id) return { success: false, error: "ID affiliator diperlukan." };
  if (rate < 0 || rate > 100) return { success: false, error: "Persentase komisi harus antara 0-100." };

  try {
    const ref = doc(db, "affiliates", id);
    await setDoc(ref, { commission_rate: rate }, { merge: true });
    revalidatePath("/admin/affiliate");
    return { success: true };
  } catch (error) {
    console.error("Error updating commission rate:", error);
    return { success: false, error: "Gagal memperbarui persentase komisi." };
  }
}

// ── Delete affiliate ──
export async function deleteAffiliate(id: string) {
  if (!isFirebaseEnabled) return { success: false, error: "Firebase belum dikonfigurasi." };
  if (!id) return { success: false, error: "ID affiliator diperlukan." };

  try {
    await deleteDoc(doc(db, "affiliates", id));
    revalidatePath("/admin/affiliate");
    return { success: true };
  } catch (error) {
    console.error("Error deleting affiliate:", error);
    return { success: false, error: "Gagal menghapus affiliator." };
  }
}

// ── Get all commission logs ──
export async function getAllCommissionLogs(): Promise<CommissionLog[]> {
  if (!isFirebaseEnabled) return [];

  try {
    const q = query(collection(db, "commissions"), orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => {
      const data = d.data();
      const createdAt = data.created_at as Timestamp;
      return {
        id: d.id,
        affiliate_id: data.affiliate_id,
        affiliate_name: data.affiliate_name || "",
        referral_code: data.referral_code || "",
        order_id: data.order_id,
        order_service: data.order_service,
        order_amount: data.order_amount,
        commission_amount: data.commission_amount,
        status: data.status,
        created_at: createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching commission logs:", error);
    return [];
  }
}

// ── Update commission status (mark as paid) ──
export async function updateCommissionStatus(
  id: string,
  status: "pending" | "paid"
) {
  if (!isFirebaseEnabled) return { success: false, error: "Firebase belum dikonfigurasi." };
  if (!id) return { success: false, error: "ID komisi diperlukan." };

  try {
    const ref = doc(db, "commissions", id);
    await setDoc(ref, { status }, { merge: true });
    revalidatePath("/admin/affiliate");
    return { success: true };
  } catch (error) {
    console.error("Error updating commission status:", error);
    return { success: false, error: "Gagal memperbarui status komisi." };
  }
}
