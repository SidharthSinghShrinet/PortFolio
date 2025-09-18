import React from 'react'
import Navbar from './component/Navbar'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Skills from './pages/Skills'
import Project from './pages/Project'
import Education from './pages/Education'
import Contact from './pages/Contact'

const App = () => {
  return (
    <div className={`min-h-screen flex flex-col`}>
      <Navbar/>
      <HomePage/>
      <About/>
      <Skills/>
      <Project/>
      <Education/>
      <Contact/>
    </div>
  )
}

export default App