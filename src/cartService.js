import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Save cart items for a user
export async function saveCart(uid, cartItems) {
  await setDoc(doc(db, "carts", uid), { items: cartItems });
}

// Load cart items for a user
export async function loadCart(uid) {
  const docSnap = await getDoc(doc(db, "carts", uid));
  if (docSnap.exists()) {
    return docSnap.data().items;
  }
  return [];
}
// Load cart items for a user
export async function loadCart(uid) {
  try {
    const res = await fetch(`/api/cart/load?uid=${uid}`);
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data.cartItems) ? data.cartItems : [];
    } else {
      console.error("Failed to load cart:", await res.text());
      return [];
    }
  } catch (err) {
    console.error("Error loading cart:", err);
    return [];
  }
}
