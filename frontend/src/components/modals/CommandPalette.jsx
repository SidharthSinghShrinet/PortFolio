import React, { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Layers,
  FolderGit2,
  Activity as ActivityIcon,
  Mail,
  FileText,
  Github,
  Linkedin,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  ExternalLink,
  Copy,
  Phone,
} from "lucide-react";
import { PERSONAL_INFO } from "../../data/portfolioData";

/**
 * CommandPalette Component
 * Global keyboard-driven modal accessible via ⌘K or /
 */
export default function CommandPalette({
  isOpen,
  onClose,
  theme,
  toggleTheme,
  audioOn,
  toggleAudio,
  onActionClick,
  onOpenSound,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const ACTIONS = [
    // Navigation
    {
      group: "Navigation",
      id: "nav-exp",
      label: "Jump to Work Experience",
      hint: "01 //",
      icon: <Briefcase className="w-3.5 h-3.5" />,
      run: () => {
        document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      group: "Navigation",
      id: "nav-stack",
      label: "Jump to Technical Arsenal",
      hint: "02 //",
      icon: <Layers className="w-3.5 h-3.5" />,
      run: () => {
        document.querySelector("#stack")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      group: "Navigation",
      id: "nav-proj",
      label: "Jump to Featured Projects",
      hint: "03 //",
      icon: <FolderGit2 className="w-3.5 h-3.5" />,
      run: () => {
        document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      group: "Navigation",
      id: "nav-act",
      label: "Jump to Engineering Activity",
      hint: "04 //",
      icon: <ActivityIcon className="w-3.5 h-3.5" />,
      run: () => {
        document.querySelector("#activity")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      group: "Navigation",
      id: "nav-contact",
      label: "Jump to Contact",
      hint: "05 //",
      icon: <Mail className="w-3.5 h-3.5" />,
      run: () => {
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
      },
    },

    // Projects
    {
      group: "Live Deployments",
      id: "proj-showoff",
      label: "ShowOff — AI Blogging & Devlog Platform",
      hint: "showoff4u.in",
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.showoffUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-showoff-repo",
      label: "ShowOff — GitHub Repository (Sequelize-BlogApp)",
      hint: "github.com",
      icon: <Github className="w-3.5 h-3.5 text-orange-400" />,
      run: () => window.open(PERSONAL_INFO.showoffGithubUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-desiremart",
      label: "DesireMart — E-Commerce Platform (Next.js 16)",
      hint: "NextJS-E-Commerce",
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.desireMartUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-chat",
      label: "Real-Time Chat Application",
      hint: "chat-app-live",
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.chatAppUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-chat-repo",
      label: "Real-Time Chat App — GitHub Repository (ChatApp-MERN)",
      hint: "github.com",
      icon: <Github className="w-3.5 h-3.5 text-orange-400" />,
      run: () => window.open(PERSONAL_INFO.chatAppGithubUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-portfoliov2",
      label: "Portfolio v2.6 — Interactive Platform (Active / Localhost)",
      hint: "main-V2",
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      run: () => {
        document.querySelector("#portfoliov2")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      group: "Live Deployments",
      id: "proj-portfoliov2-repo",
      label: "Portfolio v2.6 — GitHub Repository (branch: main-V2)",
      hint: "github.com",
      icon: <Github className="w-3.5 h-3.5 text-orange-400" />,
      run: () => window.open(PERSONAL_INFO.portfolioV2GithubUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-portfoliov1",
      label: "Portfolio v1.0 — Previous Portfolio Archive",
      hint: "port-folio-v1",
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.portfolioV1Url, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-portfoliov1-repo",
      label: "Portfolio v1.0 — GitHub Repository (branch: main)",
      hint: "github.com",
      icon: <Github className="w-3.5 h-3.5 text-orange-400" />,
      run: () => window.open(PERSONAL_INFO.portfolioV1GithubUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-zomato",
      label: "Zomato Clone — Food Discovery UI/UX",
      hint: "zomato-clone-live",
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.zomatoCloneUrl, "_blank"),
    },
    {
      group: "Live Deployments",
      id: "proj-zomato-repo",
      label: "Zomato Clone — GitHub Repository (Zomato-Clone)",
      hint: "github.com",
      icon: <Github className="w-3.5 h-3.5 text-orange-400" />,
      run: () => window.open(PERSONAL_INFO.zomatoCloneGithubUrl, "_blank"),
    },

    // Quick Actions
    {
      group: "Actions",
      id: "act-resume",
      label: "Download Full Resume (PDF)",
      hint: "Resume.pdf",
      icon: <FileText className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.resumeUrl, "_blank"),
    },
    {
      group: "Actions",
      id: "act-copy-email",
      label: `Copy Email (${PERSONAL_INFO.email})`,
      hint: "Clipboard",
      icon: <Copy className="w-3.5 h-3.5" />,
      run: () => {
        navigator.clipboard.writeText(PERSONAL_INFO.email);
      },
    },
    {
      group: "Actions",
      id: "act-copy-phone",
      label: `Copy Phone (${PERSONAL_INFO.phone})`,
      hint: "Clipboard",
      icon: <Phone className="w-3.5 h-3.5" />,
      run: () => {
        navigator.clipboard.writeText(PERSONAL_INFO.phone);
      },
    },
    {
      group: "Actions",
      id: "act-github",
      label: "Open GitHub Profile",
      hint: "@SidharthSinghShrinet",
      icon: <Github className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.github, "_blank"),
    },
    {
      group: "Actions",
      id: "act-linkedin",
      label: "Open LinkedIn Profile",
      hint: "/in/sidharth-singh-shrinet",
      icon: <Linkedin className="w-3.5 h-3.5" />,
      run: () => window.open(PERSONAL_INFO.linkedin, "_blank"),
    },

    // System Settings
    {
      group: "System Settings",
      id: "set-theme",
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      hint: "Theme",
      icon: theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />,
      run: () => toggleTheme(),
    },
    {
      group: "System Settings",
      id: "set-audio",
      label: `Toggle Audio SFX (${audioOn ? "Disable" : "Enable"})`,
      hint: "Sound",
      icon: audioOn ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />,
      run: () => toggleAudio(),
    },
  ];

  const filtered = ACTIONS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase()) ||
      item.hint.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      if (onOpenSound) onOpenSound();
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, onOpenSound]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      if (onActionClick) onActionClick();
      filtered[selectedIndex].run();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`cp-overlay ${isOpen ? "open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cp-modal">
        <div className="cp-input-row">
          <span className="prompt">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, project name, or section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="kbd">ESC to close</span>
        </div>

        <div className="cp-list">
          {filtered.length === 0 ? (
            <div className="cp-empty">No matching actions found</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                className={`cp-item ${idx === selectedIndex ? "active" : ""}`}
                onClick={() => {
                  if (onActionClick) onActionClick();
                  item.run();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
                <span className="hint">{item.hint}</span>
              </div>
            ))
          )}
        </div>

        <div className="cp-footer">
          <div className="kbd-group">
            <span className="kbd">↑↓</span>
            <span>Navigate</span>
            <span className="kbd ml-2">↵</span>
            <span>Execute</span>
          </div>
          <span>portfolio.palette v2.6</span>
        </div>
      </div>
    </div>
  );
}
