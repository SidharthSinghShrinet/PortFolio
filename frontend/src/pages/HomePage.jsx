import React from "react";
import { useSelector } from "react-redux";
import AnchorTemporaryDrawer from "../component/Drawer";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { FlipWords } from "@/components/ui/flip-words";
import Example from "@/component/DrawOutlineButton";
import Example1 from "@/component/EncryptButton";

const HomePage = () => {
  let toggle = useSelector((state) => state.global.toggle);
  let open = useSelector((state) => state.global.open);
  return (
    <div className="relative w-full flex justify-center items-center max-md:h-screen">
      {open ? <AnchorTemporaryDrawer /> : null}
      <BackgroundBeamsWithCollision/>
      <div
        className={`absolute w-[75%] bg-transparent flex gap-10 justify-around items-center max-lg:flex-col max-lg:w-full px-5`}
      >
        <div className="flex flex-col lg:items-start gap-3 max-lg:flex max-lg:flex-col max-lg:items-center">
          <p
            className={`text-lg tracking-wider font-[500] ${
              toggle ? "text-purple-800" : "text-purple-500"
            }`}
          >
            BENGALURU, KARNATAKA
          </p>
          <h2
            className={`max-lg:text-5xl lg:text-5xl max-sm:text-4xl tracking-wider font-extrabold ${
              toggle ? "text-black" : "text-gray-300"
            }`}
          >
            SIDHARTH SINGH
          </h2>
          <div className="text-xl tracking-wider font-semibold flex items-center">
            <p className={`${
              toggle ? "text-purple-800" : "text-purple-500"
            }`}>Aspiring</p>
            <FlipWords words={["Frontend Developer","Backend Developer","Full-Stack Enthusiast"]}
            duration={3000}
            className="text-xl tracking-wider font-semibold p-[6px]"
          />
          </div>
          <div className="h-12 flex justify-start items-center gap-6">
            <Example1/>
            <Example/>
          </div>
        </div>
        <div>
          <img
            className={`border-5 rounded-[50%] ${
              toggle ? "border-purple-400" : "border-gray-300"
            }`}
            src="../../src/assets/profile.png"
            alt=""
            width={400}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
