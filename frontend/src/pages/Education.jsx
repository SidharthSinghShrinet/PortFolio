import React from "react";
import { useSelector } from "react-redux";

const Education = () => {
  const toggle = useSelector((state) => state.global.toggle);
  return (
    <div className="min-h-[55vh] w-full flex justify-center bg-neutral-200 pb-10">
      <div className="w-full lg:w-[75%] h-full">
        <div className="flex flex-col gap-2 lg:mx-0 lg:my-16 my-8 mx-6">
          <p
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider ${
              toggle ? "text-black" : "text-white"
            }`}
          >
            Education
          </p>
          <div className="w-36 rounded-full h-1 bg-purple-600"></div>
        </div>
        <div className="w-full flex justify-center">
            <div className="w-[80%] border-2 p-8 rounded-2xl shadow-2xl flex flex-col gap-3 bg-white">
                <div className="max-lg:flex-col max-lg:items-start flex justify-between items-center">
                    <h3 className="text-xl lg:text-3xl text-neutral-00 font-extrabold tracking-wide">Bachelor of Technology (B.Tech)</h3>
                    <p className="text-indigo-700 bg-indigo-200 w-fit text-xs lg:text-lg rounded-3xl px-2 py-1">2021-2025</p>
                </div>
                <p className="text-xl lg:text-2xl text-gray-500 font-normal">Dr.APJ Abdul Kalam Technical University, Lucknow</p>
                <ul className="text-lg   lg:text-xl flex flex-col gap-2 list-disc pl-5 text-gray-500 font-serif">
                    <li>Stream: Computer Science & Engineering</li>
                    <li>Graduation Year: 2025</li>
                    <li>CGPA: 7.03</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
