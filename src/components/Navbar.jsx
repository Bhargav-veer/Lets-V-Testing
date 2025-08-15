import React, { useContext, useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const { setShowSearch, getCartCount, navigate, setToken, setCartItems } = useContext(ShopContext);
  const sidebarRef = useRef(null);

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

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

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
    <div className='flex items-center justify-between bg-white py-5 font-medium sticky top-0 z-50 border-b sm:px-10 shadow-sm'>
      {/* Logo and Menu Icon on the Left */}
      <div className='flex items-center gap-4'>
        <img 
          onClick={() => setVisible(true)} 
          src={assets.menu_icon} 
          className='w-8 cursor-pointer sm:hidden' 
          alt='Menu Icon' 
        />
        <Link to='/' className='flex items-center'>
          <img src={assets.logo} className='w-20 sm:w-36' alt='Logo' />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1 border-none'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1 border-none'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1 border-none'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1 border-none'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      {/* Menu Icon and Other Actions */}
      <div className='flex items-center gap-6'>
        <img
          onClick={() => {
            setShowSearch(true);
            navigate('/collection');
          }}
          src={assets.search_icon}
          className='w-5 cursor-pointer'
          alt='Search Icon'
        />

        {/* Profile avatar if logged in */}
        <div className='group relative'>
          {firebaseUser ? (
            firebaseUser.photoURL ? (
              <img
                src={firebaseUser.photoURL}
                alt='User Avatar'
                className='w-8 h-8 rounded-full object-cover cursor-pointer border'
              />
            ) : (
              <div className='w-8 h-8 bg-gray-300 text-gray-800 flex items-center justify-center rounded-full cursor-pointer font-bold'>
                {getInitials(firebaseUser.displayName || firebaseUser.email || "User")}
              </div>
            )
          ) : (
            <div className='w-8 h-8 bg-gray-200 text-gray-400 flex items-center justify-center rounded-full cursor-pointer font-bold'>
              <span>?</span>
            </div>
          )}
          {/* Dropdown Menu */}
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>
                Orders
              </p>
              {firebaseUser ? (
                <p onClick={logout} className='cursor-pointer hover:text-black'>
                  Logout
                </p>
              ) : (
                <p onClick={() => navigate('/login')} className='cursor-pointer hover:text-black'>
                  Login
                </p>
              )}
            </div>
          </div>
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt='Cart Icon' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>
      </div>

      {/* Sidebar menu for small screens */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 bg-white overflow-hidden transition-all duration-500 ease-in-out z-50 ${
          visible ? 'w-1/2 opacity-100' : 'w-0 opacity-0'
        } sm:w-0`}
      >
        <div className='flex flex-col text-gray-600 h-full'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer border-none'>
            <img className='h-4 rotate-180 ms-3' src={assets.dropdown_icon} alt='Close Icon' />
            <p>Close</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 hover:bg-gray-100 hover:text-black' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 hover:bg-gray-100 hover:text-black' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 hover:bg-gray-100 hover:text-black' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 hover:bg-gray-100 hover:text-black' to='/contact'>CONTACT</NavLink>

          {/* Mobile Login / Logout */}
          <NavLink 
            onClick={() => setVisible(false)} 
            className='py-2 pl-6 hover:bg-gray-100 hover:text-black font-medium' 
            to='/account'
          >
            My Profile
          </NavLink>
          {firebaseUser ? (
            <button 
              onClick={() => { logout(); setVisible(false); }} 
              className='py-2 pl-6 text-red-600 font-medium text-left hover:bg-gray-100 hover:text-red-800'
            >
              Logout
            </button>
          ) : (
            <NavLink 
              onClick={() => setVisible(false)} 
              className='py-2 pl-6 text-blue-600 font-medium hover:bg-gray-100 hover:text-blue-800' 
              to='/login'
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
