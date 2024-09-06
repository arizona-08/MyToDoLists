import { useState } from "react";
import { Link } from "react-router-dom"

interface BoardPreviewProps{
    boardPreviewName: string,
    auth_token: string | undefined,
    board_id: number,
    onDelete: () => void;
}

function BoardPreview({ boardPreviewName, auth_token, board_id, onDelete }: BoardPreviewProps) {
  const [open, setOpen] = useState<boolean>(false);
  
  return (
    
    <div id="preview-container" className="w-full flex flex-row justify-between items-start border p-2 rounded-md hover:bg-gray-50">
      <Link to={`/board/${auth_token}/${board_id}`} className="font-medium text-xl inline-block w-full">
        <div>
          {boardPreviewName}
          <p className="text-gray-400 text-xs">Dernièrement modifié le: 01/09/24</p>
        </div>
      </Link>
      
      <div onClick={() => setOpen(!open)} className="actions w-7 flex justify-center mt-1 cursor-pointer">
        
        <div className="relative h-4">
          <div className="dot w-1 h-1 bg-gray-800 rounded-full absolute top-0"></div>
          <div className="dot w-1 h-1 bg-gray-800 rounded-full absolute top-1/2"></div>
          <div className="dot w-1 h-1 bg-gray-800 rounded-full absolute top-full"></div>
        </div>
        

        {open &&
            <div className="bg-white w-32 px-3 py-1 rounded-md border shadow-sm absolute -translate-x-16 translate-y-1/2 ">
              <button>Modifier</button>
              <button onClick={onDelete}>Supprimer</button>
            </div>
        }
        
      </div>
    </div>
    
  )
}

export default BoardPreview