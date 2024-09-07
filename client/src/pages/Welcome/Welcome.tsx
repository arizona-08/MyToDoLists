import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import single_task_icon from "/logos/single_task_icon.svg";
import "./welcome.css";
import { useAuthContext } from '../../Context/useAuthContext'

function Welcome() {
    const {is_logged, auth_token} = useAuthContext();
    return (
        <>
            <main className='main w-full relative flex flex-col items-center overflow-hidden '>
                <Navbar/>
                <section className='mt-20 px-3 w-full md:w-10/12 lg:w-3/4 2xl:w-1/ flex flex-col items-center relative'>

                    {/* :nth-child only works when direct children */}
                    <div className='task-icon'>
                        <img src={single_task_icon} alt="task" />
                    </div>

                    <div className='task-icon'>
                        <img src={single_task_icon} alt="task" />
                    </div>

                    <div className='task-icon'>
                        <img src={single_task_icon} alt="task" />
                    </div>

                    <div className='task-icon'>
                        <img src={single_task_icon} alt="task" />
                    </div>

                    <h2 className='text-5xl mt-24 sm:text-6xl md:text-7xl font-bold text-center mb-10'>Ne Soyez Plus Jamais <span className='text-blue-500'>Désorganisé</span></h2>
                    <p className='text-center text-[#686868] text-xl w-10/12'>
                        <span className='font-semibold'>MyToDoLists</span> vous aidera pour l’organisation de vos tâches au quotidien.
                    </p>
                    {!is_logged &&
                        <div className='w-full flex flex-col justify-center gap-4 mt-11 text-center sm:flex-row'>
                            <Link to={"/register"} className='inline-block border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all text-white font-semibold uppercase py-1 px-2'>Créer un compte</Link>
                            <Link to={"/login"} className='inline-block border border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600 transition-all font-semibold uppercase py-1 px-2'>Se connecter</Link>
                        </div>
                        
                    }
                    {is_logged &&
                        <div className='w-full flex justify-center mt-11'>
                            <Link to={`/my-lists/${auth_token}`} className='inline-block bg-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all text-white font-semibold uppercase py-1 px-2'>Accéder à mes listes</Link>
                        </div>
                        
                    }
                    
                </section>
            </main>
        </>
        
    )
}

export default Welcome