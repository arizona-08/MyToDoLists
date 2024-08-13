import { useEffect, useState } from "react";
import BoardPreview from "./BoardPreview";
import Navbar from "./Navbar";
import CreatePreviewForm from "./CreatePreviewForm";
import { useParams } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "../pages/NotFoundPage";

interface Board{
	id: number,
	board_name: string,
	user_id: number
}

interface User{
	id: number,
	name: string,
	firstname: string,
	email: string,
	password: string,
	auth_token: string,
	is_logged: boolean
}

function AllLists() {
	const [showCreatePreviewForm, setShowCreatePreviewForm] = useState<boolean>(false); //permet d'afficher le formulaire de cration d'une liste
	const [user, setUser] = useState<User>();
	const [boards, setBoards] = useState<Board[]>([]);
	const urlParams = useParams();
	const user_token = urlParams.user;

	//ajoute une preview au tableau de preview
	async function addBoardPreview(board_name: string){
		const user_id = user?.id;
		await axios.post("http://localhost:3000/api/create-board", {board_name, user_id});

		const request = await axios.get("http://localhost:3000/api/get-boards", {
			params: {
				auth_token: user_token
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

	useEffect(() => {

		async function getBoards(){
			const request = await axios.get("http://localhost:3000/api/get-boards", {
				params: {
					auth_token: user_token
				}
			});
			// console.log(request);
			if(request.data.user){
				setUser(request.data.user);

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
	},[user_token])

	// console.log(boards);
	
	// const response = request.then(response => console.log(response));
	if(user){
		return (
			<>
				<Navbar/>
				<div className="container p-4">
					<h2 className="text-3xl font-bold mb-2">Mes ToDoLists</h2>
					{showCreatePreviewForm && <CreatePreviewForm createPreview={addBoardPreview} onClose={handleOnClose}/>} {/*affichage du formulaire si show showCreatePreviewForm*/}
					
					{/* change l'état de showCreatePreviewForm */}
					<button onClick={() => setShowCreatePreviewForm(true)} className="p-2 bg-blue-500 rounded-md mb-2 text-white">Ajouter une ToDoList</button>
					<div className="boardsContainer flex flex-wrap gap-2">
						{boards.map((preview, index) => (
							<BoardPreview key={index} boardPreviewName={preview.board_name} auth_token={user_token} board_id={preview.id}/>
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