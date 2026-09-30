import React, { useState, useEffect } from "react";

/**
 * BootLoader Component
 * Emulates the Unix kernel startup sequence before transitioning to the portfolio.
 * Adheres to React lifecycle and clean state management.
 */
export default function BootLoader({ onComplete }) {
  const [isDismissing, setIsDismissing] = useState(false);
  const [isGone, setIsGone] = useState(false);

  const dismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsGone(true);
      if (onComplete) onComplete();
    }, 450);
  };

  useEffect(() => {
    // Auto-dismiss after 2.3 seconds
    const timer = setTimeout(() => {
      dismiss();
    }, 2300);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isGone) return null;

  return (
    <div
      id="boot-loader"
      className={isDismissing ? "done" : ""}
      aria-hidden="true"
    >
      <div className="bl-inner">
        <div className="bl-line bl-1">
          <span className="dim">[</span><span className="ok">OK</span><span className="dim">]</span> Booting sidharth.kernel v2.6...
        </div>
        <div className="bl-line bl-2">
          <span className="dim">[</span><span className="ok">OK</span><span className="dim">]</span> Loading user:
          <span className="accent">sidharth@bengaluru</span>
        </div>
        <div className="bl-line bl-3">
          <span className="dim">[</span><span className="ok">OK</span><span className="dim">]</span> Mounting /node_modules ...........
          <span className="ok">done</span>
        </div>
        <div className="bl-line bl-4">
          <span className="dim">[</span><span className="ok">OK</span><span className="dim">]</span> Initializing React 19 + Vite engine ...
          <span className="ok">ready</span>
        </div>
        <div className="bl-line bl-5">
          <span className="dim">[</span><span className="ok">OK</span><span className="dim">]</span> Connecting Qugates ERP microservices ...
          <span className="accent">100ms</span>
        </div>
        <div className="bl-line bl-6">
          <span className="dim">[</span><span className="ok">OK</span><span className="dim">]</span> Database clusters:
          <span className="accent">MongoDB · MySQL · Qdrant</span>
        </div>
        <div className="bl-line bl-7">
          <span className="dim">[</span><span className="warn">!!</span><span className="dim">]</span> Recruiter detection:
          <span className="accent">enabled</span>
        </div>
        <div className="bl-line bl-8">
          <span className="accent">$</span> launch portfolio.app<span className="bl-cursor" />
        </div>

        <div className="bl-bar" />

        <div className="bl-skip">
          <button onClick={dismiss} type="button">
            Press ESC or click to skip
          </button>
        </div>
      </div>
    </div>
  );
}
