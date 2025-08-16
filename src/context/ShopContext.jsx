<<<<<<< HEAD
import { createContext, useEffect, useState } from "react";
=======
import { createContext, useEffect, useState, useRef } from "react";
>>>>>>> 93a1078 (changed some cart and other options)
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, onSnapshot, serverTimestamp, getDoc } from "firebase/firestore";

export const ShopContext = createContext();

const GUEST_CART_KEY = "guest_cart_v1";

const ShopContextProvider = (props) => {
  const currency = "Rs. ";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
<<<<<<< HEAD
  const [loadingCart, setLoadingCart] = useState(true);
  const navigate = useNavigate();

  // ---------------- Guest Cart Helpers ----------------
=======
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasCleanedRef = useRef(false);

>>>>>>> 93a1078 (changed some cart and other options)
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

<<<<<<< HEAD
  // ---------------- Save Cart to Firestore ----------------
  const saveCartToFirestore = async (updatedCart) => {
    const user = auth.currentUser;
    if (!user) return;
=======
  const saveCartToFirestore = async (updatedCart) => {
    const user = auth.currentUser;
    if (!user) return;

>>>>>>> 93a1078 (changed some cart and other options)
    try {
      await setDoc(
        doc(db, "carts", user.uid),
        { items: updatedCart, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch (error) {
<<<<<<< HEAD
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

  // ---------------- Update Quantity (remove if 0) ----------------
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

  // ---------------- Get Cart Count (robust) ----------------
  const getCartCount = () => {
    let total = 0;
    for (const key in cartItems) {
      const [id] = key.split("_");
      const productExists = products.some((p) => p._id === id);
      if (!productExists) continue; // skip deleted products
      total += cartItems[key];
    }
    return total;
  };

  // ---------------- Get Cart Amount (robust) ----------------
  const getCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      const [id] = key.split("_");
      const product = products.find((p) => p._id === id);
      if (!product) continue; // skip deleted products
      total += product.price * cartItems[key];
    }
    return total;
  };

  // ---------------- Load Products ----------------
  const getProductsData = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/product/list"
      );
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
=======
      toast.error("Failed to save cart.");
      throw error;
    }
  };

  const cleanupStaleCartItems = (cartItems, products) => {
    const validIds = new Set(products.map(({ _id }) => _id));
    const cleanedCart = {};

    Object.entries(cartItems).forEach(([key, qty]) => {
      const [productId] = key.split("_");
      if (validIds.has(productId) && qty > 0) {
        cleanedCart[key] = qty;
      }
    });

    return cleanedCart;
  };

  const clearCart = async () => {
    setCartItems({});
    try {
      if (auth.currentUser) await saveCartToFirestore({});
      else writeGuestCart({});
      toast.success("Cart cleared.");
    } catch (e) {
      toast.error("Failed to clear cart.");
    }
  };

  const addToCart = async (productId, size) => {
    if (!size) {
      toast.error("Select a size.");
      return;
    }
    const key = `${productId}_${size}`;
    const updatedCart = { ...cartItems };
    updatedCart[key] = (updatedCart[key] || 0) + 1;
    setCartItems(updatedCart);

    try {
      if (auth.currentUser) await saveCartToFirestore(updatedCart);
      else writeGuestCart(updatedCart);
    } catch {
      setCartItems(cartItems);
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    const key = `${productId}_${size}`;
    const updatedCart = { ...cartItems };
    if (quantity > 0) updatedCart[key] = quantity;
    else delete updatedCart[key];
    setCartItems(updatedCart);

    try {
      if (auth.currentUser) await saveCartToFirestore(updatedCart);
      else writeGuestCart(updatedCart);
    } catch {
      setCartItems(cartItems);
    }
  };

  const removeFromCart = async (productId, size) => {
    const key = `${productId}_${size}`;
    const updatedCart = { ...cartItems };
    delete updatedCart[key];
    setCartItems(updatedCart);

    try {
      if (auth.currentUser) await saveCartToFirestore(updatedCart);
      else writeGuestCart(updatedCart);
      toast.success("Item removed.");
    } catch {
      setCartItems(cartItems);
      toast.error("Failed to remove item.");
    }
  };

  const getCartCount = () => {
    return Object.entries(cartItems).reduce((acc, [key, quantity]) => {
      const [id] = key.split("_");
      if (products.find((p) => p._id === id) && quantity > 0) {
        return acc + quantity;
      }
      return acc;
    }, 0);
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((acc, [key, quantity]) => {
      const [id] = key.split("_");
      const product = products.find((p) => p._id === id);
      if (product && quantity > 0) {
        return acc + product.price * quantity;
      }
      return acc;
    }, 0);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
      const { success, products } = await res.json();
      if (success) setProducts(products.reverse());
      else toast.error("Failed to fetch products.");
    } catch {
      toast.error("Failed to fetch products.");
    }
  };

  const mergeGuestCart = async (uid) => {
    const guestCart = readGuestCart();
    if (!Object.keys(guestCart).length) return;

    const cartRef = doc(db, "carts", uid);
    try {
      const docSnap = await getDoc(cartRef);
      const serverCart = docSnap.exists() ? docSnap.data().items : {};
      const merged = { ...serverCart, ...guestCart };
      await saveCartToFirestore(merged);
      localStorage.removeItem(GUEST_CART_KEY);
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length && Object.keys(cartItems).length && !hasCleanedRef.current) {
      const cleaned = cleanupStaleCartItems(cartItems, products);
      if (Object.keys(cleaned).length !== Object.keys(cartItems).length) {
        setCartItems(cleaned);
        hasCleanedRef.current = true;
        if (auth.currentUser) saveCartToFirestore(cleaned);
        else writeGuestCart(cleaned);
      }
    }
  }, [products]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await mergeGuestCart(user.uid);
        const cartRef = doc(db, "carts", user.uid);
        const unsub = onSnapshot(cartRef, (snap) => {
          if (snap.exists()) setCartItems(snap.data().items || {});
          else setCartItems({});
          setLoading(false);
        }, () => setLoading(false));
        return unsub;
      } else {
        setCartItems(readGuestCart());
        setLoading(false);
>>>>>>> 93a1078 (changed some cart and other options)
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
<<<<<<< HEAD
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
    navigate,
    loadingCart,
=======
    cartItems,
    products,
    currency,
    loading,
    navigate,
    addToCart,
    removeFromCart,
    clearCart: clearCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
>>>>>>> 93a1078 (changed some cart and other options)
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
