import React from "react";
import { Coffee, Binary, BrainCircuit, Sparkles } from "lucide-react";
import { NOW_DATA } from "../../data/portfolioData";
import TiltCard from "../common/TiltCard";

const DOMAIN_ICONS = {
  "Core Java & System Architecture": Coffee,
  "Data Structures & Algorithms (DSA)": Binary,
  "In AI Semantic Search & Recommendation Systems": BrainCircuit,
};

/**
 * NowSection Component
 * Displays currently building & exploring focus areas:
 * - Core Java & System Architecture
 * - Data Structures & Algorithms (DSA)
 * - In AI Semantic Search and Recommendation Based System
 * Full-width responsive 3-column layout with 3D Tilt cards and horizontal telemetry strip.
 */
export default function NowSection() {
  return (
    <section className="py-16" aria-label="Current Engineering Focus">
      <div className="page">
        <div className="w-full p-6 sm:p-8 md:p-10 rounded-2xl bg-[var(--paper-2)]/16 backdrop-blur-md border border-[var(--line)]/50 shadow-lg relative overflow-hidden ring-1 ring-white/10">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
          />

          {/* Section Header */}
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/15 border border-orange-600/25 dark:border-orange-500/30 mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>{NOW_DATA.label}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink)] leading-tight">
              {NOW_DATA.title}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
              {NOW_DATA.description}
            </p>
          </div>

          {/* 3 Domain Focus Cards — Full-Width 3-Column Responsive Grid */}
          {NOW_DATA.focusAreas && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 relative z-10">
              {NOW_DATA.focusAreas.map((area, idx) => {
                const IconComponent = DOMAIN_ICONS[area.domain] || Sparkles;
                return (
                  <TiltCard
                    key={idx}
                    maxTilt={3.5}
                    glare={true}
                    className="h-full rounded-xl"
                  >
                    <div className="p-6 rounded-xl bg-[var(--paper)]/18 backdrop-blur-sm border border-[var(--line)]/50 hover:border-orange-500/50 dark:hover:border-orange-400/50 hover:bg-[var(--paper)]/32 transition-all flex flex-col justify-between h-full shadow-md ring-1 ring-white/5">
                      <div>
                        {/* Header Badge & Status */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-[10.5px] font-mono px-2.5 py-1 rounded-md bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-600/25 dark:border-orange-500/30 font-bold tracking-wide">
                            {area.badge}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--muted)] flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block animate-pulse" />
                            {area.status}
                          </span>
                        </div>

                        {/* Title & Icon */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-[var(--paper-2)]/40 border border-[var(--line)]/60 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5 shadow-xs">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-base sm:text-lg text-[var(--ink)] leading-snug">
                            {area.domain}
                          </h4>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed mt-2 mb-4">
                          {area.desc}
                        </p>
                      </div>

                      {/* Skill Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--line)]/40 mt-auto">
                        {area.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-[var(--paper-2)]/30 text-[var(--ink)] border border-[var(--line)]/60 font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          )}

          {/* Bottom Telemetry Strip across full width */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-[var(--line)]/40 relative z-10">
            {NOW_DATA.telemetry.map((row, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[var(--paper)]/16 border border-[var(--line)]/40 flex flex-col justify-between"
              >
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold">
                  {row.k}
                </span>
                <span className={`font-mono text-xs mt-1 font-medium ${row.accent ? "text-orange-600 dark:text-orange-400 font-bold" : "text-[var(--ink)]"}`}>
                  {row.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
