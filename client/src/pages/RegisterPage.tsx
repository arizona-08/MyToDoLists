import { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [name, setName] = useState<string>("");
    const [firstname, setFirstname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();
    function handleConfirm(e: React.MouseEvent){
        e.preventDefault();
        // console.log(name, firstname, email, password);
        axios.post("http://localhost:3000/api/create-user", {
            name: name,
            firstname: firstname,
            email: email,
            password: password
        }).then(function (response) {
            console.log(response);
            navigate("/login");
        }).catch(function (error) {
            console.error(error);
        });


    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, func: (value: string)=> void){
        func(e.target.value);
    }

    const checks = (name === "") || (firstname === "") || (email === "") || (password === "");
    const buttonEnableClass = "mt-3 bg-blue-500 p-2 rounded-md text-white";
    const buttonDisabledClass = "mt-3 bg-blue-200 p-2 rounded-md text-white";
    return (
        <div className='w-full h-screen'>
            <Navbar/>
            <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center">
                <form action="" className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-5 border rounded-md flex flex-col items-center">
                    <h1 className="text-2xl font-medium mb-5 ">S'inscrire sur MyLists</h1>
                    <div className="flex flex-col items-center gap-3 w-full">
                        <div className="flex flex-col w-3/4">
                            <label htmlFor="name">Nom:</label>
                            <input 
                                type="text" 
                                id="name" 
                                onChange={(e) => handleChange(e, setName)}
                                className="border p-1 rounded-md"
                            />
                        </div>
                        
                        <div className="flex flex-col w-3/4">
                            <label htmlFor="firstname">Prénom:</label>
                            <input 
                                type="text" 
                                id="firstname" 
                                onChange={(e) => handleChange(e, setFirstname)}
                                className="border p-1 rounded-md"
                            />
                        </div>
                        
                        <div className="flex flex-col w-3/4">
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="text" 
                                id="email" 
                                onChange={(e) => handleChange(e, setEmail)}
                                className="border p-1 rounded-md"
                            />
                        </div>
                        
                        <div className="flex flex-col w-3/4">
                            <label htmlFor="password">Mot de passe:</label>
                            <input 
                                type="password" 
                                id="password" 
                                onChange={(e) => handleChange(e, setPassword)}
                                className="border p-1 rounded-md"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={(e) => handleConfirm(e)}
                        disabled={checks}
                        className={checks ? buttonDisabledClass : buttonEnableClass}
                    >Confirmer</button>
                </form>
            </div>
            
        </div>
        
    )
}

export default RegisterPage