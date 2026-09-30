import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Moon, Sun, Command } from "lucide-react";

/**
 * Sysbar Component
 * Displays system telemetry, time in Bengaluru (IST), and quick control toggles.
 */
export default function Sysbar({
  theme,
  toggleTheme,
  audioOn,
  toggleAudio,
  openPalette,
  onActionClick,
}) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTimeStr(istTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (callback) => {
    if (onActionClick) onActionClick();
    callback();
  };

  return (
    <aside className="sysbar" aria-label="System Telemetry Bar">
      <div className="sysbar-inner">
        <div className="sysbar-item">
          <span className="dot" />
          <span className="v font-semibold">SYS ONLINE</span>
        </div>

        <span className="sysbar-sep" />

        <div className="sysbar-item">
          <span className="k">HOST:</span>
          <span className="v">BLR · IST [{timeStr || "17:00:00"}]</span>
        </div>

        <span className="sysbar-sep" />

        <div className="sysbar-item">
          <span className="k">BRANCH:</span>
          <span className="v accent">git:(main)</span>
        </div>

        <span className="sysbar-sep hidden 2xl:inline-block" />

        <div className="sysbar-item hidden 2xl:inline-flex">
          <span className="k">COMMIT:</span>
          <span className="v">4f0d237</span>
        </div>

        <span className="sysbar-sep hidden 2xl:inline-block" />

        <div className="sysbar-item hidden 2xl:inline-flex">
          <span className="k">STACK:</span>
          <span className="v">bun@1.3.4 · react@19 · vite</span>
        </div>

        <span className="sysbar-sep" />

        <div className="sysbar-item">
          <span className="k">LATENCY:</span>
          <span className="v accent">~100ms avg</span>
        </div>

        <div className="sysbar-spacer" />

        <div className="sysbar-actions">
          {/* Audio Toggle */}
          <button
            onClick={() => handleClick(toggleAudio)}
            className="sysbar-item hover:opacity-100 opacity-80 cursor-pointer transition-opacity border-none bg-transparent flex-shrink-0"
            title="Toggle UI Audio Sounds"
            type="button"
          >
            {audioOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                <span className="v text-orange-400">AUDIO: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="k">AUDIO: OFF</span>
              </>
            )}
          </button>

          <span className="sysbar-sep" />

          {/* Theme Toggle */}
          <button
            onClick={() => handleClick(toggleTheme)}
            className="sysbar-item hover:opacity-100 opacity-80 cursor-pointer transition-opacity border-none bg-transparent flex-shrink-0"
            title="Toggle Light / Dark Mode"
            type="button"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="v">THEME: DARK</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="v">THEME: LIGHT</span>
              </>
            )}
          </button>

          <span className="sysbar-sep" />

          {/* Command Palette Trigger */}
          <button
            onClick={() => handleClick(openPalette)}
            className="sysbar-item hover:opacity-100 opacity-80 cursor-pointer transition-opacity border-none bg-transparent flex-shrink-0"
            title="Open Command Palette (Ctrl+K or ⌘K)"
            type="button"
          >
            <Command className="w-3.5 h-3.5 text-orange-400" />
            <span className="v accent whitespace-nowrap">⌘K PALETTE</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
