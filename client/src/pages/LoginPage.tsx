import { useState } from "react";
import Navbar from "../components/Navbar";

import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormErrors {
    [key: string]: string | undefined;
}

function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [formErrors, setErrors] = useState<FormErrors>({})

    const navigate = useNavigate();

    async function login(email: string, password: string){
        try {
            const result = await axios.post('http://localhost:3000/api/login', { email, password });
            if (result.data.success) {
                return result.data.id;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    }

    async function handleConfirm(e: React.MouseEvent){
        e.preventDefault();
        setErrors({});
        
        // console.log(user);
        const isLoggedIn = await login(email, password);

        if(!isLoggedIn){
            setErrors({...formErrors, wrongCredentials: "Identifiants invalid"});
        } else {
            navigate(`/my-lists/${isLoggedIn}`);
        }
    

    }

    // useEffect(() => {
    //     if(formErrors.userNotFound){
    //         console.log(formErrors.userNotFound)
    //     }
    // }, [formErrors]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, func: (value: string)=> void){
        func(e.target.value);
    }

    const checks = (email === "") || (password === "");
    const buttonEnableClass = "mt-3 bg-blue-500 p-2 rounded-md text-white";
    const buttonDisabledClass = "mt-3 bg-blue-200 p-2 rounded-md text-white";
    return (
        <>
            <Navbar/>
            <div className="w-full">
                <form action="" className="sm:w-full md:w-1/2 lg:w-1/3 p-5 border rounded-md mt-6 flex flex-col items-center m-auto">
                    <h1 className="text-2xl font-medium mb-5 ">Conexion</h1>
                    <div className="flex flex-col items-center gap-3 w-full">
                        
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="text" 
                                id="email" 
                                onChange={(e) => handleChange(e, setEmail)}
                                className="border p-1 rounded-md"
                            />
                        </div>
                        
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="password">Mot de passe:</label>
                            <input 
                                type="password" 
                                id="password" 
                                onChange={(e) => handleChange(e, setPassword)}
                                className="border p-1 rounded-md"
                            />
                        </div>
                    </div>
                    {formErrors.wrongCredentials}
                    <button 
                        onClick={async (e) => await handleConfirm(e)}
                        disabled={checks}
                        className={checks ? buttonDisabledClass : buttonEnableClass}
                    >Confirmer</button>
                </form>
            </div>
            
        </>
        
    )
}

export default LoginPage