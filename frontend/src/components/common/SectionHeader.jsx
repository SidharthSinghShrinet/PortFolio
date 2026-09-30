import React from "react";

/**
 * SectionHeader Component
 * Unified, high-contrast architectural section header adhering to React Component principles.
 * Displays crisp index badges [01. // experience], prominent h2 headlines, and lead narrative.
 */
export default function SectionHeader({
  num = "01.",
  tag = "experience",
  eyebrow = "",
  title,
  lead,
  extra,
}) {
  return (
    <div className="section-head-modern mb-10 pb-4 border-b border-[var(--line)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {/* Architectural Index Badge */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/15 border border-orange-600/25 dark:border-orange-500/30 shadow-xs flex-shrink-0">
              {num}
            </span>
            <span className="font-mono text-xs text-[var(--muted)] font-bold opacity-70">//</span>
            <span className="font-mono text-xs font-bold tracking-wider uppercase text-[var(--ink)]">
              {tag}
            </span>
            {eyebrow && (
              <>
                <span className="text-[var(--muted)] opacity-60 font-bold">·</span>
                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wide font-medium">
                  {eyebrow}
                </span>
              </>
            )}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse ml-1 flex-shrink-0" />
          </div>

          {/* Primary Section Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)] leading-[1.1] break-words">
            {title}
          </h2>

          {/* Lead Narrative */}
          {lead && (
            <p className="mt-3 text-sm sm:text-base md:text-lg text-[var(--ink-2)] max-w-3xl leading-relaxed break-words">
              {lead}
            </p>
          )}
        </div>

        {/* Optional Extra Telemetry or CTAs on right side */}
        {extra && (
          <div className="flex-shrink-0 self-start md:self-end mb-1">
            {extra}
          </div>
        )}
      </div>
    </div>
  );
}
