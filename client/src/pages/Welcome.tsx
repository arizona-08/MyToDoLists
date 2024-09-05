import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuthContext } from '../Context/useAuthContext'

function Welcome() {
    const {is_logged, auth_token} = useAuthContext();
    return (
        <div className='w-full h-screen'>
            <Navbar/>
            <section className='w-full md:w-10/12 lg:w-3/4 2xl:w-1/2 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>
                <h2 className='text-3xl sm:text-4xl md:text-7xl font-bold text-center mb-5'>Ne soyez plus jamais <span className='text-blue-500'>désorganisé.</span></h2>
                {!is_logged &&
                    <div className='w-full flex justify-center mt-11'>
                        <Link to={"/login"} className='inline-block bg-blue-500 text-white font-medium p-2 mr-5'>Se connecter</Link>
                        <Link to={"/register"} className='inline-block border-2 border-blue-500 text-blue-500 font-medium p-2'>Créer un compte</Link>
                    </div>
                    
                }
                {is_logged &&
                    <div className='w-full flex justify-center mt-11'>
                        <Link to={`/my-lists/${auth_token}`} className='inline-block bg-blue-500 text-white font-medium p-2' >Accéder à mes listes</Link>
                    </div>
                    
                }
            </section>
            
        </div>
    )
}

export default Welcome