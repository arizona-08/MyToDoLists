import { useState } from "react";
import BoardPreview from "./BoardPreview";
import Navbar from "./Navbar";
import CreatePreviewForm from "./CreatePreviewForm";

interface BoardPreviewType{
	boardPreviewName: string
}

function AllLists() {
	const[boardPreviews, setBoardPreviews] = useState<BoardPreviewType[]>([]);
	const [showCreatePreviewForm, setShowCreatePreviewForm] = useState<boolean>(false); //permet d'afficher le formulaire de cration d'une liste
	
	//ajoute une preview au tableau de preview
	function addBoardPreview(name: string){
		const newBoardPreview: BoardPreviewType = {boardPreviewName: name};
		setBoardPreviews([...boardPreviews, newBoardPreview]);
		setShowCreatePreviewForm(false);
	}

	function handleOnClose(){
		setShowCreatePreviewForm(false);
	}

	return (
		<>
			<Navbar/>
			
			<div className="container p-4">
				<h2 className="text-3xl font-bold mb-2">Mes ToDoLists</h2>
				{showCreatePreviewForm && <CreatePreviewForm createPreview={addBoardPreview} onClose={handleOnClose}/>} {/*affichage du formulaire si show showCreatePreviewForm*/}
				
				{/* change l'état de showCreatePreviewForm */}
				<button onClick={() => setShowCreatePreviewForm(true)} className="p-2 bg-blue-500 rounded-md mb-2 text-white">Ajouter une ToDoList</button>
				<div className="boardsContainer flex flex-wrap gap-2">
					{boardPreviews.map((preview, index) => (
						<BoardPreview key={index} boardPreviewName={preview.boardPreviewName}/>
					))}
				</div>
			</div>
		</>
	)
}

export default AllLists