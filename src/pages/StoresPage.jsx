import React, { useEffect, useState } from "react";
import styles from "../css/StoresPage.module.css";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
   collection,
   query,
   onSnapshot,
   addDoc,
   deleteDoc,
   doc,
   GeoPoint,
   orderBy,
   serverTimestamp,
} from "firebase/firestore";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import MapClickHandler from "../components/MapClickHandler";
import CurrentLocation from "../components/CurrentLocation";
import StoreMarker from "../components/StoreMarker";
import TempStoreMarker from "../components/TempStoreMarker";

const DEFAULT_ZOOM = 14;

export default function StoresPage() {
   const [user, setUser] = useState(() => auth.currentUser);
   const [stores, setStores] = useState([]);
   const [tempMarker, setTempMarker] = useState(null);
   const [tempName, setTempName] = useState("");

   useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ?? null)), []);

   useEffect(() => {
      if (!user) return setStores([]);
      const q = query(collection(db, "User", user.uid, "Stores"), orderBy("createdAt", "desc"));
      return onSnapshot(q, (snap) =>
         setStores(
            snap.docs.map((d) => {
               const raw = d.data();
               const gp = raw.location instanceof GeoPoint ? raw.location : null;
               return { id: d.id, name: raw.name, lat: gp?.latitude ?? raw.lat, lng: gp?.longitude ?? raw.lng };
            })
         )
      );
   }, [user]);

   const saveStore = async () => {
      if (!user || !tempMarker || !tempName.trim()) return;
      await addDoc(collection(db, "User", user.uid, "Stores"), {
         name: tempName.trim(),
         location: new GeoPoint(tempMarker.lat, tempMarker.lng),
         createdAt: serverTimestamp(),
      });
      setTempMarker(null);
      setTempName("");
   };

   const deleteStore = async (id) => {
      if (user) await deleteDoc(doc(db, "User", user.uid, "Stores", id));
   };

   return (
      <>
         <div className={styles.navOverlay}>
            <Link to="/pantry" className={styles.navBtn}>Go to Pantry</Link>
         </div>
         <div className={styles.mapWrap}>
            <MapContainer center={[50.8466, 4.3528]} zoom={DEFAULT_ZOOM} scrollWheelZoom className={styles.map}>
               <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
               <CurrentLocation />

               {stores.map((s) => (
                  <StoreMarker key={s.id} store={s} onDelete={deleteStore} />
               ))}

               {tempMarker && (
                  <TempStoreMarker
                     tempMarker={tempMarker}
                     tempName={tempName}
                     setTempName={setTempName}
                     onSave={saveStore}
                     onCancel={() => { setTempMarker(null); setTempName(""); }}
                  />
               )}

               <MapClickHandler onMapClick={setTempMarker} />
            </MapContainer>
         </div>
      </>
   );
}
