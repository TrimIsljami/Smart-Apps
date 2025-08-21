import React, { useEffect, useState } from "react";
import styles from "../css/SettingsPage.module.css";
import { Link } from "react-router-dom";

export default function SettingsPage() {
   const [permissions, setPermissions] = useState({
      location: "unknown",
      camera: "unknown",
      microphone: "unknown",
      notifications: "unknown",
   });

   useEffect(() => {
      const checkPermission = async (name, key) => {
         try {
            const result = await navigator.permissions.query({ name });
            setPermissions((prev) => ({ ...prev, [key]: result.state }));
         } catch {
            setPermissions((prev) => ({ ...prev, [key]: "not supported" }));
         }
      };

      checkPermission("geolocation", "location");
      checkPermission("camera", "camera");
      checkPermission("microphone", "microphone");
      checkPermission("notifications", "notifications");
   }, []);

   const readable = (state) => (state === "granted" ? "Granted" : "Not granted");

   return (
      <div className={styles.container}>
         <div className={styles.topBar}>
            <h1>Site Permissions</h1>
            <Link to="/pantry" className={styles.navBtn}>Go to Pantry</Link>
         </div>
         <ul className={styles.permissionList}>
            <li>📍 Location: {readable(permissions.location)}</li>
            <li>📷 Camera: {readable(permissions.camera)}</li>
            <li>🎤 Microphone: {readable(permissions.microphone)}</li>
            <li>🔔 Notifications: {readable(permissions.notifications)}</li>
         </ul>
      </div>
   );
}
