import React from 'react'
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { useSelector } from 'react-redux';
const Footer = () => {
    const toggle = useSelector((state)=>state.global.toggle);
  return (
    <div className={`w-full h-40 flex justify-center ${toggle?"bg-gray-100 text-gray-800":"bg-gray-900 text-gray-300"} border-t-1 border-gray-700`}>
        <div className='w-[87%] h-full flex flex-col justify-center items-center gap-3'>
            <p className='text-md tracking-wide'>Built with ❤️ by Sidharth</p>
            <div className='flex gap-2'>
                <div className='p-2 rounded-full hover:scale-110 duration-400'><FiGithub/></div>
                <div className='p-2 rounded-full hover:scale-110 duration-400'><FaLinkedinIn/></div>
            </div>
            <p className='text-sm tracking-wider'>© 2025 Sidharth Singh. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer