import React from 'react'
import Navbar from './component/Navbar'
import HomePage from './pages/HomePage'
import { useSelector } from 'react-redux'
import About from './pages/About'
import Skills from './pages/Skills'

const App = () => {
  return (
    <div className={`min-h-screen flex flex-col`}>
      <Navbar/>
      <HomePage/>
      <About/>
      <Skills/>
    </div>
  )
}

export default App