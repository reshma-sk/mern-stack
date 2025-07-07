import { createBrowserRouter,RouterProvider} from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Users from './components/Users'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <RouterProvider router={appLayout}/>
    <ToastContainer position="top-right" autoClose={3000} />
    </>    
  )
}

const appLayout = createBrowserRouter([
  {
    path:'/',
    element:<Login/>,
  },
  {
    path:'/users',
    element:<Users/>,
  },
])
export default App
