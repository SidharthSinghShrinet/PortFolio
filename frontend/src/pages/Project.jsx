import ExpandableCardDemo from "@/components/expandable-card-demo-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Project = () => {
  const toggle = useSelector((state)=>state.global.toggle);
  const projectTitle = ["All","Full Stack","Frontend","Backend"];
  const [colour,setColour] = useState(0);
  const [targetColour,setTargetColour] = useState("");
  useEffect(()=>{
    let filterColour = projectTitle[colour];
    setTargetColour(filterColour);
  },[colour]);
  // console.log(colour);
  return (
    <div className={`min-h-screen w-full flex justify-center items-center ${toggle?"bg-gray-100":"bg-gray-900"}`}>
      <div className="w-[87%] h-full lg:w-[75%]">
        <div className="flex flex-col gap-2 lg:mx-0 lg:my-16 my-8 mx-6">
          <p
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider ${
              toggle ? "text-black" : "text-white"
            }`}
          >
            Projects
          </p>
          <div className="w-28 rounded-full h-1 bg-purple-600"></div>
        </div>
        <div className="w-full h-15 flex justify-center items-center gap-5">
          {projectTitle.map((title,idx)=>(
            <div key={idx} onClick={()=>setColour(idx)} className={`border-1 border-black px-2 lg:px-4 py-1 rounded-4xl ${targetColour===title?"bg-purple-800 text-white":"bg-gray-600 text-white"} cursor-pointer`}>{title}</div>
          ))}
        </div>
        <div className="w-full h-fit">
          <ExpandableCardDemo/>
        </div>
      </div>
    </div>
  );
};

export default Project;
