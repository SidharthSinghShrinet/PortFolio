import React from "react";
import { TECH_CATEGORIES } from "../../data/portfolioData";
import TiltCard from "../common/TiltCard";
import SectionHeader from "../common/SectionHeader";

/**
 * TechStack Component
 * Categorized interactive 3D skill cards with tilt inertia, specular glare, and monospace headers.
 */
export default function TechStack({ onActionClick }) {
  const handleChipClick = () => {
    if (onActionClick) onActionClick();
  };

  return (
    <section id="stack" className="py-16">
      <div className="page">
        <SectionHeader
          num="02."
          tag="stack"
          eyebrow="Technical Arsenal"
          title={
            <>
              The tools, frameworks &amp; <span className="accent-word">systems</span> I leverage.
            </>
          }
          lead="A battle-tested stack honed for developer ergonomics, sub-100ms API response time, and enterprise platform stability."
        />

        <div className="tech-grid">
          {TECH_CATEGORIES.map((cat, idx) => (
            <TiltCard
              key={idx}
              maxTilt={3.5}
              glare={true}
              className="rounded-[var(--radius-lg)] h-full"
            >
              <div className="tech-card h-full" style={{ height: "100%" }}>
                <div className="head">
                  <span className="title">{cat.title}</span>
                  <span className="index">{cat.index} //</span>
                </div>

                <div className="chips">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="chip"
                      onClick={handleChipClick}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
