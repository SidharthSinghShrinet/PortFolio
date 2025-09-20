import React from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Example = () => {
  return (
    <div className="grid place-content-center">
      <DrawOutlineButton><Link to={"https://linkedin.com/in/sidharth-singh-b3aaa623b"} target="_blank">Hire Me</Link></DrawOutlineButton>
    </div>
  );
};

const DrawOutlineButton = ({ children, ...rest }) => {
  const toggle = useSelector((state)=>state.global.toggle);
  return (
    <button
      {...rest}
      className={`group relative px-3 text-lg py-1 font-medium ${toggle?"text-black border-black":"text-slate-100 border-white"} transition-colors duration-[400ms] border-2 hover:${toggle?"text-gray-800":"text-indigo-300"} hover:border-none`}
    >
      <span>{children}</span>

      {/* TOP */}
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-red-500 transition-all duration-100 group-hover:w-full" />

      {/* RIGHT */}
      <span className="absolute right-0 top-0 h-0 w-[2px] bg-blue-500 transition-all delay-100 duration-100 group-hover:h-full" />

      {/* BOTTOM */}
      <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-green-500 transition-all delay-200 duration-100 group-hover:w-full" />

      {/* LEFT */}
      <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-yellow-600 transition-all delay-300 duration-100 group-hover:h-full" />
    </button>
  );
};

export default Example;