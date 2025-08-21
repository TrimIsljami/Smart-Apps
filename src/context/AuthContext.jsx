import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { AuthContext } from "./AuthContextOnly";

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
         setUser(firebaseUser);
         setLoading(false);
      });
      return () => unsub();
   }, []);

   const signIn = () => signInWithPopup(auth, googleProvider);
   const signOutUser = () => signOut(auth);

   if (loading) return null;

   return (
      <AuthContext.Provider value={{ user, signIn, signOutUser }}>
         {children}
      </AuthContext.Provider>
   );
}
