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
import { DraggableCardDemo } from "@/component/DraggableCardDemo";

const Skills = () => {
  let toggle = useSelector((state) => state.global.toggle);
  const items = [
    {
      icon: <FaTools />,
      title: "DevOps & Tools",
      items: [
        "Git",
        "GitHub",
        "Figma",
        "Chrome DevTools",
        "Render",
        "Vercel",
        "Hostinger",
      ],
      className:
      "absolute top-10 left-[20%] rotate-[-5deg] flex flex-col justify-between",
    },
    {
      icon: <TbPlugConnected />,
      title: "API Handling & Middleware",
      items: ["Axios", "FetchAPI", "Express Validator", "Postman", "REST APIs"],
      className:
      "absolute top-40 left-[25%] rotate-[-7deg] flex flex-col justify-between",
    },
    {
      icon: <MdOutlineSecurity />,
      title: "Authentication & Security",
      items: ["JSON Web Token(JWT)", "Bcrypt.js", "OAuth"],
      className:
      "absolute top-5 left-[40%] rotate-[8deg] flex flex-col justify-between",
    },
    {
      icon: <PiNetwork />,
      title: "Realtime & Communication",
      items: ["Websocket", "Socket.IO"],
      className:
      "absolute top-20 right-[35%] rotate-[2deg] flex flex-col justify-between",
    },
    {
      icon: <FaCode />,
      title: "Data Structures & Algorithms",
      items: ["JavaScript"],
      className:
      "absolute top-24 left-[45%] rotate-[-7deg] flex flex-col justify-between",
      },
      {
        icon: <BsDatabase />,
        title: "Database",
        items: ["MongoDB", "MySQL", "Mongoose"],
        className:
        "absolute top-32 left-[55%] rotate-[10deg] flex flex-col justify-between",
      },
      {
        icon: <FaServer />,
        title: "Backend Technologies",
        items: ["NodeJS", "ExpressJS"],
        className:
        "absolute top-8 left-[30%] rotate-[4deg] flex flex-col justify-between",
      },
      {
        icon: <FaReact />,
        title: "Frontend Technologies",
        items: [
          "HTML",
          "CSS",
          "ReactJS",
          "Redux",
          "Tailwind CSS",
          "Bootstrap",
          "Shadcn",
        "Framer Motion",
        "TypeScript",
      ],
      className:
      "absolute top-5 left-[35%] rotate-[-7deg] flex flex-col justify-between",
    },
    {
      icon: <IoCode />,
      title: "Programming Language",
      items: ["JavaScript(ES5,ES6)", "Python", "C Language"],
      className:
      "absolute top-5 left-[40%] rotate-[8deg] flex flex-col justify-between",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col justify-start items-center ${
        toggle ? "bg-white" : "bg-black"
      }`}
    >
      <div className="w-[75%] max-lg:w-full">
        <div className="flex flex-col gap-2 lg:mx-0 lg:my-16 my-8 mx-13">
          <p
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider ${
              toggle ? "text-black" : "text-white"
            }`}
          >
            Skills
          </p>
          <div className="w-18 rounded-full h-1 bg-purple-600"></div>
        </div>
        <div>
          <DraggableCardDemo items={items} />
        </div>
      </div>
    </div>
  );
};

export default Skills;
