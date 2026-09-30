import React, { useEffect, useRef, useState } from "react";

/**
 * CustomCursor Component
 * Smooth hardware-accelerated pointer ring with hover scaling effect.
 * 
 * Performance Optimized:
 * - Disabled automatically on touchscreens/mobile devices (pointer: coarse)
 * - Single delegated event listener on document instead of iterating hundreds of DOM nodes
 * - Uses hardware-accelerated translate3d transforms
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch / non-mouse devices
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        !window.matchMedia("(hover: hover)").matches);

    if (isTouch) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(updateRing);
    };

    // Single delegated listener for interactive element hover detection
    const onMouseOver = (e) => {
      if (
        e.target &&
        e.target.closest(
          "a, button, input, textarea, .chip, .project-card, .exp-item, .tech-card, .contact-link, [role='button']"
        )
      ) {
        document.body.classList.add("cursor-hover");
      } else {
        document.body.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    animId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animId);
      document.body.classList.remove("cursor-hover");
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
