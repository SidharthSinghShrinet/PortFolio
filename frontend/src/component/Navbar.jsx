import React, { useState } from 'react'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Drawer from "@/component/Drawer"
import { useDispatch, useSelector } from 'react-redux';
import { setToggle } from '../redux/globalSlice';
import { Link } from 'react-router-dom';
const Navbar = () => {
    let toggle = useSelector((state)=>state.global.toggle);
    let dispatch = useDispatch();
  return (
    <div className={`sticky z-1000 w-full top-0 left-0 right-0 lg:w-full h-[96px] ${toggle?"bg-white":"bg-black text-white"} flex justify-around items-center border-b-1 border-gray-400  max-lg:justify-between text-2xl max-lg:h-16 max-lg:p-5`}>
        <h2 className='lg:text-4xl font-bold tracking-wide'><span className={`${toggle?"text-black":"text-purple-500"}`}>S</span>iDHArt<span className={`${toggle?"text-black":"text-purple-500"}`}>H</span></h2>
        <ul className='hidden lg:flex gap-10 text-2xl font-normal'>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/skills">Skills</Link></li>
            <li><Link to="/project">Projects</Link></li>
            <li><Link to="/education">Education</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li onClick={()=>dispatch(setToggle(!toggle))}>
                {toggle?<DarkModeIcon/>:<LightModeIcon/>}
            </li>
        </ul>
        <div className='lg:hidden flex justify-center items-center gap-8'>
            <div onClick={()=>dispatch(setToggle(!toggle))}>
                {toggle?<DarkModeIcon/>:<LightModeIcon/>}
            </div>
            <div className=''>
                <Drawer/>
            </div>
        </div>
    </div>
  )
}

export default Navbar