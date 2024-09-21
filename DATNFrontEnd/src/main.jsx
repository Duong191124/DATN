import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
<<<<<<< HEAD
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>   
//   }
// ])
=======
import './index.css'
>>>>>>> 1e4f6982c143bab00787235b917bfd66aa4ecc0b

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
