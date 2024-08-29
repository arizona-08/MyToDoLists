import { Link } from "react-router-dom"

interface BoardPreviewProps{
    boardPreviewName: string,
    auth_token: string | undefined,
    board_id: number,
    onDelete: () => void;
}



function BoardPreview({ boardPreviewName, auth_token, board_id, onDelete }: BoardPreviewProps) {
  
  return (
    <div>
      <Link to={`/board/${auth_token}/${board_id}`} className="font-medium hover:underline">{boardPreviewName}</Link>
      <button onClick={onDelete} className="ml-2">X</button>
    </div>
    
  )
}

export default BoardPreview