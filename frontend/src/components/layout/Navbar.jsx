import React, { useState, useEffect } from "react";
import { Sun, Moon, Volume2, VolumeX, Command, ArrowUpRight, FileText } from "lucide-react";
import { PERSONAL_INFO } from "../../data/portfolioData";

const NAV_ITEMS = [
  { id: "experience", num: "01.", label: "experience" },
  { id: "stack", num: "02.", label: "stack" },
  { id: "projects", num: "03.", label: "projects" },
  { id: "activity", num: "04.", label: "activity" },
  { id: "contact", num: "05.", label: "contact" },
];

/**
 * Navbar Component
 * Fresh high-tech floating glassmorphic navbar with active scroll-spy indicators,
 * micro-typography, theme & audio controls, and mobile navigation drawer.
 */
export default function Navbar({
  theme,
  toggleTheme,
  audioOn,
  toggleAudio,
  openPalette,
  onActionClick,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("experience");

  // Track scroll position for navbar background and scroll spy (RAF throttled to eliminate layout thrashing)
  useEffect(() => {
    let ticking = false;

    const updateScrollSpy = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

      // Scroll Spy detection calibrated for fixed navbar offset
      const headerOffset = 110;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset + 80) {
            setActiveSection((prev) => (prev !== item.id ? item.id : prev));
            break;
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollSpy);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollSpy(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    if (onActionClick) onActionClick();
    setMobileOpen(false);
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClick = (callback) => {
    if (onActionClick) onActionClick();
    callback();
  };

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo / Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleClick(() => window.scrollTo({ top: 0, behavior: "smooth" }));
            }}
            className="nav-logo group"
            aria-label="Scroll to top"
          >
            <span className="dot group-hover:scale-125 transition-transform" />
            <span className="truncate font-mono font-semibold tracking-tight">
              sidharth.singh()
            </span>
          </a>

          {/* Fresh High-Tech Desktop Nav Capsule */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[var(--paper-2)]/60 backdrop-blur-xl border border-[var(--line)] shadow-sm ring-1 ring-white/10 dark:ring-white/5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleLinkClick(e, `#${item.id}`)}
                  className={`group relative flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 text-xs ${
                    isActive
                      ? "bg-[var(--paper)]/90 backdrop-blur-md text-[var(--ink)] shadow-xs border border-[var(--line-2)] font-semibold"
                      : "text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--paper)]/50"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] transition-colors ${
                      isActive ? "text-orange-600 dark:text-orange-400 font-bold" : "text-orange-600/80 dark:text-orange-400/80 group-hover:text-orange-600 dark:group-hover:text-orange-400 font-semibold"
                    }`}
                  >
                    {item.num}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--muted)] opacity-50 mx-0.5 group-hover:opacity-80 font-bold">
                    //
                  </span>
                  <span className="font-mono text-[11.5px] tracking-tight">
                    {item.label}
                  </span>

                  {/* Active Neon Status Ping */}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse ml-1" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="nav-actions">
            <button
              onClick={() => handleClick(openPalette)}
              className="icon-btn nav-cp-btn hover:scale-105 transition-transform"
              title="Command Palette (⌘K or /)"
              type="button"
            >
              <Command className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleClick(toggleAudio)}
              className="icon-btn hover:scale-105 transition-transform"
              title={audioOn ? "Mute SFX" : "Unmute SFX"}
              type="button"
            >
              {audioOn ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleClick(toggleTheme)}
              className="icon-btn hover:scale-105 transition-transform"
              title="Toggle Theme"
              type="button"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-blue-500" />}
            </button>

            <a
              href={PERSONAL_INFO.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onActionClick && onActionClick()}
              className="btn btn-primary nav-resume-btn ml-1 hover:scale-105 transition-transform"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
              <ArrowUpRight className="arrow w-3 h-3" />
            </a>

            {/* Mobile Drawer Trigger */}
            <button
              className={`mobile-toggle lg:hidden ${mobileOpen ? "open" : ""}`}
              onClick={() => {
                if (onActionClick) onActionClick();
                setMobileOpen(!mobileOpen);
              }}
              aria-label="Toggle Navigation Menu"
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Fresh Mobile Drawer */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <div className="mm-prompt flex items-center justify-between">
          <span>portfolio.shell / navigate</span>
          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-mono font-semibold">v2.6.2</span>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              className={`mm-item flex items-center justify-between p-3.5 rounded-xl transition-all ${
                isActive
                  ? "bg-[var(--paper-2)] border border-orange-600/30 dark:border-orange-400/30 text-orange-600 dark:text-orange-400 font-bold"
                  : "text-[var(--ink-2)] hover:bg-[var(--paper-2)]"
              }`}
              onClick={(e) => handleLinkClick(e, `#${item.id}`)}
              type="button"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-orange-600 dark:text-orange-400 font-bold">{item.num}</span>
                <span className="font-mono text-xs text-[var(--muted)] font-bold">//</span>
                <span className="font-mono text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />}
            </button>
          );
        })}

        {/* Drawer Action Tools */}
        <div className="mm-foot mt-6">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => handleClick(toggleTheme)}
              className="btn btn-ghost justify-center text-xs py-2.5 px-3"
              type="button"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleClick(toggleAudio)}
              className="btn btn-ghost justify-center text-xs py-2.5 px-3"
              type="button"
            >
              {audioOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                  <span>Audio: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 mr-1.5" />
                  <span>Audio: OFF</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={PERSONAL_INFO.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary justify-center w-full"
            >
              <span>Download Resume (PDF)</span>
              <ArrowUpRight className="arrow w-4 h-4" />
            </a>
            <button
              onClick={() => {
                setMobileOpen(false);
                openPalette();
              }}
              className="btn btn-ghost justify-center w-full"
              type="button"
            >
              <Command className="w-4 h-4 mr-2" />
              <span>Command Palette (⌘K)</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
