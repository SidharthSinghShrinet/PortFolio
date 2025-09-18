import React from "react";
import { useSelector } from "react-redux";
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import Form from "@/component/Form";

const Contact = () => {
  const toggle = useSelector((state) => state.global.toggle);
  return (
    <div className="w-full h-[95vh] flex justify-center bg-gray-300">
      <div className="w-[90%] lg:w-[75%] h-full border-2 border-red-500">
        <div className="flex flex-col gap-2 max-lg:mx-0 lg:my-16 my-8 mx-6">
          <p
            className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider ${
              toggle ? "text-black" : "text-white"
            }`}
          >
            Get In Touch
          </p>
          <div className="w-42 rounded-full h-1 bg-purple-600"></div>
        </div>
        <div className="w-full lg:flex max-lg:flex-col">
          <div className="lg:w-1/2 flex flex-col gap-5 pb-10">
            <h3 className="text-2xl font-extrabold tracking-wider">
              Contact Information
            </h3>
            <div className="flex flex-col gap-0.5">
              <p className="text-gray-600 tracking-wide">Email</p>
              <p>tushar15464@gmail.com</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-gray-600 tracking-wide">Phone</p>
              <p>9936474728</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-gray-600 tracking-wide">Social Profiles</p>
              <div className="flex gap-3">
                <div className="bg-white p-3 text-xl rounded-full">
                  <FiGithub />
                </div>
                <div className="bg-white p-3 text-xl rounded-full">
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
    </div>
  );
};

export default Contact;
