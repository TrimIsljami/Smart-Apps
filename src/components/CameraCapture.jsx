import React, { useRef, useEffect } from "react";

export default function CameraCapture({ onSave }) {
   const videoRef = useRef(null);
   const canvasRef = useRef(null);

   useEffect(() => {
      let currentStream;

      navigator.mediaDevices
         .getUserMedia({ video: { facingMode: "environment" } })
         .then((mediaStream) => {
            currentStream = mediaStream;
            if (videoRef.current) {
               videoRef.current.srcObject = mediaStream;
            }
         })
         .catch((err) => console.error("Camera error:", err));

      return () => {
         if (currentStream) {
            currentStream.getTracks().forEach((track) => track.stop());
         }
      };
   }, []);

   const takePhoto = () => {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 300, 200);

      canvasRef.current.toBlob(
         (blob) => {
            if (!blob) return;
            const id = Date.now().toString();
            const reader = new FileReader();

            reader.onload = () => {
               localStorage.setItem(`photo-${id}`, reader.result);
               const url = URL.createObjectURL(blob);
               onSave({ id, url });
            };

            reader.readAsDataURL(blob);
         },
         "image/jpeg",
         0.9
      );
   };

   return (
      <div>
         <video ref={videoRef} autoPlay playsInline width="300" height="200" />
         <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }} />
         <button onClick={takePhoto}>Capture & Save</button>
      </div>
   );
}
