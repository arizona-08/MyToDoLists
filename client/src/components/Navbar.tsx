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
		<div className="mx-auto navbar py-4 px-7 relative top-0 w-full">
			<div className="flex justify-between items-center">
				<div className="logo w-56">
					<Link to={"/"}><img src={logo_inline} alt="logo"/></Link>
				</div>
				<div className="sm:hidden">
					<BurgerMenu isActive={isActive} OnClick={handleOnClick}/>
				</div>

				{/* Only shows at 640px and above */}
				<div className="hidden sm:block">
					<div className="navLinks">
						<nav>
							<ul className="flex gap-2 text-sm">
								{is_logged ?
									(
										<>
											<li className="inline-block p-2 border border-blue-500 bg-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all text-white uppercase font-semibold"><Link to={`/my-lists/${auth_token}`}>Mes listes</Link> </li>
											<li className="inline-block p-2 border border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600 transition-all uppercase font-semibold"><span onClick={async () => await handleLogout()} className="cursor-pointer">Se Déconnecter</span></li>
										</>
										
									)
									:
									(
										<>
											<li className="inline-block p-2 border border-blue-500 bg-blue-500 text-white uppercase font-semibold"><Link to={"/register"}>Créer un compte</Link> </li>
											<li className="inline-block p-2 border border-blue-500 text-blue-500 uppercase font-semibold"><Link to={"/login"}>Se connecter</Link> </li>
										</>
									)
								}
								
							</ul>
						</nav>
					</div>
				</div>
			</div>

			{isActive &&
				<div className="navLinks absolute z-10 w-full h-fit bg-[#ffffff52] backdrop-blur-sm p-2 transition-all sm:hidden">
					<nav>
						<ul>
							{is_logged ?
								(
									<>
										<li><Link className="flex items-center gap-1" to={`/my-lists/${auth_token}`}><p>Mes listes</p><img src={arrow} alt="flèche" /></Link></li>
										<li><span onClick={async () => await handleLogout()} className="cursor-pointer flex items-center gap-1">Se Déconnecter<img src={arrow} alt="flèche" /></span></li>
									</>
									
								)
								:
								(
									<>
										<li><Link className="flex items-center gap-1" to={"/register"}>Créer un compte<img src={arrow} alt="flèche" /></Link></li>
										<li><Link className="flex items-center gap-1" to={"/login"}>Se connecter<img src={arrow} alt="flèche" /></Link></li>
									</>
								)
							}
							
						</ul>
					</nav>
				</div>
			}
		</div>
	)
}

export default Navbar