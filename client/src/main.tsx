import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AllLists from './components/AllLists.tsx'
import './index.css'
import NotFoundPage from './pages/NotFoundPage.tsx'
import Board from './components/Board.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import Welcome from './pages/Welcome.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome/>,
    errorElement: <NotFoundPage/>
  },
  {
    path: "/register",
    element: <RegisterPage/>,
    errorElement: <NotFoundPage/>
  },
  {
    path: "/login",
    element: <LoginPage/>,
    errorElement: <NotFoundPage/>
  },
  {
    path: "/my-lists/:user",
    element: <AllLists/>,
    errorElement: <NotFoundPage/>
  },
  {
    path: "/board/:auth_token/:board_id",
    element: <Board/>,
    errorElement: <NotFoundPage/>
  },
  
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
