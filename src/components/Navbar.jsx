import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const { setShowSearch, getCartCount, navigate, setToken, setCartItems } = useContext(ShopContext);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logged out successfully!");
        navigate('/login');
        setCartItems({});
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error(error.message);
      });
  };

  // Generate initials if no photo
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={assets.logo} className="w-28" alt="Logo" />
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-8 text-gray-700 font-medium text-base">
          <NavLink to="/" className="hover:text-black">HOME</NavLink>
          <NavLink to="/collection" className="hover:text-black">COLLECTION</NavLink>
          <NavLink to="/about" className="hover:text-black">ABOUT</NavLink>
          <NavLink to="/contact" className="hover:text-black">CONTACT</NavLink>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <img
            onClick={() => {
              setShowSearch(true);
              navigate('/collection');
            }}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search Icon"
          />

          {/* Profile Dropdown */}
          <div className="relative group">
            {firebaseUser ? (
              firebaseUser.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer border"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 text-gray-800 flex items-center justify-center rounded-full cursor-pointer font-bold">
                  {getInitials(firebaseUser.displayName || firebaseUser.email || "User")}
                </div>
              )
            ) : (
              <div className="w-8 h-8 bg-gray-200 text-gray-400 flex items-center justify-center rounded-full cursor-pointer font-bold">
                <span>?</span>
              </div>
            )}
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded shadow-lg w-40 py-2 z-10">
              <NavLink to="/account" className="block px-4 py-2 hover:bg-gray-100">My Profile</NavLink>
              <NavLink to="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</NavLink>
              {firebaseUser ? (
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
              ) : (
                <NavLink to="/login" className="block px-4 py-2 hover:bg-gray-100 text-blue-600">Login</NavLink>
              )}
            </div>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart Icon" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
