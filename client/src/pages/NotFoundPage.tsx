import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-[500px] m-auto flex flex-col gap-2 items-center">
        <h2 className="text-3xl font-bold">On dirait que vous êtes perdu! ;p</h2>
		<Link to={"/"}>Retrouver mon chemin</Link>
      </div>
    </div>
    
  )
}

export default NotFoundPage