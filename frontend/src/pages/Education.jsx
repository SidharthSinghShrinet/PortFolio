import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Education = () => {
  const toggle = useSelector((state) => state.global.toggle);
  return (
    <motion.div
      id="education"
      style={{ scrollMarginTop: "65px", scrollBehavior: "smooth" }}
      className={`min-h-[55vh] w-full flex justify-center ${
        toggle ? "bg-neutral-200" : "bg-black"
      } pb-10 lg:pb-25`}
      initial={{ opacity: 0, y: 250 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="w-full lg:w-[75%] h-full">
        <div className="flex flex-col gap-2 lg:mx-0 lg:my-16 my-8 mx-6">
          <p
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider ${
              toggle ? "text-black" : "text-white"
            }`}
          >
            Education
          </p>
          <div className="w-21 rounded-full h-1 bg-purple-600"></div>
        </div>
        <div className="w-full flex justify-center">
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "linear" }}
            viewport={{ once: true }}
            className={`w-[85%] lg:w-[80%] border-2 border-gray-200 hover:scale-105 duration-500 p-8 rounded-2xl shadow-2xl flex flex-col gap-3 ${
              toggle ? "bg-white" : "bg-neutral-800"
            }`}
          >
            <div className="max-lg:flex-col max-lg:items-start flex justify-between items-center">
              <h3
                className={`text-xl lg:text-3xl ${
                  toggle ? "text-black" : "text-white"
                } font-extrabold tracking-wide`}
              >
                Bachelor of Technology (B.Tech)
              </h3>
              <p className="text-indigo-700 bg-indigo-200 w-fit text-xs lg:text-lg rounded-3xl px-2 py-1">
                2021-2025
              </p>
            </div>
            <p
              className={`text-xl lg:text-2xl ${
                toggle ? "text-gray-500" : "text-gray-300"
              } font-normal`}
            >
              Dr.APJ Abdul Kalam Technical University, Lucknow
            </p>
            <ul
              className={`text-lg   lg:text-xl flex flex-col gap-2 list-disc pl-5 ${
                toggle ? "text-gray-500" : "text-gray-300"
              } font-serif`}
            >
              <li>Stream: Computer Science & Engineering</li>
              <li>Graduation Year: 2025</li>
              <li>CGPA: 7.03</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Education;
