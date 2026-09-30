import React from "react";
import App from "../App";
import { motion, useScroll } from "motion/react";

export default function ScrollLinked() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <motion.div
        id="scroll-indicator"
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: "30px", // directly under sysbar
          left: 0,
          right: 0,
          height: 2.5,
          originX: 0,
          background: "linear-gradient(90deg, #e08a5f, #ff8a4c, #ffd166)",
          zIndex: 80,
        }}
      />
      <App />
    </>
  );
}
