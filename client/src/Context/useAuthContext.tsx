import { useContext } from "react";
import { AuthContext, AuthContextProps } from "./AuthContext";

export function useAuthContext(): AuthContextProps{
    const user = useContext(AuthContext);
    if(user === undefined){
        throw new Error("User context is undefined");
    }
    return user;
}