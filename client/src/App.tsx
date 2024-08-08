import { useState } from "react";
import BoardPreview from "./components/BoardPreview";
import Navbar from "./components/Navbar";
import CreatePreviewForm from "./components/CreatePreviewForm";

interface BoardPreviewType{
	boardPreviewName: string
}

function App() {
	const[boardPreviews, setBoardPreviews] = useState<BoardPreviewType[]>([]);

	function handleOnCreate(){
		console.log("hello");
		return <CreatePreviewForm createPreview={addBoardPreview}/>
	}

	function addBoardPreview(name: string){
		const newBoardPreview: BoardPreviewType = {boardPreviewName: name};
		setBoardPreviews([...boardPreviews, newBoardPreview]);
	}
	return (
		<>
			<Navbar/>
			<div className="container p-4">
				<h2 className="text-3xl font-bold mb-2">Mes ToDoLists</h2>
				<button onClick={() => handleOnCreate()} className="p-2 bg-blue-500 rounded-md mb-2 text-white">Ajouter une ToDoList</button>
				<div className="boardsContainer flex flex-wrap gap-2">
					{boardPreviews.map((preview, index) => (
						<BoardPreview key={index} boardPreviewName={preview.boardPreviewName}/>
					))}
				</div>
			</div>
			
		</>
	)
}

export default App