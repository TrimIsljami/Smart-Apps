import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import styles from "../css/StoresPage.module.css";

const savedIcon = new L.Icon({
   iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
   shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
   iconSize: [25, 41],
   iconAnchor: [12, 41],
});

export default function StoreMarker({ store, onDelete }) {
   return (
      <Marker key={store.id} position={[store.lat, store.lng]} icon={savedIcon}>
         <Popup>
            <div className={styles.popup}>
               <strong className={styles.popupTitle}>{store.name}</strong>
               <small className={styles.popupCoords}>
                  {store.lat.toFixed(5)}, {store.lng.toFixed(5)}
               </small>
               <button
                  onClick={() => onDelete(store.id)}
                  className={styles.delete}
               >
                  Delete
               </button>
            </div>
         </Popup>
      </Marker>
   );
}
