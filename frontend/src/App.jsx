import { useState } from 'react'
import Header from './component/layout/header'
import { Outlet } from 'react-router-dom'
import Footer from './component/layout/footer'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
