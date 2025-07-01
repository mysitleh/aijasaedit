"use server";

import { z } from "zod";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { app } from "@/lib/firebase";
// Note: AI Transformation and Storage uploads are removed from this immediate action
// to prevent timeouts and support an asynchronous workflow.

const db = getFirestore(app);

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
  try {
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No services found in Firestore. Returning default hardcoded services.");
      return [];
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
