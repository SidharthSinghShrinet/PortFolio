import React, { useState, useEffect } from "react";
import { useTheme } from "./hooks/useTheme";
import { useAudio } from "./hooks/useAudio";
import { usePortfolioDb } from "./hooks/usePortfolioDb";

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
import AdminModal from "./components/admin/AdminModal";

/**
 * Root Portfolio Application Component
 * Coordinates clean component hierarchy, global hotkeys, theme, and audio hooks.
 */
export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { audioEnabled, toggleAudio, playClick, playBlip, playWarp } = useAudio();
  const {
    projects,
    stats,
    nowData,
    personalInfo,
    experiences,
    techCategories,
    educationData,
    rawDbData,
    refresh,
  } = usePortfolioDb();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Global hotkeys for command palette (⌘K, Ctrl+K, /) and secret Admin portal (Ctrl+Shift+U)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret Admin Hotkey: Ctrl + Shift + U (or Ctrl + Alt + U)
      if (e.ctrlKey && (e.shiftKey || e.altKey) && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
        return;
      }

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

  // Listen for direct #admin or #/admin URL routing
  useEffect(() => {
    const checkAdminHash = () => {
      if (
        window.location.hash === "#admin" ||
        window.location.hash === "#/admin"
      ) {
        setAdminOpen(true);
      }
    };

    checkAdminHash();
    window.addEventListener("hashchange", checkAdminHash);
    return () => window.removeEventListener("hashchange", checkAdminHash);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-300">
      {/* Interactive 3D Particle Constellation Background Field */}
      <ThreeDBackground theme={theme} />

      {/* React BootLoader — automatically unmounts upon completion */}
      <BootLoader />

      {/* Top Scroll Indicator (hidden when Admin Panel is open) */}
      {!adminOpen && <ScrollProgress />}

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
        personalInfo={personalInfo}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1" role="main">
        <Hero
          onActionClick={playClick}
          onOpenAdmin={() => setAdminOpen(true)}
          personalInfo={personalInfo}
        />
        <div className="page">
          <StatsBar stats={stats} />
        </div>
        <Experience onActionClick={playClick} experiences={experiences} />
        <TechStack onActionClick={playClick} techCategories={techCategories} />
        <Projects
          onActionClick={playClick}
          openPalette={() => setPaletteOpen(true)}
          projects={projects}
        />
        <NowSection nowData={nowData} />
        <Activity onCellHover={playBlip} educationData={educationData} personalInfo={personalInfo} />
        <Contact onActionClick={playClick} theme={theme} personalInfo={personalInfo} />
      </main>

      {/* Footer */}
      <Footer onActionClick={playClick} personalInfo={personalInfo} />

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
        onOpenAdmin={() => setAdminOpen(true)}
        personalInfo={personalInfo}
        projects={projects}
      />

      {/* Administrative Control Portal (Hidden / Protected by Supabase Auth) */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onRefreshData={refresh}
        rawDbData={rawDbData}
      />
    </div>
  );
}