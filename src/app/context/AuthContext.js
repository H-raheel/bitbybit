'use client';

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log("Loaded user from localStorage:", storedUser);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        console.log("Auth state changed: User signed in", userData);
      } else {
        localStorage.removeItem("user");
        setUser(null);
        console.log("Auth state changed: No user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [onAuthStateChanged]);

  const signIn = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      console.log("Sign-in successful:", userData);
    } catch (err) {
      console.error("Sign-in error:", err);
      setError(err.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
      console.log("User logged out");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, logOut, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
