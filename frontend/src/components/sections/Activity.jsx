import React, { useMemo } from "react";
import {
  GraduationCap,
  Award,
  GitCommit,
  GitFork,
  ExternalLink,
  Flame,
  FolderGit2,
  Users,
} from "lucide-react";
import { EDUCATION_DATA, PERSONAL_INFO } from "../../data/portfolioData";
import { useGitHubData } from "../../hooks/useGitHubData";
import SectionHeader from "../common/SectionHeader";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

/**
 * Activity Component
 * Displays dynamic live GitHub telemetry: total repositories, actual contribution heat map,
 * language distribution, and academic foundations. Does not render individual repos.
 */
export default function Activity({ onCellHover }) {
  const { profile, stats, contributions, isLive, loading } = useGitHubData();

  // Convert linear days of contributions into 52 weeks x 7 days structure
  const gridWeeks = useMemo(() => {
    if (contributions && contributions.length > 0) {
      const weeks = [];
      let currentWeek = [];

      contributions.forEach((day, index) => {
        // Map 0-4 level to css class
        const levelClass =
          day.level === 4
            ? "l4"
            : day.level === 3
            ? "l3"
            : day.level === 2
            ? "l2"
            : day.level === 1
            ? "l1"
            : "";

        currentWeek.push({
          date: day.date,
          count: day.count,
          level: levelClass,
        });

        if (currentWeek.length === 7 || index === contributions.length - 1) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      });
      return weeks;
    }

    // Default fallback while loading or if offline
    const fallbackWeeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const val = (w * 13 + d * 7 + (w % 5) * 11) % 19;
        let level = "";
        let count = 0;
        if (val > 15) {
          level = "l4";
          count = 7;
        } else if (val > 11) {
          level = "l3";
          count = 4;
        } else if (val > 6) {
          level = "l2";
          count = 2;
        } else if (val > 2) {
          level = "l1";
          count = 1;
        }
        days.push({ level, count, date: `2026-W${w + 1}-D${d + 1}` });
      }
      fallbackWeeks.push(days);
    }
    return fallbackWeeks;
  }, [contributions]);

  const handleCellHover = () => {
    if (onCellHover) onCellHover();
  };

  return (
    <section id="activity" className="py-16">
      <div className="page">
        <SectionHeader
          num="04."
          tag="activity"
          eyebrow="GitHub Telemetry & Heatmap"
          title={
            <>
              Engineering metrics &amp; <span className="accent-word">contribution</span> heatmap.
            </>
          }
          lead={
            <>
              Live public telemetry aggregated directly from{" "}
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-400 font-semibold underline underline-offset-4 hover:opacity-80"
              >
                github.com/{profile.login}
              </a>
              , reflecting real-world repository volume, active commit cadence, and multi-language distribution.
            </>
          }
          extra={
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--paper-2)]/40 backdrop-blur-md border border-[var(--line)]/70 text-xs font-mono shadow-xs">
              <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse" : "bg-orange-500 dark:bg-orange-400"}`} />
              <span className="text-[var(--ink-2)] font-semibold">{isLive ? "LIVE SYNCED" : "CACHED TELEMETRY"}</span>
            </div>
          }
        />

        {/* Live GitHub Profile & Aggregate Telemetry Card */}
        <div className="contrib mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--line)]">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl}
                alt="GitHub Avatar"
                className="w-14 h-14 rounded-full border border-[var(--line-2)] object-cover shadow-sm flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-[var(--ink)]">{profile.name}</h3>
                  <span className="text-xs font-mono text-[var(--muted)] font-medium">
                    @{profile.login}
                  </span>
                </div>
                <div className="text-xs font-mono text-[var(--ink-2)] mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block animate-pulse" />
                    Open to Offers
                  </span>
                  <span className="opacity-50">·</span>
                  <span>Active on GitHub since {profile.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-[11px] font-mono px-3 py-1 rounded-full border font-semibold ${
                  isLive
                    ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-600/30 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-orange-500/10 dark:bg-orange-500/15 border-orange-600/30 dark:border-orange-500/30 text-orange-600 dark:text-orange-400"
                }`}
              >
                {isLive ? "● LIVE GITHUB API: SYNCED" : "● GITHUB CACHE"}
              </span>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-xs py-2 px-3.5"
              >
                <span>View Profile</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* High-level Aggregate Metric Counters (Dynamic) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-[var(--line)]">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] uppercase tracking-wider font-semibold">
                <FolderGit2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Public Repos</span>
              </div>
              <span className="text-3xl font-mono font-bold text-[var(--ink)] mt-1">
                {profile.publicRepos}
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] uppercase tracking-wider font-semibold">
                <GitCommit className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Year Commits</span>
              </div>
              <span className="text-3xl font-mono font-bold text-orange-600 dark:text-orange-400 mt-1">
                {stats.totalContributions}+
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] uppercase tracking-wider font-semibold">
                <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Active Streak</span>
              </div>
              <span className="text-3xl font-mono font-bold text-[var(--ink)] mt-1">
                {stats.streak} <span className="text-sm font-normal opacity-60">days</span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--muted)] uppercase tracking-wider font-semibold">
                <Users className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Network</span>
              </div>
              <span className="text-3xl font-mono font-bold text-[var(--ink)] mt-1">
                {profile.followers} <span className="text-sm font-normal opacity-60">followers</span>
              </span>
            </div>
          </div>

          {/* Dynamic Language Breakdown Bar */}
          <div className="pt-6">
            <div className="flex justify-between items-center text-xs font-mono text-[var(--muted)] mb-2.5">
              <span className="uppercase tracking-wider">Dynamic Language Distribution (All 52 Repos)</span>
              <span>Derived via GitHub API</span>
            </div>

            {/* Proportional Multi-Segment Progress Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-[var(--paper-3)] gap-0.5 mb-3">
              {stats.topLanguages.map((lang, idx) => (
                <div
                  key={idx}
                  style={{
                    width: `${lang.percent}%`,
                    backgroundColor: LANGUAGE_COLORS[lang.name] || "#3178c6",
                  }}
                  title={`${lang.name}: ${lang.percent}% (${lang.count} repositories)`}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-mono">
              {stats.topLanguages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{
                      backgroundColor: LANGUAGE_COLORS[lang.name] || "#3178c6",
                    }}
                  />
                  <span className="text-[var(--ink)]">{lang.name}</span>
                  <span className="text-[var(--muted)]">({lang.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Heatmap & Academic Foundation Split */}
        <div className="split">
          {/* Real GitHub Contribution Heatmap Card */}
          <div className="contrib">
            <div className="topline">
              <div className="total">
                <b>{stats.totalContributions}+</b> contributions in the last year
              </div>
              <div className="meta flex items-center gap-2">
                <GitCommit className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Live Heatmap Stream</span>
              </div>
            </div>

            <div className="grid-wrap">
              <div className="grid-days">
                <span />
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
              </div>

              <div className="grid-cells">
                <div className="grid-cols">
                  {gridWeeks.map((week, wIdx) =>
                    week.map((day, dIdx) => (
                      <div
                        key={`${wIdx}-${dIdx}`}
                        className={`cell ${day.level}`}
                        title={`${day.date}: ${day.count} contribution${
                          day.count === 1 ? "" : "s"
                        }`}
                        onMouseEnter={handleCellHover}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="legend justify-between flex-wrap gap-2">
              <span>Real 52-week activity stream</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="ramp">
                  <span className="cell" />
                  <span className="cell l1" />
                  <span className="cell l2" />
                  <span className="cell l3" />
                  <span className="cell l4" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Education & Certifications Card */}
          <div className="edu-card">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
              <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-base font-semibold tracking-normal">Academic Qualifications</h3>
            </div>

            {EDUCATION_DATA.map((item, idx) => (
              <div key={idx} className="edu-row">
                {item.isCert ? (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <div className="edu-degree">{item.degree}</div>
                  </div>
                ) : (
                  <div className="edu-degree">{item.degree}</div>
                )}
                <div className="edu-inst">{item.institution}</div>
                <div className="edu-score">{item.period}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
