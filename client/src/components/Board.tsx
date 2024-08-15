import { useEffect, useState } from "react"
import { v4 as uuidv4} from "uuid"
import Slot from "./Slot"
import { useParams } from "react-router-dom"
import Navbar from "./Navbar"
import axios from "axios"
import NotFoundPage from "../pages/NotFoundPage"

interface SlotType{
	char_id: string;
	title: string;
	is_firstEditing: boolean
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

	const [slots, setSlots] = useState<SlotType[]>([]);

	async function addSlot(){
		const newSlot = {char_id: uuidv4(), title: "Nom du slot", is_firstEditing: true}
		const response = await axios.post("http://localhost:3000/api/create-slot", {
			uuid: newSlot.char_id,
			title: newSlot.title,
			board_id: url_board_id
		});

		if(response.data.success){
			setSlots([...slots, newSlot]);
		} else {
			throw new Error("something wrong happened when creating new slot");
		}
		
	}

	//permet de mettre à jour le composant slot en question
	function editSlotTitle(slotId: string, newTitle: string){
		setSlots(
			slots.map((slot) => 
			slot.char_id === slotId ? {...slot, title: newTitle} : slot
			)
		)
	}

	async function deleteSlot(slotId: string){
		const response = await axios.delete("http://localhost:3000/api/delete-slot", {
			data: {
				char_id: slotId
			}
		});
		if(response.data.success){
			setSlots(slots.filter(slot => slot.char_id !== slotId));
		} else{
			console.error("error when deleting slot");
		}
		
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

		async function getSlots(){
			try{
				const response = await axios.get("http://localhost:3000/api/get-slots", {
					params: {
						board_id: url_board_id
					}
				});

				if(response.data.success){
					const fetchedSlots = response.data.slots;
					setSlots((prevSlots) => {
						const updatedSlots = [...prevSlots];
						fetchedSlots.forEach((slot: SlotType) => {
							// Ensure no duplicates are added
							if (!updatedSlots.some((s) => s.char_id === slot.char_id)) {
								updatedSlots.push({...slot, is_firstEditing: false});
							}
						});
						return updatedSlots;
					})
				}
			} catch (err){
				console.error("Something wrong happened when fetching slots", err);
			}
		}

		getBoard();
		getSlots();

	}, [url_auth_token, url_board_id]);

	if(board){
		return (
			<>
				<Navbar/>
				<div className="mx-5 my-5">
					<h1 className="text-5xl font-thin mb-6">{board?.board_name}</h1>
					<button className="bg-blue-500 text-white px-3 py-2 rounded-md mb-3 hover:bg-blue-600" onClick={async () => await addSlot()}>Ajouter un slot +</button>
					<div className="flex gap-6">
						{slots.map((slot) => (
							<Slot 
								key={slot.char_id} 
								slotId={slot.char_id} 
								title={slot.title}
								is_firstEditing={slot.is_firstEditing}
								onTitleEdit={editSlotTitle} 
								onSlotDelete={async () => await deleteSlot(slot.char_id)}
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