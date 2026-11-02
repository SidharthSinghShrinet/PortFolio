import React from "react";
import { STATS_DATA } from "../../data/portfolioData";

/**
 * StatsBar Component
 * Renders verified key engineering milestones in a high-density matrix.
 */
export default function StatsBar({ stats }) {
  const displayStats = stats && stats.length > 0 ? stats : STATS_DATA;
  return (
    <div className="stats" aria-label="Key Engineering Metrics">
      {displayStats.map((item, idx) => (
        <div key={idx} className="stat">
          <div className="num">
            <span>{item.num}</span>
            <span className="plus">{item.plus}</span>
          </div>
          <div className="label">{item.label}</div>
          <div className="sub">{item.sub}</div>
        </div>
      ))}
    </div>
  );
}
