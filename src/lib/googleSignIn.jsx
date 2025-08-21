import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
  } catch (e) {
    if (
      e.code === "auth/popup-blocked" ||
      e.code === "auth/operation-not-supported-in-this-environment"
    ) {
      await signInWithRedirect(auth, provider);
    } else {
      console.error("Auth error:", e.code, e.message);
      throw e;
    }
  }
}

export function handleRedirectResult() {
  return getRedirectResult(auth).catch((e) => {
    if (e?.code !== "auth/no-auth-event") console.error(e);
  });
}
