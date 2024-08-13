import { useEffect, useState } from "react"
import { v4 as uuidv4} from "uuid"
import Slot from "./Slot"
import { useParams } from "react-router-dom"
import Navbar from "./Navbar"
import axios from "axios"
import NotFoundPage from "../pages/NotFoundPage"

interface SlotType{
  id: string
  title: string
}

interface BoardParams{
	id: number,
	board_name: string
}

function Board() {
	const urlParams = useParams();
	const url_auth_token = urlParams.auth_token;
	const url_board_id = urlParams.board_id;
	const [board, setBoard] = useState<BoardParams>();

	const [slots, setSlots] = useState<SlotType[]>([])
	function addSlot(){
		// const slot: React.ReactNode = <Slot key={slots.length}/>
		const newSlot = {id: uuidv4(), title: "Nom du slot"}
		setSlots([...slots, newSlot]);
	}

	//permet de mettre à jour le composant slot en question
	function editSlotTitle(slotId: string, newTitle: string){
		setSlots(
			slots.map((slot) => 
			slot.id === slotId ? {...slot, title: newTitle} : slot
			)
		)
	}

	function deleteSlot(slotId: string){
		setSlots(slots.filter(slot => slot.id !== slotId));
	}

	useEffect(() => {
		async function getBoard(){
			try{
				const response = await axios.get("http://localhost:3000/api/get-board", {
					params: {
						auth_token: url_auth_token,
						board_id: url_board_id
					}
				});

				if(response.data.success){
					setBoard(response.data.boards)
				}
			} catch (err) {
				console.error("Error fetching board data: ", err);
			}
			
		}

		getBoard();

	}, []);

	if(board){
		return (
			<>
				<Navbar/>
				<div className="mx-5 my-5">
					<h1 className="text-5xl font-thin mb-6">{board?.board_name}</h1>
					<button className="bg-blue-500 text-white px-3 py-2 rounded-md mb-3 hover:bg-blue-600" onClick={() => addSlot()}>Ajouter un slot +</button>
					<div className="flex gap-6">
						{slots.map((slot) => (
							<Slot 
								key={slot.id} 
								slotId={slot.id} 
								title={slot.title} 
								onTitleEdit={editSlotTitle} 
								onSlotDelete={() => deleteSlot(slot.id)}
							/>
						))}
					</div>
				</div>
			</>
			
		)
	} else {
		return <NotFoundPage/>
	}
	
}

export default Board