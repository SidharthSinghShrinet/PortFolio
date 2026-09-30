import React from "react";
import { EXPERIENCES } from "../../data/portfolioData";
import SectionHeader from "../common/SectionHeader";

/**
 * Experience Component
 * Lists professional roles, responsibilities, and architectural milestones.
 */
export default function Experience({ onActionClick }) {
  const handleChipClick = () => {
    if (onActionClick) onActionClick();
  };

  return (
    <section id="experience" className="py-16">
      <div className="page">
        <SectionHeader
          num="01."
          tag="experience"
          eyebrow="Work History"
          title={
            <>
              Where I've built, scaled &amp; <span className="accent-word">delivered</span>.
            </>
          }
          lead="From architecting multi-module automotive ERP ecosystems to optimizing MongoDB aggregation pipelines and high-concurrency microservices with ~100ms API latency."
        />

        <div className="exp-list">
          {EXPERIENCES.map((exp, idx) => (
            <div key={idx} className="exp-item">
              <div className="exp-head">
                <div>
                  <div className="exp-role">{exp.role}</div>
                  <div className="exp-company">
                    {exp.company} <span className="exp-loc">· {exp.location}</span>
                  </div>
                </div>

                <div className={`exp-meta ${exp.isLatest ? "exp-current" : ""}`}>
                  {exp.isLatest && <span className="dot" />}
                  <span>{exp.period}</span>
                </div>
              </div>

              <p className="exp-summary">{exp.summary}</p>

              <ul className="exp-bullets">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>

              <div className="chips mt-6">
                {exp.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="chip"
                    onClick={handleChipClick}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
