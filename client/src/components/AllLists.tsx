import { useEffect, useState } from "react";
import BoardPreview from "./BoardPreview";
import Navbar from "./Navbar";
import CreatePreviewForm from "./CreatePreviewForm";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "../pages/NotFoundPage";
import { useAuthContext } from "../Context/useAuthContext";

interface Board{
	id: number,
	board_name: string,
	user_id: number
}


function AllLists() {
	const [showCreatePreviewForm, setShowCreatePreviewForm] = useState<boolean>(false); //permet d'afficher le formulaire de cration d'une liste
	const [boards, setBoards] = useState<Board[]>([]);
	const urlParams = useParams();
	const user_token = urlParams.user;
	const {is_logged, auth_token} = useAuthContext();
	const navigate = useNavigate();

	//ajoute une preview au tableau de preview
	async function addBoardPreview(board_name: string){
		const user_id = auth_token;
		await axios.post("http://localhost:3000/api/create-board", {board_name, user_id});

		const request = await axios.get("http://localhost:3000/api/get-boards", {
			params: {
				auth_token: auth_token
			}
		});

		if(request.data.success){
			setBoards(request.data.boards);
		}
		setShowCreatePreviewForm(false);
	}

	function handleOnClose(){
		setShowCreatePreviewForm(false);
	}

	function editTitle(newTitle: string, board_id: number){
		setBoards(
			boards.map((board) => board.id === board_id ? {...board, board_name: newTitle} : board)
		)
	}

	async function deleteBoard(auth_token: string | undefined, board_id: number){
		const response = await axios.delete("http://localhost:3000/api/delete-board",{
			data: {
				auth_token,
				board_id
			}
		});
	
		if(response.data.success){
			setBoards(boards.filter((board) => board.id !== board_id));
		} else {
			console.error("couldn't delete board");
		}
	}

	useEffect(() => {

		async function getBoards(){
			const request = await axios.get("http://localhost:3000/api/get-boards", {
				params: {
					auth_token: user_token
				}
			});

			if(request.data.user){

				const fetchedBoards = request.data.boards;
				setBoards((prevBoards) => {
					const updatedBoards = [...prevBoards];
					fetchedBoards.forEach((board: Board) => {
						// Ensure no duplicates are added
						if (!updatedBoards.some((b) => b.id === board.id)) {
							updatedBoards.push(board);
						}
					});
					return updatedBoards;
				});
			}
		}

		getBoards();
	},[user_token ,navigate])

	if(auth_token && is_logged){
		return (
			<>
				<Navbar/>
				<div className="container p-4 mt-3 sm:max-w-xl sm:mx-auto md:max-w-3xl lg:max-w-5xl">
					<h2 className="text-4xl font-bold mb-2">Mes listes</h2>
					{showCreatePreviewForm && <CreatePreviewForm createPreview={addBoardPreview} onClose={handleOnClose}/>} {/*affichage du formulaire si show showCreatePreviewForm*/}
					
					{/* change l'état de showCreatePreviewForm */}
					<button onClick={() => setShowCreatePreviewForm(true)} className="p-2 bg-blue-500 mb-2 text-white">+ Créer une nouvelle liste</button>
					<div className="boardsContainer flex flex-wrap gap-2 mt-5">
						{boards.map((preview, index) => (
							<BoardPreview key={index} boardPreviewName={preview.board_name} auth_token={user_token} board_id={preview.id} onTitleEdit={editTitle} onDelete={async () => await deleteBoard(auth_token, preview.id)}/>
						))}
					</div>
				</div>
			</>
		)
	} else {
		return <NotFoundPage/>

	}
}

export default AllLists