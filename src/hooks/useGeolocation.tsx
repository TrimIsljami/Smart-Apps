import { useState, useEffect } from "react";

export function useGeolocation() {
   const [location, setLocation] = useState<GeolocationPosition | null>(null);
   const [error, setError] = useState<string | null>(null);

   const requestLocation = () => {
      if (!("geolocation" in navigator)) {
         setError("Geolocation not supported");
         return;
      }

      navigator.geolocation.getCurrentPosition(
         (pos: GeolocationPosition) => setLocation(pos),
         (err: GeolocationPositionError) => setError(err.message),
         { enableHighAccuracy: true }
      );

      navigator.geolocation.watchPosition(
         (pos: GeolocationPosition) => setLocation(pos),
         (err: GeolocationPositionError) => setError(err.message),
         { enableHighAccuracy: true }
      );
   };

   useEffect(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (!isIOS) {
         requestLocation();
      }
   }, []);

   return { location, error, requestLocation };
}
