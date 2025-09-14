import React, { useState } from 'react'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen, setToggle } from '../redux/globalSlice';
const Navbar = () => {
    let toggle = useSelector((state)=>state.global.toggle);
    let open = useSelector((state)=>state.global.open);
    // console.log(open);
    // console.log(toggle);
    let dispatch = useDispatch();
  return (
    <div className={`lg:w-full h-[96px] ${toggle?"bg-white":"bg-black text-white"} flex justify-around items-center border-b-1 border-gray-400  max-lg:justify-between text-2xl max-lg:h-16 max-lg:p-5`}>
        <h2 className='lg:text-4xl font-bold tracking-wide'><span className={`${toggle?"text-black":"text-purple-500"}`}>S</span>iDHArt<span className={`${toggle?"text-black":"text-purple-500"}`}>H</span></h2>
        <ul className='hidden lg:flex gap-10 text-2xl font-normal'>
            <li><a href="">Home</a></li>
            <li><a href="">About</a></li>
            <li><a href="">Skills</a></li>
            <li><a href="">Projects</a></li>
            <li><a href="">Education</a></li>
            <li><a href="">Contact</a></li>
            <li onClick={()=>dispatch(setToggle(!toggle))}>
                {toggle?<DarkModeIcon/>:<LightModeIcon/>}
            </li>
        </ul>
        <div className='lg:hidden flex gap-8'>
            <div onClick={()=>dispatch(setToggle(!toggle))}>
                {toggle?<DarkModeIcon/>:<LightModeIcon/>}
            </div>
            <div>
                <MenuIcon onClick={()=>dispatch(setOpen(!open))}/>
            </div>
        </div>
    </div>
  )
}

export default Navbar