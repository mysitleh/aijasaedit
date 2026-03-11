"use server";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseEnabled } from "@/lib/firebase";
import { DEFAULT_SETTINGS, SiteSettings, siteSettingsSchema } from "@/types/settings";
import { revalidatePath } from "next/cache";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseEnabled) {
    return DEFAULT_SETTINGS;
  }

  try {
    const docRef = doc(db, "settings", "general");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as SiteSettings;
    } else {
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateSiteSettings(data: SiteSettings): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseEnabled) {
    return { success: false, error: "Firebase not configured." };
  }

  const result = siteSettingsSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Data pengaturan tidak valid." };
  }

  try {
    const docRef = doc(db, "settings", "general");
    await setDoc(docRef, result.data, { merge: true });
    
    // Rebuild page cache so the new settings appear immediately
    revalidatePath("/");
    revalidatePath("/admin/settings");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Gagal menyimpan pengaturan." };
  }
}
