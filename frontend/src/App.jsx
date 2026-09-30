import React, { useState, useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import { useAudio } from "./hooks/useAudio";

// Layout components
import Sysbar from "./components/layout/Sysbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CustomCursor from "./components/layout/CustomCursor";

// Section components
import Hero from "./components/sections/Hero";
import StatsBar from "./components/sections/StatsBar";
import Experience from "./components/sections/Experience";
import TechStack from "./components/sections/TechStack";
import Projects from "./components/sections/Projects";
import NowSection from "./components/sections/NowSection";
import Activity from "./components/sections/Activity";
import Contact from "./components/sections/Contact";

// Modal & Common components
import CommandPalette from "./components/modals/CommandPalette";
import BootLoader from "./components/common/BootLoader";
import ScrollProgress from "./components/common/ScrollProgress";
import ThreeDBackground from "./components/common/ThreeDBackground";

/**
 * Root Portfolio Application Component
 * Coordinates clean component hierarchy, global hotkeys, theme, and audio hooks.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { audioEnabled, toggleAudio, playClick, playBlip, playWarp } = useAudio();
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Global hotkeys for command palette (⌘K, Ctrl+K, /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-300">
      {/* Interactive 3D Particle Constellation Background Field */}
      <ThreeDBackground theme={theme} />

      {/* React BootLoader — automatically unmounts upon completion */}
      <BootLoader />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Top Telemetry Sysbar */}
      <Sysbar
        theme={theme}
        toggleTheme={toggleTheme}
        audioOn={audioEnabled}
        toggleAudio={toggleAudio}
        openPalette={() => setPaletteOpen(true)}
        onActionClick={playClick}
      />

      {/* Sticky Navigation Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        audioOn={audioEnabled}
        toggleAudio={toggleAudio}
        openPalette={() => setPaletteOpen(true)}
        onActionClick={playClick}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1" role="main">
        <Hero onActionClick={playClick} />
        <div className="page">
          <StatsBar />
        </div>
        <Experience onActionClick={playClick} />
        <TechStack onActionClick={playClick} />
        <Projects
          onActionClick={playClick}
          openPalette={() => setPaletteOpen(true)}
        />
        <NowSection />
        <Activity onCellHover={playBlip} />
        <Contact onActionClick={playClick} theme={theme} />
      </main>

      {/* Footer */}
      <Footer onActionClick={playClick} />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        audioOn={audioEnabled}
        toggleAudio={toggleAudio}
        onActionClick={playClick}
        onOpenSound={playWarp}
      />
    </div>
  );
}