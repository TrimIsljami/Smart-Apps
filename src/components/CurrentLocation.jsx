import { useEffect, useState } from "react";
import { CircleMarker, Circle } from "react-leaflet";

export default function CurrentLocation() {
   const [pos, setPos] = useState(null);
   const [acc, setAcc] = useState(null);

   useEffect(() => {
      if (!navigator.geolocation) return;

      const watchId = navigator.geolocation.watchPosition(
         (p) => {
            setPos([p.coords.latitude, p.coords.longitude]);
            setAcc(p.coords.accuracy);
         },
         () => { },
         { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
   }, []);

   if (!pos) return null;

   return (
      <>
         <CircleMarker
            center={pos}
            radius={6}
            pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 1 }}
         />
         {acc && (
            <Circle
               center={pos}
               radius={acc}
               pathOptions={{ color: "#2563eb", fillOpacity: 0.1 }}
            />
         )}
      </>
   );
}
