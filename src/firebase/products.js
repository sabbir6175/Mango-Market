import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, setDoc,
} from "firebase/firestore";
import { db } from "./config";

const COL = "products";

export async function getProducts() {
  const q = query(collection(db, COL), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProduct(data) {
  return addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, COL, id), data);
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, COL, id));
}

// local products.js থেকে Firebase এ seed করার জন্য (একবার মাত্র)
export async function seedProducts(products) {
  for (const p of products) {
    await setDoc(doc(db, COL, p.id), {
      name: p.name,
      price: p.price,
      image: p.image,
      createdAt: serverTimestamp(),
    });
  }
}
