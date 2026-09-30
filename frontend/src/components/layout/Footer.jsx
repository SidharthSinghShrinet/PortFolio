import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { PERSONAL_INFO } from "../../data/portfolioData";

/**
 * Footer Component
 * Shows live uptime tracker, service health indicator, and back-to-top shortcut.
 */
export default function Footer({ onActionClick }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const scrollToTop = () => {
    if (onActionClick) onActionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="page w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="pulse">SYS STATUS: HEALTHY</span>
          <span className="opacity-40">/</span>
          <span>UPTIME: {formatUptime(secondsElapsed)}</span>
          <span className="opacity-40">/</span>
          <span>BLR · IST (UTC+5:30)</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <a
            href={PERSONAL_INFO.portfolioV1Url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition-colors font-mono text-[11px]"
            title="View original Portfolio v1 archive"
          >
            v1.0 Archive ↗
          </a>
          <span className="opacity-40">/</span>
          <span className="opacity-80">
            © 2026 {PERSONAL_INFO.name} · {PERSONAL_INFO.title}
          </span>
          <button
            onClick={scrollToTop}
            className="icon-btn"
            title="Back to Top"
            type="button"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
