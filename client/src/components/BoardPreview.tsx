import { Link } from "react-router-dom"

interface BoardPreviewProps{
    boardPreviewName: string
}

function BoardPreview({ boardPreviewName }: BoardPreviewProps) {
  return (
    <Link to={`/board/:${boardPreviewName}`} className="font-medium hover:underline">{boardPreviewName}</Link>
  )
}

export default BoardPreview