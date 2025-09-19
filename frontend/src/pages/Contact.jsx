import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import Form from "@/component/Form";

const Contact = () => {
  const toggle = useSelector((state) => state.global.toggle);
  return (
    <motion.div className={`w-full min-h-[95vh] flex justify-center ${toggle?"bg-gray-300":"bg-gray-900"}`}
    initial={{opacity:0,y:250}}
    whileInView={{opacity:1,y:0}}
    transition={{duration:1,ease:"easeOut"}}
    viewport={{once:true}}>
      <div className="w-[91%] lg:w-[75%] h-full">
        <div className="flex flex-col gap-2 lg:mx-0 lg:my-16 my-8 mx-0">
          <p
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider ${
              toggle ? "text-black" : "text-white"
            }`}
          >
            Get In Touch
          </p>
          <div className="w-27 rounded-full h-1 bg-purple-600"></div>
        </div>
        <div className="w-full lg:flex max-lg:flex-col">
          <div className="lg:w-1/2 flex flex-col gap-5 pb-10">
            <h3 className={`text-2xl font-extrabold tracking-wider ${toggle?"text-black":"text-gray-100"}`}>
              Contact Information
            </h3>
            <div className="flex flex-col gap-0.5">
              <p className={`${toggle?"text-gray-600":"text-gray-200"} tracking-wide`}>Email</p>
              <p className={`${toggle?"text-black":"text-gray-400"}`}>tushar15464@gmail.com</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className={`${toggle?"text-gray-600":"text-gray-200"} tracking-wide`}>Phone</p>
              <p className={`${toggle?"text-black":"text-gray-400"}`}>9936474728</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className={`${toggle?"text-gray-600":"text-gray-200"} tracking-wide`}>Social Profiles</p>
              <div className="flex gap-3">
                <div className={`${toggle?"bg-white":"text-white"} p-3 text-xl rounded-full hover:scale-110 duration-200`}>
                  <FiGithub />
                </div>
                <div className={`${toggle?"bg-white":"bg-gray-900 text-white"} p-3 text-xl rounded-full hover:scale-110 duration-200`}>
                  <FaLinkedinIn />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Form/>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
