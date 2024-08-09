import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Welcome() {
  return (
    <div>
        <Navbar/>
        <h2 className='text-2xl font-medium mb-5'>Bienvenue sur MyLists</h2>
        <Link to={"/login"} className='underline mr-5'>Se connecter</Link>
        <Link to={"/register"} className='underline'>Créer un compte</Link>
    </div>
  )
}

export default Welcome