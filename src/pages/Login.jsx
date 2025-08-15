import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from 'firebase/auth';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { navigate } = useContext(ShopContext);
  const [firebaseUser, setFirebaseUser] = useState(null);

  const [name, setName] = useState('');
  const [password, setPasword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Mobile/Desktop Safe Google Sign-In
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      signInWithRedirect(auth, provider)
        .catch((error) => {});
    } else {
      signInWithPopup(auth, provider)
        .then(() => {})
        .catch((error) => {});
    }
  };

  // Listen to Firebase auth state and redirect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      if (user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-200 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
            {currentState === 'Login' ? 'Welcome Back' : 'Join Our Fashion Family'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentState === 'Login'
              ? 'Sign in to continue shopping the latest trends.'
              : 'Create your account to get started.'}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          {currentState === 'Sign Up' && (
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              onChange={(e) => setPasword(e.target.value)}
              value={password}
              type="password"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
              placeholder="Password"
              required
            />
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <p
              onClick={handleForgotPassword}
              className="cursor-pointer hover:text-black"
            >
              Forgot your password?
            </p>
            {currentState === 'Login' ? (
              <p
                onClick={() => setCurrentState('Sign Up')}
                className="cursor-pointer hover:text-black"
              >
                Create account
              </p>
            ) : (
              <p
                onClick={() => setCurrentState('Login')}
                className="cursor-pointer hover:text-black"
              >
                Login Here
              </p>
            )}
          </div>

          <button
            className="bg-black text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

