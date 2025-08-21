import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function BarcodeScanner({ onScan }) {
   const videoRef = useRef(null);

   useEffect(() => {
      const codeReader = new BrowserMultiFormatReader();
      const videoEl = videoRef.current; // capture ref safely

      codeReader.decodeFromVideoDevice(null, videoEl, (result) => {
         if (result) onScan(result.getText());
      });

      return () => {
         codeReader.reset();
         if (videoEl?.srcObject) {
            videoEl.srcObject.getTracks().forEach((t) => t.stop());
         }
      };
   }, [onScan]);

   return (
      <div style={{ textAlign: "center" }}>
         <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", borderRadius: "8px", border: "1px solid #ddd" }}
         />
         <p style={{ fontSize: "14px" }}>Point the camera at a barcode…</p>
      </div>
   );
}
