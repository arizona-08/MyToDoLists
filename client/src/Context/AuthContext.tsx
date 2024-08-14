import { createContext } from "react";

export interface AuthContextProps{
    is_logged: boolean,
    auth_token: string,
    setAuthInfo: (auth_token: string, is_logged: boolean) => void; 
}
  
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

