import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const About = () => {
  const toggle = useSelector((state)=>state.global.toggle)
  return (
    <motion.div
      className={`h-[500px] w-full items-center flex ${toggle?"bg-gray-100":"bg-gray-900"} justify-center`}
      initial={{ opacity: 0, y: 200 }}   // start hidden
      whileInView={{ opacity: 1, y: 0 }} // animate when in view
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }} // animate only once
    >
      <div className="w-[75%] lg:w-[75%] h-full flex flex-col justify-evenly">
        <div className="flex flex-col gap-2">
          <p className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider ${toggle?"text-black":"text-white"}`}>
            About Me
          </p>
          <div className="w-28 rounded-full h-1 bg-purple-600"></div>
        </div>
        <div className={`flex flex-col gap-7 ${toggle?"text-gray-700":"text-gray-300"}`}>
          <p className="text-base sm:text-lg lg:text-xl font-semibold">
            Passionate and results-driven B.TECH graduate with hands-on experience
            building 60+ React projects, 15+ MERN applications, and planning to master AI integration in development.
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-semibold">
            Solved 200+ LeetCode problems, showcasing strong problem-solving
            skills. Proficient in full-stack development, and
            scalable architecture design, aiming to excel in innovative IT
            roles.
          </p>
        </div>
        <div className={`${toggle?"text-gray-800":"text-gray-300"}`}>
          <p className="text-center text-xl italic">
            "Crafting beautiful code is my passion, solving problems is my mission."
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
