import React from 'react'
import Navbar from './component/Navbar'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Skills from './pages/Skills'
import Project from './pages/Project'
import Education from './pages/Education'
import Contact from './pages/Contact'
import Footer from './component/Footer'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux'
import { BrowserRouter, Routes,Route } from 'react-router-dom'

const App = () => {
  const toggle = useSelector((state)=>state.global.toggle);
  return (
    <div className={`relative min-h-screen flex flex-col`}>
      <ToastContainer position='top-center' theme={toggle?"light":"dark"}/>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/skills" element={<Skills/>}/>
        <Route path="/project" element={<Project/>}/>
        <Route path="/Education" element={<Education/>}/>
        <Route path="/contact" element={<Contact/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App