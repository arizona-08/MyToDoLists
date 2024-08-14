import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthContext } from '../Context/useAuthContext'

function Welcome() {
    const {is_logged, auth_token} = useAuthContext();
    return (
        <div>
            <Navbar/>
            <h2 className='text-2xl font-medium mb-5'>Bienvenue sur MyLists</h2>
            {!is_logged &&
                <>
                    <Link to={"/login"} className='underline mr-5'>Se connecter</Link>
                    <Link to={"/register"} className='underline'>Créer un compte</Link>
                </>
                
            }
            {is_logged &&
                <Link to={`/my-lists/${auth_token}`}>Accéder à mes listes</Link>
            }
        </div>
    )
}

export default Welcome