import { useEffect } from "react";
import { distance } from "../utils/distance";
import { useGeolocation } from "./useGeolocation";
import { notify, requestNotificationPermission } from "./usePushNotifications";

const DISTANCE_THRESHOLD = 300;

export default function useStoreReminders(items, stores) {
   const { location } = useGeolocation();

   useEffect(() => {
      requestNotificationPermission();
   }, []);

   useEffect(() => {
      if (!location || !items.length || !stores.length) return;

      stores.forEach((store) => {
         const d = distance(
            location.coords.latitude,
            location.coords.longitude,
            store.lat,
            store.lng
         );

         if (d < DISTANCE_THRESHOLD) {
            const lowItems = items.filter(
               (i) => i.storeId === store.id && i.qty < i.minQty
            );

            if (lowItems.length > 0) {
               const list = lowItems
                  .map((i) => `${i.name} (${i.qty}/${i.minQty})`)
                  .join(", ");

               notify(`Near ${store.name}? Restock: ${list}`);
            }
         }
      });
   }, [location, items, stores]);
}
