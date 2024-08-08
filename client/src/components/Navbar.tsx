import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className="navbar p-4 bg-black text-white">
        <h1 className="text-6xl font-semibold"><Link to={"/"}>MyLists</Link></h1>
    </div>
  )
}

export default Navbar