'use server';

import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { app } from '@/lib/firebase';

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
