import { useContext } from "react";
import { AuthContext } from "../context/AuthContextOnly";

export const useAuth = () => useContext(AuthContext);
