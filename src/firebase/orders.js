import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

const ORDERS_COLLECTION = "orders";

// নতুন অর্ডার তৈরি করে এবং Firestore-এ সেভ করে
export async function createOrder(orderData) {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...orderData,
    status: "pending", // pending | confirmed | delivered | cancelled
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// সব অর্ডার ফেচ করে, নতুন থেকে পুরাতন সাজানো (admin panel-এর জন্য)
export async function getAllOrders() {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// অর্ডারের status আপডেট করে (confirmed / delivered / cancelled)
export async function updateOrderStatus(orderId, status) {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, { status });
}
