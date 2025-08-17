import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, onSnapshot, serverTimestamp, getDoc } from "firebase/firestore";

export const ShopContext = createContext();
const GUEST_CART_KEY = "guest_cart_v1";

// ✅ Backend API URL (Render)
const API_BASE = "https://backend-testing-m0fc.onrender.com";

const ShopContextProvider = (props) => {
  const currency = "Rs. ";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const navigate = useNavigate();

  // ---------------- Guest Cart Helpers ----------------
  const readGuestCart = () => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "{}");
    } catch {
      return {};
    }
  };
  const writeGuestCart = (cart) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  };

  // ---------------- Save Cart to Firestore ----------------
  const saveCartToFirestore = async (updatedCart) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await setDoc(
        doc(db, "carts", user.uid),
        { items: updatedCart, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (error) {
      console.error(error);
      toast.error("Error saving cart");
    }
  };

  // ---------------- Add to Cart ----------------
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    const key = `${itemId}_${size}`;
    const updatedCart = structuredClone(cartItems);
    updatedCart[key] = (updatedCart[key] || 0) + 1;
    setCartItems(updatedCart);
    if (auth.currentUser) saveCartToFirestore(updatedCart);
    else writeGuestCart(updatedCart);
  };

  // ---------------- Update Quantity ----------------
  const updateQuantity = async (itemId, size, quantity) => {
    const key = `${itemId}_${size}`;
    const updatedCart = structuredClone(cartItems);
    if (quantity > 0) {
      updatedCart[key] = quantity;
    } else {
      delete updatedCart[key];
    }
    setCartItems(updatedCart);
    if (auth.currentUser) saveCartToFirestore(updatedCart);
    else writeGuestCart(updatedCart);
  };

  // ---------------- Remove from Cart ----------------
  const removeFromCart = async (itemId, size) => {
    const key = `${itemId}_${size}`;
    const updatedCart = structuredClone(cartItems);
    delete updatedCart[key];
    setCartItems(updatedCart);
    if (auth.currentUser) saveCartToFirestore(updatedCart);
    else writeGuestCart(updatedCart);
  };

  // ---------------- Get Cart Count ----------------
  const getCartCount = () => {
    let total = 0;
    for (const key in cartItems) {
      const [id] = key.split("_");
      const productExists = products.some((p) => p._id === id);
      if (!productExists) continue;
      total += cartItems[key];
    }
    return total;
  };

  // ---------------- Get Cart Amount ----------------
  const getCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      const [id] = key.split("_");
      const product = products.find((p) => p._id === id);
      if (!product) continue;
      total += product.price * cartItems[key];
    }
    return total;
  };

  // ---------------- Load Products ----------------
  const getProductsData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/product/list`);
      const data = await response.json();
      if (data.success) setProducts(data.products.reverse());
      else toast.error(data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // ---------------- Merge Guest Cart on Login ----------------
  const mergeGuestCart = async (uid) => {
    const guestCart = readGuestCart();
    if (Object.keys(guestCart).length === 0) return;

    const cartRef = doc(db, "carts", uid);
    try {
      const snap = await getDoc(cartRef);
      const currentItems = snap.exists() ? snap.data().items : {};
      const merged = { ...currentItems, ...guestCart };
      await saveCartToFirestore(merged);
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- Real-time Cart Sync ----------------
  useEffect(() => {
    getProductsData();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await mergeGuestCart(user.uid);
        const cartRef = doc(db, "carts", user.uid);
        const unsubCart = onSnapshot(cartRef, (snap) => {
          if (snap.exists()) setCartItems(snap.data().items || {});
          else setCartItems({});
          setLoadingCart(false);
        });
        return () => unsubCart();
      } else {
        setCartItems(readGuestCart());
        setLoadingCart(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    removeFromCart,
    navigate,
    loadingCart,
    clearCart: () => setCartItems({}),
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
