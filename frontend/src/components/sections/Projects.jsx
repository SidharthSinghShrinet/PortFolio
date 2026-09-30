import React, { useState } from "react";
import {
  ArrowUpRight,
  Github,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Zap,
  ArrowRight,
  Command,
} from "lucide-react";
import { PROJECTS, PERSONAL_INFO } from "../../data/portfolioData";
import TiltCard from "../common/TiltCard";
import SectionHeader from "../common/SectionHeader";

const FILTER_TABS = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "AI & Full Stack" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "realtime", label: "Real-Time / Sockets" },
  { id: "enterprise", label: "Enterprise ERP" },
  { id: "frontend", label: "Frontend UI/UX" },
];

/**
 * Projects Component
 * Production projects showcase with category filters, system telemetry specs,
 * and an in-depth Architectural Evolution Matrix comparing Portfolio v2.6 vs v1.0.
 */
export default function Projects({ onActionClick, openPalette }) {
  const [activeTab, setActiveTab] = useState("all");
  const [showComparison, setShowComparison] = useState(true);

  const filteredProjects =
    activeTab === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeTab);

  const handleTabClick = (tabId) => {
    if (onActionClick) onActionClick();
    setActiveTab(tabId);
  };

  const handleInteractiveClick = () => {
    if (onActionClick) onActionClick();
  };

  const scrollToV2Comparison = () => {
    if (onActionClick) onActionClick();
    setShowComparison(true);
    const v2Elem = document.getElementById("portfoliov2");
    if (v2Elem) {
      v2Elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTerminal = () => {
    if (onActionClick) onActionClick();
    const term = document.getElementById("terminal");
    if (term) {
      term.scrollIntoView({ behavior: "smooth" });
      const input = term.querySelector("input");
      if (input) input.focus();
    }
  };

  const handleOpenPalette = () => {
    if (onActionClick) onActionClick();
    if (openPalette) {
      openPalette();
    } else {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    }
  };

  return (
    <section id="projects" className="py-16">
      <div className="page">
        <SectionHeader
          num="03."
          tag="projects"
          eyebrow="Portfolio & Deep-Dives"
          title={
            <>
              Production platforms &amp; <span className="accent-word">deep-dives</span>.
            </>
          }
          lead="Real-world enterprise systems deployed live in production, tested under simulated concurrent load, and optimized for sub-100ms response times."
        />

        {/* Filter Tabs */}
        <div className="projects-tabs">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.category === tab.id).length;

            return (
              <button
                key={tab.id}
                className={`projects-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabClick(tab.id)}
                type="button"
              >
                <span>{tab.label}</span>
                <span className="tnum">({count})</span>
                <span className="underline" />
              </button>
            );
          })}
        </div>

        {/* Project Cards */}
        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <TiltCard
              key={project.id}
              maxTilt={4}
              glare={true}
              className="rounded-[var(--radius-xl)]"
            >
              <div id={project.id} className="project-card" style={{ marginBottom: 0 }}>
                {/* Left Column: Metadata & CTAs */}
                <div className="meta">
                  <div>
                    {/* Status Badges for v2 and v1 */}
                    {project.id === "portfoliov2" && (
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          CURRENT FLAGSHIP · v2.6 PLATFORM
                        </span>
                        <span className="text-[11px] font-mono text-[var(--muted)]">
                          // +8 CORE ADVANCEMENTS OVER v1.0
                        </span>
                      </div>
                    )}

                    {project.id === "portfoliov1" && (
                      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          FOUNDATIONAL BASELINE · v1.0 ARCHIVE
                        </span>
                        <span className="text-[11px] font-mono text-[var(--muted)]">
                          // PRESERVED HISTORICAL SHOWCASE
                        </span>
                      </div>
                    )}

                    <div className="name flex items-baseline gap-2 flex-wrap">
                      <span>{project.title}</span>
                      <span className="text-xs font-mono font-medium text-[var(--muted)]">
                        // {project.subtitle}
                      </span>
                    </div>
                    <p className="desc mt-2">{project.tagline}</p>
                  </div>

                  <ul className="bullets">
                    {project.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>

                  <div className="chips mt-2">
                    {project.chips.map((chip, cIdx) => (
                      <span
                        key={cIdx}
                        className="chip"
                        onClick={handleInteractiveClick}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="ctas">
                    {project.id === "portfoliov2" ? (
                      <>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleInteractiveClick}
                          className="btn btn-primary"
                        >
                          <Zap className="w-3.5 h-3.5 text-emerald-300" />
                          <span>Live Production (Vercel)</span>
                          <ArrowUpRight className="arrow w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={scrollToTerminal}
                          className="btn btn-ghost"
                        >
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Interactive Shell</span>
                        </button>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInteractiveClick}
                            className="btn btn-ghost"
                          >
                            <Github className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Source Code</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 font-semibold">
                              main-V2
                            </span>
                          </a>
                        )}
                      </>
                    ) : project.id === "portfoliov1" ? (
                      <>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInteractiveClick}
                            className="btn btn-primary"
                          >
                            <span>Live v1 Archive</span>
                            <ArrowUpRight className="arrow w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={scrollToV2Comparison}
                          className="btn btn-ghost"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Compare with v2.6 Upgrades</span>
                        </button>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInteractiveClick}
                            className="btn btn-ghost"
                          >
                            <Github className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Source Code</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30 font-semibold">
                              main
                            </span>
                          </a>
                        )}
                      </>
                    ) : project.id === "desiremart" ? (
                      <>
                        <a
                          href={project.githubUrl || project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleInteractiveClick}
                          className="btn btn-primary"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Explore on GitHub (Next.js 16)</span>
                          <ArrowUpRight className="arrow w-3.5 h-3.5" />
                        </a>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInteractiveClick}
                            className="btn btn-ghost"
                          >
                            <Github className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Source Code</span>
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInteractiveClick}
                            className="btn btn-primary"
                          >
                            <span>Live Production</span>
                            <ArrowUpRight className="arrow w-3.5 h-3.5" />
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleInteractiveClick}
                            className="btn btn-ghost"
                          >
                            <Github className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                            <span>Source Code</span>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column: Telemetry Specs & Screenshot */}
                <div className="project-visual flex flex-col justify-between">
                  <div>
                    {project.previewImg && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-[var(--line)] aspect-video relative group">
                        <img
                          src={project.previewImg}
                          alt={`${project.title} Preview`}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                        
                        {/* Overlay Tag */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-black/60 backdrop-blur-md text-white border border-white/15">
                          {project.id === "portfoliov2" ? "v2.6 PRODUCTION" : project.id === "portfoliov1" ? "v1.0 ARCHIVE" : "VERIFIED ASSET"}
                        </div>
                      </div>
                    )}

                    <div className="vbar">
                      <span className="dot on" />
                      <span>SYSTEM_TELEMETRY // {project.id}.spec</span>
                    </div>

                    <div className="kv-grid mt-4">
                      {project.kv.map((row, rIdx) => (
                        <div key={rIdx} className="kv-row">
                          <span className="k">{row.k}:</span>
                          <span className={`v ${row.accent ? "accent font-medium" : ""}`}>
                            {row.v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[var(--line)] pt-3 text-[11px] font-mono text-[var(--muted)] flex justify-between items-center mt-4">
                    <span>STATUS: 200 OK</span>
                    <span>
                      {project.id === "portfoliov2"
                        ? "KERNEL: REACT 19 ESM"
                        : project.id === "portfoliov1"
                        ? "ARCHIVE: VITE 4 SPA"
                        : "ENCRYPT: TLS 1.3 / HS256"}
                    </span>
                  </div>
                </div>

                {/* Full-Width Architectural Comparison Matrix for Portfolio v2 vs v1 */}
                {project.comparisonVsV1 && (
                  <div
                    className="mt-6 pt-6 border-t border-slate-200 dark:border-[var(--line)]"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    {/* Interactive Toggle Header */}
                    <div className="flex items-center justify-between gap-4 flex-wrap pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400">
                          <Sparkles className="w-4 h-4 animate-spin-slow" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-900 dark:text-[var(--ink)] flex items-center gap-2 flex-wrap">
                            <span>Architectural Evolution Matrix</span>
                            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 dark:bg-[var(--paper-2)] dark:border-[var(--line)] dark:text-[var(--ink-2)]">
                              v1.0 (Baseline) ➔ v2.6 (Production Leap)
                            </span>
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-[var(--muted)] mt-0.5">
                            Detailed comparative breakdown of 8 major feature &amp; system upgrades implemented in Portfolio v2.6.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onActionClick) onActionClick();
                          setShowComparison((prev) => !prev);
                        }}
                        className={`text-xs px-3.5 py-1.5 rounded-lg font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                          showComparison
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40 dark:shadow-none"
                            : "bg-white text-slate-800 border-slate-300 hover:border-emerald-600 hover:text-emerald-700 shadow-xs dark:bg-transparent dark:text-[var(--ink-2)] dark:border-[var(--line)] dark:hover:border-emerald-500/40 dark:hover:text-[var(--ink)] dark:shadow-none"
                        }`}
                      >
                        {showComparison ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Collapse Comparison Matrix</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>View Evolution Matrix (+8 Upgrades)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Expandable Comparison Content */}
                    {showComparison && (
                      <div className="space-y-4 pt-2 animate-fadeIn">
                        {/* High-Tech Evolution Banner */}
                        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/[0.08] via-slate-50 to-emerald-500/[0.08] border border-slate-200 shadow-xs dark:from-amber-500/[0.08] dark:via-[var(--paper-2)] dark:to-emerald-500/[0.08] dark:border-[var(--line)] dark:shadow-none flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                              v1.0 BASELINE
                            </span>
                            <span className="text-xs font-mono text-slate-600 dark:text-[var(--muted)] font-medium">
                              Static React Showcase (2024)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                            <span>➔</span>
                            <span>+8 ARCHITECTURAL ENGINE UPGRADES</span>
                            <span>➔</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30">
                              v2.6 PRODUCTION LEAP
                            </span>
                            <span className="text-xs font-mono text-slate-600 dark:text-[var(--muted)] font-medium">
                              Full-Stack Interactive Platform (2026)
                            </span>
                          </div>
                        </div>

                        {/* Quick Highlights Telemetry Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs dark:bg-[var(--paper-2)] dark:border-[var(--line)] dark:shadow-none">
                            <div className="text-[11px] text-slate-600 dark:text-[var(--muted)] font-semibold">TERMINAL KERNEL</div>
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">15+ UNIX Commands</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs dark:bg-[var(--paper-2)] dark:border-[var(--line)] dark:shadow-none">
                            <div className="text-[11px] text-slate-600 dark:text-[var(--muted)] font-semibold">3D VISUAL ENGINE</div>
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">60 FPS Particle Mesh</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs dark:bg-[var(--paper-2)] dark:border-[var(--line)] dark:shadow-none">
                            <div className="text-[11px] text-slate-600 dark:text-[var(--muted)] font-semibold">LIVE TELEMETRY</div>
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">GitHub REST API v3</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs dark:bg-[var(--paper-2)] dark:border-[var(--line)] dark:shadow-none">
                            <div className="text-[11px] text-slate-600 dark:text-[var(--muted)] font-semibold">GLOBAL SEARCH</div>
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">⌘K Command Palette</div>
                          </div>
                        </div>

                        {/* Comparison Matrix Grid: 8 Architectural Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
                          {project.comparisonVsV1.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm dark:bg-[var(--paper-2)] dark:border-[var(--line)] dark:shadow-none hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                            >
                              {/* Header: Title + Category + Badge */}
                              <div className="flex items-start justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100 dark:border-[var(--line)]">
                                <div>
                                  <div className="text-[10px] font-mono text-slate-500 dark:text-[var(--muted)] uppercase tracking-wider font-semibold">
                                    {item.category}
                                  </div>
                                  <div className="text-sm font-bold text-slate-900 dark:text-[var(--ink)] mt-0.5">
                                    {item.feature}
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25 whitespace-nowrap">
                                  {item.badge}
                                </span>
                              </div>

                              {/* Two comparative sides */}
                              <div className="space-y-2 text-xs">
                                {/* v1.0 Baseline */}
                                <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200/80 dark:bg-black/30 dark:border-red-500/15 flex items-start gap-2">
                                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/25 flex-shrink-0 mt-0.5">
                                    v1.0
                                  </span>
                                  <span className="text-slate-700 dark:text-[var(--ink-2)] leading-relaxed">
                                    {item.v1}
                                  </span>
                                </div>

                                {/* v2.6 Upgrade */}
                                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/90 dark:bg-emerald-500/[0.06] dark:border-emerald-500/25 flex items-start gap-2">
                                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/25 dark:text-emerald-300 dark:border-emerald-500/35 flex-shrink-0 mt-0.5">
                                    v2.6
                                  </span>
                                  <span className="text-slate-900 dark:text-[var(--ink)] font-medium leading-relaxed">
                                    {item.v2}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Interactive Action Bar inside Comparison Matrix */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-black/20 dark:border-[var(--line)] dark:shadow-none flex items-center justify-between gap-3 flex-wrap mt-3">
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-[var(--muted)] font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                            <span>Ready to test the live v2.6 features?</span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={scrollToTerminal}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs dark:bg-emerald-500/15 dark:text-emerald-300 dark:border dark:border-emerald-500/30 dark:hover:bg-emerald-500/25 dark:shadow-none transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Terminal className="w-3.5 h-3.5" />
                              <span>Test CLI Shell</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleOpenPalette}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white text-slate-800 border border-slate-300 hover:border-emerald-500 shadow-xs dark:bg-white/[0.08] dark:text-[var(--ink)] dark:border-[var(--line)] dark:hover:border-emerald-400/40 dark:shadow-none transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <Command className="w-3.5 h-3.5" />
                              <span>Launch ⌘K Palette</span>
                            </button>

                            <a
                              href={PERSONAL_INFO.portfolioV1Url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={handleInteractiveClick}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-white text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400 shadow-xs dark:bg-transparent dark:text-[var(--muted)] dark:hover:text-[var(--ink)] dark:border-[var(--line)] dark:hover:border-[var(--line-2)] dark:shadow-none transition-colors flex items-center gap-1.5"
                            >
                              <span>Explore v1 Archive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
