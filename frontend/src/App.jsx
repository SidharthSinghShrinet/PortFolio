import React from 'react'
import Navbar from './component/Navbar'
import HomePage from './pages/HomePage'
import { useSelector } from 'react-redux'
import About from './pages/About'
import Skills from './pages/Skills'

const App = () => {
  let toggle = useSelector((state)=>state.global.toggle);
  return (
    <div className={`min-h-screen ${toggle?"bg-white":"bg-black"} flex flex-col`}>
      <Navbar/>
      <HomePage/>
      <About/>
      <Skills/>
    </div>
  )
}

export default App