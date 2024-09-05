import axios from "axios";
import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from "../Context/useAuthContext";
import logo_inline from "/logos/logo_inline.svg";
import arrow from "/icons/arrow.svg";
import BurgerMenu from "./BurgerMenu/BurgerMenu";
import { useState } from "react";

function Navbar() {
	const { is_logged, auth_token, setAuthInfo } = useAuthContext()
	const navigate = useNavigate();

	const [isActive, setIsActive] = useState<boolean>(false);

	function handleOnClick(){
		setIsActive(!isActive);
	}

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
		<div className="navbar py-4 px-7 relative top-0 w-full ">
			<div className="flex justify-between items-center">
				<div className="logo w-60">
					<Link to={"/"}><img src={logo_inline} alt="logo"/></Link>
				</div>
				<BurgerMenu isActive={isActive} OnClick={handleOnClick}/>
			</div>

			{isActive &&
				<div className="navLinks w-full h-fit bg-[#ffffff52] p-2 transition-all">
					<nav>
						<ul>
							{is_logged ?
								(
									<>
										<li className="flex items-center gap-2"><Link to={`/my-lists/${auth_token}`}>Mes listes</Link> <img src={arrow} alt="flèche" /></li>
										<li className="flex items-center gap-2"><span onClick={async () => await handleLogout()} className="cursor-pointer">Se Déconnecter</span><img src={arrow} alt="flèche" /></li>
									</>
									
								)
								:
								(
									<>
										<li className="flex items-center gap-2"><Link to={"/register"}>Créer un compte</Link> <img src={arrow} alt="flèche" /></li>
										<li className="flex items-center gap-2"><Link to={"/login"}>Se connecter</Link> <img src={arrow} alt="flèche" /></li>
									</>
								)
							}
							
						</ul>
					</nav>
				</div>
			}
			

			{/* {is_logged && 
				<div>
					<ul className="flex items-center gap-7">
						<li className="underline"><Link to={`/my-lists/${auth_token}`}>Mes listes</Link></li>
						<li><span onClick={async () => await handleLogout()} className="underline cursor-pointer">Se Déconnecter</span></li>
					</ul>
					
				</div>
			} */}
		</div>
	)
}

export default Navbar