import { Link } from "react-router-dom"

interface BoardPreviewProps{
    boardPreviewName: string,
    auth_token: string | undefined,
    board_id: string | number
}

function BoardPreview({ boardPreviewName, auth_token, board_id }: BoardPreviewProps) {
  return (
    <Link to={`/board/${auth_token}/${board_id}`} className="font-medium hover:underline">{boardPreviewName}</Link>
  )
}

export default BoardPreview