import axios from "axios";
import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from "../Context/useAuthContext";


function Navbar() {
	const { is_logged, auth_token, setAuthInfo } = useAuthContext()
	const navigate = useNavigate();

	// console.log(auth_token);

	async function handleLogout(){
		const response = await axios.patch("http://localhost:3000/api/logout", {auth_token});

		if(response.data.success){
			sessionStorage.removeItem("log_info");
			setAuthInfo("", false);
			navigate("/"); //retour à la page de connexion
		} else {
			console.error("Something wrong happend", response.data.message);
		}
	}

	return (
		<div className="navbar p-4 bg-black text-white flex justify-between items-center">
			<h1 className="text-6xl font-semibold"><Link to={"/"}>MyLists</Link></h1>

			{is_logged && 
				<div>
					<span onClick={async () => await handleLogout()} className="underline cursor-pointer">Se Déconnecter</span>
				</div>
			}
		</div>
	)
}

export default Navbar