import React, { useRef, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "../css/StoresPage.module.css";

const tempIcon = new L.Icon({
   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
   iconSize: [25, 41],
   iconAnchor: [12, 41],
});

export default function TempStoreMarker({ tempMarker, tempName, setTempName, onSave, onCancel }) {
   const nameInputRef = useRef(null);

   useEffect(() => {
      if (nameInputRef.current) {
         setTimeout(() => nameInputRef.current.focus(), 100);
      }
   }, []);

   return (
      <Marker position={[tempMarker.lat, tempMarker.lng]} icon={tempIcon}>
         <Popup>
            <div className={styles.tempPopup}>
               <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Enter store name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className={styles.input}
               />
               <div className={styles.tempActions}>
                  <button
                     onClick={onSave}
                     disabled={!tempName.trim()}
                     className={styles.save}
                  >
                     Save
                  </button>
                  <button onClick={onCancel} className={styles.cancel}>
                     Cancel
                  </button>
               </div>
            </div>
         </Popup>
      </Marker>
   );
}
