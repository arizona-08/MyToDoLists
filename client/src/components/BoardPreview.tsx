import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom"

interface BoardPreviewProps{
    boardPreviewName: string,
    auth_token: string | undefined,
    board_id: number,
    onTitleEdit: (newTitle: string, board_id: number) => void
    onDelete: () => void;
}

function BoardPreview({ boardPreviewName, auth_token, board_id, onTitleEdit, onDelete }: BoardPreviewProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(boardPreviewName);
  function handleOnModify(){
    setIsOpen(false);
    setIsEditing(true);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>){
    setNewTitle(event.target.value);
}

  async function handleSave(){
    setIsEditing(false);

    if(newTitle === "") return;

    const response = await axios.patch("http://localhost:3000/api/update-board", {
      newTitle,
      auth_token,
      board_id
    });

    if(response.data.success){
      onTitleEdit(newTitle, board_id);
    }
  }
  return (
    
    <div id="preview-container" className="w-full flex flex-row justify-between items-start border p-2 rounded-md hover:bg-gray-50 sm:w-fit">
      {isEditing ? (
          <div className="font-medium text-xl inline-block w-full">
            <input
              type="text"
              value={newTitle}
              onChange={handleChange}
              onBlur={async () => await handleSave()}
              maxLength={20}
              autoFocus
              className="border w-full"
            />
            <p className="text-gray-400 text-xs">Dernièrement modifié le: 01/09/24</p>
          </div>
        ) : (
          <Link
            to={`/board/${auth_token}/${board_id}`}
            className="font-medium text-xl inline-block w-full"
          >
            <p>{boardPreviewName}</p>
            <p className="text-gray-400 text-xs">Dernièrement modifié le: 01/09/24</p>
          </Link>
      )}
      
      <div onClick={() => setIsOpen(!isOpen)} className="actions w-7 flex justify-center mt-1 cursor-pointer">
        
        <div className="relative h-4">
          <div className="dot w-1 h-1 bg-gray-800 rounded-full absolute top-0"></div>
          <div className="dot w-1 h-1 bg-gray-800 rounded-full absolute top-1/2"></div>
          <div className="dot w-1 h-1 bg-gray-800 rounded-full absolute top-full"></div>
        </div>
        

        {isOpen &&
            <div className="bg-white w-32 px-3 py-1 rounded-md border shadow-sm absolute -translate-x-16 translate-y-1/2 ">
              <button onClick={handleOnModify}>Modifier</button>
              <button onClick={onDelete}>Supprimer</button>
            </div>
        }
        
      </div>
    </div>
    
  )
}

export default BoardPreview