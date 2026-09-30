import React, { useRef, useEffect } from "react";

/**
 * TiltCard Component
 * Wraps child elements with zero-re-render hardware-accelerated 3D perspective tilt
 * and dynamic cursor glare reflection.
 * Performance optimized: Uses direct DOM transforms scheduled via requestAnimationFrame
 * instead of React state, completely eliminating component re-renders on mousemove.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  ...props
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  const handleMouseMove = (e) => {
    // Only apply 3D tilt on devices that support hover (non-touch)
    if (typeof window !== "undefined" && window.matchMedia && !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -maxTilt;
      const rotY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      card.style.transition = "transform 0.08s ease-out";

      if (glare && glareRef.current) {
        const posX = (x / rect.width) * 100;
        const posY = (y / rect.height) * 100;
        glareRef.current.style.opacity = "0.22";
        glareRef.current.style.background = `radial-gradient(circle 350px at ${posX}% ${posY}%, rgba(255, 255, 255, 0.35), transparent 70%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    const card = cardRef.current;
    if (card) {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      card.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    }
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transformStyle: "preserve-3d",
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Specular Glare Reflection */}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-10 opacity-0"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
