import React, { useState } from "react";
import { Mail, Phone, Copy, Check, ArrowUpRight, Github, Linkedin, ExternalLink, Quote, Sparkles } from "lucide-react";
import { PERSONAL_INFO } from "../../data/portfolioData";
import Globe3D from "../common/Globe3D";
import TiltCard from "../common/TiltCard";
import SectionHeader from "../common/SectionHeader";
import ContactForm from "../common/ContactForm";

/**
 * Contact Component
 * Direct communication portal with live Web3Forms message submission,
 * copyable contact channels, 3D Tilt perspective, and interactive 3D Geo-Sphere marking Bengaluru, India.
 */
export default function Contact({ onActionClick, theme = "dark" }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    if (onActionClick) onActionClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyPhone = () => {
    if (onActionClick) onActionClick();
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  const handleClick = () => {
    if (onActionClick) onActionClick();
  };

  return (
    <section id="contact" className="py-16">
      <div className="page">
        <SectionHeader
          num="05."
          tag="contact"
          eyebrow="Direct Portal & Dispatch"
          title={
            <>
              Initialize connection &amp; <span className="accent-word">collaboration</span>.
            </>
          }
          lead="Whether you're looking for a Full Stack Engineer to architect resilient microservices, scale enterprise dealership workflows, or build modern web platforms — I'm open for full-time opportunities."
        />

        <TiltCard maxTilt={2.5} glare={true} className="rounded-[var(--radius-xl)]">
          <div className="contact" style={{ marginBottom: 0 }}>
            {/* Left Column: Narrative, Quick CTAs, Live Web3Forms Form & 3D Globe */}
            <div>
              <div className="eyebrow mb-2">Direct Communication</div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ink)] mb-3">
                Let's build something <span className="accent-word">exceptional</span> together.
              </h3>
              <p className="sub">
                Drop an email directly, send a message through the dispatch form below, or connect on LinkedIn. Fast responses within 24 hours.
              </p>

              <div className="ctas">
                <button
                  onClick={handleCopyEmail}
                  className="btn btn-primary"
                  type="button"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <span>Copied Email!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={handleClick}
                  className="btn btn-ghost"
                >
                  <Mail className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>Send Direct Mail</span>
                </a>

                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClick}
                  className="btn btn-ghost"
                >
                  <Linkedin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="arrow w-3.5 h-3.5" />
                </a>
              </div>

              {/* Live Web3Forms Dispatch Form */}
              <ContactForm onActionClick={onActionClick} />

              {/* 3D Coordinate Radar Sphere */}
              <div className="mt-8 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center gap-6">
                <Globe3D theme={theme} size={200} />
                <div>
                  <div className="text-[11px] font-mono text-orange-600 dark:text-orange-400 font-bold mb-1">
                    ENGINEERING_HUB // IST (UTC+5:30)
                  </div>
                  <div className="text-sm font-bold text-[var(--ink)]">
                    Bengaluru, Karnataka, India
                  </div>
                  <div className="text-xs text-[var(--ink-2)] mt-1 leading-relaxed">
                    Interactive 3D Sphere · Drag to spin coordinates. Open for Remote (Global) and Onsite relocation opportunities.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Connection Links & Mission Card */}
            <div className="contact-side min-w-0">
              <div
                onClick={handleCopyEmail}
                className="contact-link cursor-pointer min-w-0"
                title="Click to copy email address"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCopyEmail()}
              >
                <span className="lbl flex-shrink-0">EMAIL:</span>
                <span className="val min-w-0 flex items-center gap-2">
                  <span className="truncate">{PERSONAL_INFO.email}</span>
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
                </span>
              </div>

              <div
                onClick={handleCopyPhone}
                className="contact-link cursor-pointer min-w-0"
                title="Click to copy phone number"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCopyPhone()}
              >
                <span className="lbl flex-shrink-0">PHONE:</span>
                <span className="val min-w-0 flex items-center gap-2">
                  <span className="truncate">{PERSONAL_INFO.phone}</span>
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" /> : <Phone className="w-3.5 h-3.5 flex-shrink-0" />}
                </span>
              </div>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="contact-link min-w-0"
              >
                <span className="lbl flex-shrink-0">LINKEDIN:</span>
                <span className="val min-w-0 flex items-center gap-2">
                  <span className="truncate">/in/sidharth-singh-shrinet</span>
                  <ArrowUpRight className="flex-shrink-0" />
                </span>
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="contact-link min-w-0"
              >
                <span className="lbl flex-shrink-0">GITHUB:</span>
                <span className="val min-w-0 flex items-center gap-2">
                  <span className="truncate">@SidharthSinghShrinet</span>
                  <ArrowUpRight className="flex-shrink-0" />
                </span>
              </a>

              <a
                href={PERSONAL_INFO.showoffUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="contact-link min-w-0"
              >
                <span className="lbl flex-shrink-0">SHOWOFF AI:</span>
                <span className="val min-w-0 flex items-center gap-2">
                  <span className="truncate">showoff4u.in</span>
                  <ArrowUpRight className="flex-shrink-0" />
                </span>
              </a>

              <a
                href={PERSONAL_INFO.chatAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="contact-link min-w-0"
              >
                <span className="lbl flex-shrink-0">CHAT APP:</span>
                <span className="val min-w-0 flex items-center gap-2">
                  <span className="truncate">chat-app-live</span>
                  <ArrowUpRight className="flex-shrink-0" />
                </span>
              </a>

              {/* Personal Mission & Motto Card from v1 */}
              <div className="p-4 rounded-[var(--radius)] bg-[var(--paper-2)]/30 border border-[var(--line)] backdrop-blur-md mt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-600 dark:text-orange-400 font-bold mb-2">
                  <Quote className="w-3.5 h-3.5" />
                  <span>ENGINEERING PHILOSOPHY</span>
                </div>
                <p className="text-xs italic text-[var(--ink)] leading-relaxed">
                  "{PERSONAL_INFO.personalMotto}"
                </p>
                <div className="mt-3 pt-3 border-t border-[var(--line)]/50 flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    SLA: ~24h Response
                  </span>
                  <span>UTC+5:30 IST</span>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
