'use server';

import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const db = getFirestore(app);

// Define the type for a single order document
export interface Order {
  id: string;
  name: string;
  contact: string;
  service: string;
  message: string;
  file_url: string;
  created_at: string; // Serialized as string
  status: string;
}

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


export async function getOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);

    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.created_at as Timestamp;
      
      return {
        id: doc.id,
        name: data.name,
        contact: data.contact,
        service: data.service,
        message: data.message,
        file_url: data.file_url,
        created_at: createdAt.toDate().toISOString(), // Serialize timestamp to ISO string
        status: data.status,
      };
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    // In a real app, you might want to handle this more gracefully
    throw new Error('Could not fetch orders.');
  }
}

const addServiceSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    price: z.string().min(2, "Price is required."),
    icon: z.string().min(1, "Icon is required."),
    image_placeholder: z.string().url("Must be a valid URL."),
    ai_hint: z.string().min(2, "AI hint is required."),
    order: z.coerce.number().int().min(0, "Order must be a positive number."),
});

export async function addService(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    if (rawData.image_placeholder === '') {
        rawData.image_placeholder = 'https://placehold.co/400x300.png';
    }
    
    const validation = addServiceSchema.safeParse(rawData);

    if (!validation.success) {
        const errorMessage = validation.error.issues.map(i => i.message).join(', ');
        return { success: false, error: errorMessage };
    }
    
    try {
        await addDoc(collection(db, 'services'), validation.data);
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error adding service:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: `Failed to add service: ${errorMessage}` };
    }
}

export async function deleteService(id: string) {
    if (!id) {
        return { success: false, error: "Service ID is required." };
    }
    try {
        await deleteDoc(doc(db, 'services', id));
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error deleting service:", error);
        return { success: false, error: "Failed to delete service." };
    }
}
