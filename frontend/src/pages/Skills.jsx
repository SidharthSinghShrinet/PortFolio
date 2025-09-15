import { FocusCards} from "@/components/ui/focus-cards";
import React from "react";
import { useSelector } from "react-redux";
import { IoCode } from "react-icons/io5";
import { FaReact } from "react-icons/fa6";
import { FaServer } from "react-icons/fa";
import { BsDatabase } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import { PiNetwork } from "react-icons/pi";
import { MdOutlineSecurity } from "react-icons/md";
import { TbPlugConnected } from "react-icons/tb";
import { FaTools } from "react-icons/fa";

const Skills = () => {
  let toggle = useSelector((state) => state.global.toggle);
  const skillCards = [
    {
      icon:<IoCode/>,
      title: "Programming Language",
      items:["JavaScript(ES5,ES6)","Python","C Language"]
    },
    {
      icon:<FaReact/>,
      title: "Frontend Technologies",
      items:["HTML","CSS","ReactJS","Redux","Tailwind CSS","Bootstrap","Shadcn","Framer Motion","TypeScript"],
    },
    {
      icon:<FaServer/>,
      title: "Backend Technologies",
      items:["NodeJS","ExpressJS"],
    },
    {
      icon:<BsDatabase/>,
      title: "Database",
      items:["MongoDB","MySQL","Mongoose"],
    },
    {
      icon:<FaCode/>,
      title:"Data Structures & Algorithms",
      items:["JavaScript"]
    },
    {
      icon:<PiNetwork/>,
      title: "Realtime & Communication",
      items:["Websocket","Socket.IO"],
    },
    {
      icon:<MdOutlineSecurity/>,
      title: "Authentication & Security",
      items:["JSON Web Token(JWT)","Bcrypt.js","OAuth"],
    },
    {
      icon:<TbPlugConnected/>,
      title: "API Handling & Middleware",
      items: ["Axios","FetchAPI","Express Validator","Postman","REST APIs"],
    },
    {
      icon:<FaTools/>,
      title: "DevOps & Tools",
      items:["Git","GitHub","Figma","Chrome DevTools","Render","Vercel","Hostinger"]
    },
  ];
  return (
    <div className="min-h-screen w-full bg-green-400">
      <div className="flex flex-col gap-2">
        <p
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider ${
            toggle ? "text-black" : "text-white"
          }`}
        >
          Skills
        </p>
        <div className="w-28 rounded-full h-1 bg-purple-600"></div>
      </div>
      <FocusCards cards={skillCards}/>
    </div>
  );
};

export default Skills;
