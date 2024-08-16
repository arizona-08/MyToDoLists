import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";


interface AuthProviderProps{
  children: ReactNode;
}

function AuthProvider( {children} : AuthProviderProps) {

  
  const [is_logged, setIsLogged] = useState<boolean>(false);
  const [auth_token, setAuthToken] = useState<string>("");

  function getLogInfo(){
    const savedData = sessionStorage.getItem("log_info");
    return savedData ? JSON.parse(savedData) : null;
  }

  function setAuthInfo(auth_token: string, is_logged: boolean){
    setAuthToken(auth_token);
    setIsLogged(is_logged);
  }

  useEffect(() => {
    const logInfo = getLogInfo()
    if(logInfo !== null){
      setAuthInfo(logInfo.auth_token, logInfo.is_logged)
    }
  }, [])

  return (
    <AuthContext.Provider value={{is_logged, auth_token, setAuthInfo}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider