import React from "react";
import { ArrowUpRight, Download, Mail, MapPin, Briefcase, Zap, ShieldCheck, Code2, CheckCircle2 } from "lucide-react";
import { PERSONAL_INFO } from "../../data/portfolioData";
import TiltCard from "../common/TiltCard";
import InteractiveTerminal from "./InteractiveTerminal";

/**
 * Formats the hero headline and restores the distinctive italic serif accent styling
 * on "production-grade" or any word wrapped in *word*.
 */
function renderHeadline(headline) {
  if (!headline) {
    return (
      <>
        I build scalable enterprise systems &amp;{" "}
        <span className="accent-word">production-grade</span> platforms.
      </>
    );
  }

  // Support *accent word* syntax from custom admin inputs
  if (/\*([^*]+)\*/.test(headline)) {
    const parts = headline.split(/\*([^*]+)\*/);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className="accent-word">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  // Automatically style "production-grade" with previous italic serif accent
  if (/production-grade/i.test(headline)) {
    const parts = headline.split(/(production-grade)/i);
    return parts.map((part, i) =>
      part.toLowerCase() === "production-grade" ? (
        <span key={i} className="accent-word">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  return headline;
}

/**
 * Formats bio text with key technical metrics highlighted in bold.
 */
function renderBio(bio) {
  if (!bio) {
    return (
      <>
        Full Stack Developer (B.Tech CSE) with <b>1.5+ years of experience</b>,{" "}
        <b>60+ React projects</b>, and <b>200+ LeetCode problems</b> solved.
        Hands-on domain experience in automotive dealership ERP systems, HR
        management, and e-commerce with low-latency API optimization (
        <b>~100ms</b> under heavy transaction load).
      </>
    );
  }

  // Support markdown bold **text**
  if (/\*\*([^*]+)\*\*/.test(bio)) {
    const parts = bio.split(/\*\*([^*]+)\*\*/);
    return parts.map((part, i) =>
      i % 2 === 1 ? <b key={i}>{part}</b> : part
    );
  }

  // Highlight default metric keywords if plain text string
  if (/1\.5\+\s*years/i.test(bio) && /60\+\s*React/i.test(bio)) {
    return (
      <>
        Full Stack Developer (B.Tech CSE) with <b>1.5+ years of experience</b>,{" "}
        <b>60+ React projects</b>, and <b>200+ LeetCode problems</b> solved.
        Hands-on domain experience in automotive dealership ERP systems, HR
        management, and e-commerce with low-latency API optimization (
        <b>~100ms</b> under heavy transaction load).
      </>
    );
  }

  return bio;
}

/**
 * Hero Component
 * Displays role headline, bio narrative, 3D tilt portrait card, and interactive CLI terminal sandbox.
 */
export default function Hero({ onActionClick, onOpenAdmin, personalInfo }) {
  const info = personalInfo || PERSONAL_INFO;
  const handleInteractiveClick = () => {
    if (onActionClick) onActionClick();
  };

  return (
    <section className="hero">
      <div className="page">
        <div className="hero-grid">
          {/* Narrative Column */}
          <div>
            <div className="hero-status">
              <span className="live" />
              <span>{info.roleStatus}</span>
            </div>

            <h1>{renderHeadline(info.headline)}</h1>

            <p className="hero-sub">{renderBio(info.bio)}</p>

            <div className="hero-meta">
              <span>
                <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                {info.location}
              </span>
              <span>
                <Briefcase className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                Ex-Qugates Technologies · QSpiders
              </span>
              <span>
                <Code2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                60+ React Projects · 15+ MERN Apps
              </span>
              <span>
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                200+ LeetCode Solved
              </span>
              <span>
                <Zap className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                ~100ms API response time
              </span>
              <span>
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                Centralized RBAC Engine (700+ DAU)
              </span>
            </div>

            <div className="hero-cta">
              <a
                href="#projects"
                onClick={handleInteractiveClick}
                className="btn btn-primary"
              >
                <span>View Featured Projects</span>
                <ArrowUpRight className="arrow w-4 h-4" />
              </a>

              <a
                href={info.resumeUrl || PERSONAL_INFO.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInteractiveClick}
                className="btn btn-ghost"
              >
                <Download className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Download Resume</span>
              </a>

              <a
                href="#contact"
                onClick={handleInteractiveClick}
                className="btn btn-ghost"
              >
                <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Get In Touch</span>
              </a>
            </div>
          </div>

          {/* Media & Interactive Terminal Column */}
          <div className="hero-aside">
            {/* 3D Tilt Photo Card with Specular Glare */}
            <TiltCard maxTilt={4.5} glare={true} className="rounded-[var(--radius-lg)] w-full max-w-full">
              <div className="photo-card" style={{ width: "100%", height: "100%" }}>
                <img
                  src={info.profileImg || PERSONAL_INFO.profileImg}
                  alt={`${info.name || PERSONAL_INFO.name} - ${info.title || PERSONAL_INFO.title}`}
                  loading="eager"
                />
                <div className="photo-corner">{info.photoCorner || PERSONAL_INFO.photoCorner || "KA/BLR"}</div>
                <div className="photo-tag">
                  <span className="ring" />
                  <span>{info.photoTag || PERSONAL_INFO.photoTag}</span>
                </div>
              </div>
            </TiltCard>

            {/* Playable Interactive Terminal CLI */}
            <InteractiveTerminal onActionClick={onActionClick} onOpenAdmin={onOpenAdmin} personalInfo={info} />
          </div>
        </div>
      </div>
    </section>
  );
}
