import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function LoginButton({ user }) {
   const handleLogin = async () => {
      try {
         const provider = new GoogleAuthProvider();
         await signInWithPopup(auth, provider);
      } catch (err) {
         console.error("Login failed:", err);
      }
   };

   const handleLogout = async () => {
      try {
         await signOut(auth);
      } catch (err) {
         console.error("Logout failed:", err);
      }
   };

   if (user) {
      return (
         <button onClick={handleLogout}>
            {user.displayName || "Logout"}
         </button>
      );
   }

   return <button onClick={handleLogin}>Login</button>;
}
