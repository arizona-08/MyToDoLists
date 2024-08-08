import { useState } from "react"
import { v4 as uuidv4} from "uuid"
import Slot from "./components/Slot"

interface SlotType{
  id: string
  title: string
}

function App() {
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
  return (
    <div className="mx-5 my-5">
		<h1 className="text-5xl font-bold mb-6">MA LISTE</h1>
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
  )
}

export default App