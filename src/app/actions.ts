"use server";

import { z } from "zod";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { db, isFirebaseEnabled } from "@/lib/firebase";
// Note: AI Transformation and Storage uploads are removed from this immediate action
// to prevent timeouts and support an asynchronous workflow.

const orderSchema = z.object({
  name: z.string().min(2, { message: "Nama harus memiliki minimal 2 karakter." }),
  contact: z.string().min(5, { message: "Info kontak (Email/Telepon) wajib diisi." }),
  service: z.string({ required_error: "Silakan pilih layanan." }),
  description: z.string().min(10, { message: "Deskripsi harus memiliki minimal 10 karakter." }).max(500),
  fileUrl: z.string().url(),
});

type OrderPayload = z.infer<typeof orderSchema>;

export interface Service {
    id: string;
    title: string;
    description: string;
    price: string;
    icon: string;
    image_placeholder: string;
    ai_hint: string;
    order: number;
}

export async function getServices(): Promise<Service[]> {
  const defaultServices: Service[] = [
    { id: "svc-1", title: "Adegan Supercar", description: "Posisikan diri Anda dalam adegan viral \"diberhentikan polisi\" dengan supercar mewah pilihan Anda.", price: "75000", icon: "camera", image_placeholder: "/services/supercar.webp", ai_hint: "transform this person into standing next to a luxury red supercar with police lights", order: 1 },
    { id: "svc-2", title: "Video Karir Masa Depan", description: "Lihat anak Anda sebagai astronot, ilmuwan, atau profesi impian lainnya dalam video sinematik singkat.", price: "100000", icon: "video", image_placeholder: "/services/astronaut.webp", ai_hint: "create a short cinematic video of this child dressed as an astronaut", order: 2 },
    { id: "svc-3", title: "Foto Wisuda AI", description: "Tidak sempat foto wisuda? Kami akan membuatkan foto yang profesional dan elegan untuk Anda.", price: "50000", icon: "graduation-cap", image_placeholder: "/services/wisuda.webp", ai_hint: "put this person in a classic graduation gown and cap holding a diploma", order: 3 },
    { id: "svc-4", title: "Hewan Peliharaan Jadi Kartun", description: "Ubah foto hewan kesayangan Anda menjadi karakter kartun yang menggemaskan dan menawan.", price: "65000", icon: "sparkles", image_placeholder: "/services/cartoon-pet.webp", ai_hint: "turn this animal into an adorable 3d animated Pixar style cartoon character", order: 4 },
    { id: "svc-5", title: "Potret Fantasi & Pahlawan Super", description: "Jadilah pahlawan super, ksatria dari dunia fantasi, atau penjelajah luar angkasa.", price: "85000", icon: "zap", image_placeholder: "/services/superhero.webp", ai_hint: "transform this person into a cinematic superhero with dynamic lighting", order: 5 },
    { id: "svc-6", title: "Edit AI Kustom", description: "Punya ide kreatif lain? Beri tahu kami, dan AI kami akan mewujudkannya.", price: "0", icon: "wand2", image_placeholder: "/services/custom-ai.webp", ai_hint: "apply custom transformation based on user prompt", order: 6 },
  ];

  if (!isFirebaseEnabled) {
    console.log("Firebase is not configured. Returning default hardcoded services.");
    return defaultServices;
  }
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No services found in Firestore. Returning default hardcoded services.");
      return defaultServices;
    }
    
    const services = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        price: data.price,
        icon: data.icon,
        image_placeholder: data.image_placeholder,
        ai_hint: data.ai_hint,
        order: data.order,
      } as Service;
    });

    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    // Return empty array on error so the page can still render.
    return [];
  }
}


export async function createOrderAction(payload: OrderPayload): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isFirebaseEnabled) {
    return { success: false, error: "Firebase is not configured. Cannot create order." };
  }

  const validation = orderSchema.safeParse(payload);
  if (!validation.success) {
    const errorMessage = validation.error.issues.map(i => i.message).join(' ');
    return { success: false, error: errorMessage || "Invalid data provided." };
  }

  const { name, contact, service, description, fileUrl } = validation.data;

  try {
    // Step 1: Immediately save the new order to Firestore with a pending status.
    // The AI processing part is removed to ensure a fast response to the user.
    await addDoc(collection(db, "orders"), {
      name,
      contact,
      service,
      message: description,
      file_url: fileUrl,
      created_at: serverTimestamp(),
      status: "pending_payment", // Indicates that the order is awaiting payment/processing.
      // transformed_file_urls will be added later by a separate process.
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in createOrderAction:", error);
    const userFriendlyError = "Failed to create your order. Please try again later or contact support if the problem persists.";
    return { success: false, error: userFriendlyError };
  }
}
