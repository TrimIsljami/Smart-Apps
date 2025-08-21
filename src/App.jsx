import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PantryPage from "./pages/PantryPage";
import StoresPage from "./pages/StoresPage";
import SettingsPage from "./pages/SettingsPage";

import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

import useStoreReminders from "./hooks/useStoreReminders.tsx";

export default function App() {
   const [user, setUser] = useState(null);
   const [items, setItems] = useState([]);
   const [stores, setStores] = useState([]);

   useEffect(() => {
      return onAuthStateChanged(auth, (u) => setUser(u ?? null));
   }, []);

   useEffect(() => {
      if (!user) return setItems([]);
      const qRef = query(collection(db, "User", user.uid, "Pantry"), orderBy("name", "asc"));
      return onSnapshot(qRef, (snap) =>
         setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
   }, [user]);

   useEffect(() => {
      if (!user) return setStores([]);
      const qRef = query(collection(db, "User", user.uid, "Stores"), orderBy("name", "asc"));
      return onSnapshot(qRef, (snap) =>
         setStores(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      );
   }, [user]);

   useStoreReminders(items, stores);

   return (
      <Routes>
         <Route path="/" element={<Navigate to="/pantry" replace />} />
         <Route path="/pantry" element={<PantryPage />} />
         <Route path="/stores" element={<StoresPage />} />
         <Route path="/settings" element={<SettingsPage />} />
         <Route path="*" element={<Navigate to="/pantry" replace />} />
      </Routes>
   );
}
