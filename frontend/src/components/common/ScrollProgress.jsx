import React from "react";
import { motion, useScroll } from "motion/react";

/**
 * ScrollProgress Component
 * Renders a subtle, non-intrusive progress bar right beneath the system bar.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      id="scroll-indicator"
      style={{
        scaleX: scrollYProgress,
        position: "fixed",
        top: "calc(var(--sysbar-h) + var(--nav-h) - 2px)",
        left: 0,
        right: 0,
        height: 2.5,
        originX: 0,
        background: "linear-gradient(90deg, #e08a5f, #ff8a4c, #ffd166)",
        zIndex: 70,
      }}
    />
  );
}
