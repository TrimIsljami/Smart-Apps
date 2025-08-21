import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./css/globals.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
   <BrowserRouter>
      <AuthProvider>
         <App />
      </AuthProvider>
   </BrowserRouter>
);

if ("serviceWorker" in navigator) {
   window.addEventListener("load", () => {
      navigator.serviceWorker
         .register("/service-worker.js")
         .then((reg) => console.log("✅ Service Worker registered:", reg))
         .catch((err) => console.error("❌ SW registration failed:", err));
   });
}

import { getAllPendingItems, clearPendingItem } from "./lib/db";

if ("serviceWorker" in navigator) {
   navigator.serviceWorker.addEventListener("message", async (event) => {
      if (event.data?.type === "SYNC_ITEMS") {
         const items = await getAllPendingItems();
         console.log("📦 Pending items synced:", items);
         for (const item of items) {
            await clearPendingItem(item.id);
         }
      }
   });
}
