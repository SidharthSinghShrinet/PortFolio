import React, { useState, useRef, useEffect } from "react";
import { Terminal, CornerDownLeft, Sparkles, Check, ExternalLink } from "lucide-react";
import { PERSONAL_INFO } from "../../data/portfolioData";

const WELCOME_MESSAGE = [
  "portfolio.kernel v2.6.2 (x86_64-linux-gnu)",
  "Type 'help' for available commands, or press Tab to autocomplete.",
  "----------------------------------------------------------------",
];

const AUTOCOMPLETE_LIST = [
  "help",
  "about",
  "skills",
  "projects",
  "leetcode",
  "experience",
  "education",
  "contact",
  "resume",
  "github",
  "linkedin",
  "whoami",
  "status",
  "motto",
  "ls",
  "uptime",
  "history",
  "date",
  "clear",
  "ping erp",
  "curl showoff",
  "cat sidharth.config.json",
  "sudo hire",
];

export default function InteractiveTerminal({ onActionClick }) {
  const [history, setHistory] = useState([
    ...WELCOME_MESSAGE.map((text) => ({ type: "output", text })),
    { type: "output", text: "" },
    { type: "command", text: "cat sidharth.config.json" },
    { type: "output", text: "{" },
    { type: "output", text: `  "name": "${PERSONAL_INFO.name}",` },
    { type: "output", text: `  "role": "${PERSONAL_INFO.title}",` },
    { type: "output", text: `  "experience": "1.5+ years enterprise ERP & full-stack platforms",` },
    { type: "output", text: `  "stats": { "reactProjects": "60+", "mernApps": "15+", "leetcode": "200+" },` },
    { type: "output", text: `  "location": "${PERSONAL_INFO.location}",` },
    { type: "output", text: `  "coreStack": ["React 19", "Node.js", "TypeScript", "MySQL", "MongoDB", "Qdrant"],` },
    { type: "output", text: `  "status": "open_for_opportunities"` },
    { type: "output", text: "}" },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [easterEggActive, setEasterEggActive] = useState(false);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom of terminal when history updates
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    if (onActionClick) onActionClick();

    const lower = trimmed.toLowerCase();
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // 1. Clear command
    if (lower === "clear" || lower === "cls") {
      setHistory([]);
      setInputVal("");
      return;
    }

    // 2. Easter egg: sudo hire
    if (lower === "sudo hire" || lower === "sudo hire sidharth" || lower === "hire") {
      setEasterEggActive(true);
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "accent", text: "[AUTHORIZATION GRANTED] Root access acquired: sidharth_singh.fullstack" },
        { type: "output", text: "----------------------------------------------------------------" },
        { type: "output", text: "🎉 Status     : Available immediately for Full-Time SWE / Full Stack roles" },
        { type: "output", text: `📧 Direct Mail : ${PERSONAL_INFO.email}` },
        { type: "output", text: `📞 Phone       : ${PERSONAL_INFO.phone}` },
        { type: "output", text: `📍 Location    : ${PERSONAL_INFO.location}` },
        { type: "output", text: "⚡ Action      : Navigating to Section 05 [Contact Dispatch Portal]..." },
        { type: "output", text: "----------------------------------------------------------------" },
      ]);

      setTimeout(() => {
        const contactSection = document.querySelector("#contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
        window.location.href = `mailto:${PERSONAL_INFO.email}?subject=Interview%20Invitation%20for%20Full%20Stack%20Role`;
        setEasterEggActive(false);
      }, 900);

      setInputVal("");
      return;
    }

    // 3. Date command
    if (lower === "date") {
      const now = new Date();
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        {
          type: "output",
          text: now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) + " IST (Bengaluru, India)",
        },
      ]);
      setInputVal("");
      return;
    }

    // 4. History command
    if (lower === "history") {
      const histLines = cmdHistory.length > 0
        ? cmdHistory.map((cmd, idx) => `  ${idx + 1}  ${cmd}`)
        : ["  (no commands executed yet)"];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...histLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 5. Resume command
    if (lower === "resume" || lower === "cv") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "accent", text: `[FETCH SUCCESS] Downloading official resume: ${PERSONAL_INFO.resumeUrl}` },
        { type: "output", text: "Opening Resume.pdf in a new tab..." },
      ]);
      setTimeout(() => {
        window.open(PERSONAL_INFO.resumeUrl, "_blank");
      }, 600);
      setInputVal("");
      return;
    }

    // 6. GitHub command
    if (lower === "github" || lower === "gh") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "output", text: `GitHub: ${PERSONAL_INFO.github}` },
        { type: "accent", text: "Opening GitHub profile in a new tab..." },
      ]);
      setTimeout(() => {
        window.open(PERSONAL_INFO.github, "_blank");
      }, 600);
      setInputVal("");
      return;
    }

    // 7. LinkedIn command
    if (lower === "linkedin") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "output", text: `LinkedIn: ${PERSONAL_INFO.linkedin}` },
        { type: "accent", text: "Opening LinkedIn profile in a new tab..." },
      ]);
      setTimeout(() => {
        window.open(PERSONAL_INFO.linkedin, "_blank");
      }, 600);
      setInputVal("");
      return;
    }

    // 8. Whoami command
    if (lower === "whoami") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "output", text: `${PERSONAL_INFO.name.toLowerCase().replace(" ", "_")} (Full Stack Developer)` },
        { type: "output", text: `UID: 1000 · Location: ${PERSONAL_INFO.location}` },
        { type: "accent", text: "Specialty: Enterprise Microservices & High-Throughput Web Platforms" },
      ]);
      setInputVal("");
      return;
    }

    // 9. Status / Availability command
    if (lower === "status" || lower === "availability" || lower === "open") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "accent", text: `[CURRENT STATUS]: ${PERSONAL_INFO.roleStatus}` },
        { type: "output", text: `Location       : ${PERSONAL_INFO.location}` },
        { type: "output", text: `Email          : ${PERSONAL_INFO.email}` },
        { type: "output", text: `Response SLA   : Within 24 hours` },
        { type: "output", text: `Target Roles   : Full Stack Developer / Software Engineer` },
      ]);
      setInputVal("");
      return;
    }

    // 10. Motto / Philosophy command
    if (lower === "motto" || lower === "quote" || lower === "philosophy") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "accent", text: `"${PERSONAL_INFO.personalMotto}"` },
        { type: "output", text: `  — ${PERSONAL_INFO.name} · Full Stack Developer` },
      ]);
      setInputVal("");
      return;
    }

    // 11. Directory Listing (ls / dir / ll)
    if (lower === "ls" || lower === "dir" || lower === "ll") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "output", text: "drwxr-xr-x  projects/         (ShowOff, DesireMart, ChatApp, Qugenie ERP, Portfolio v2.6 & v1.0, Zomato)" },
        { type: "output", text: "-rw-r--r--  sidharth.config.json" },
        { type: "output", text: "-rw-r--r--  skills.txt" },
        { type: "output", text: "-rw-r--r--  portfolio_evolution.md" },
        { type: "output", text: "-rw-r--r--  experience.log" },
        { type: "output", text: "-rw-r--r--  leetcode_200.dsa" },
        { type: "output", text: "-rw-r--r--  education.md" },
        { type: "output", text: "-rw-r--r--  resume.pdf" },
      ]);
      setInputVal("");
      return;
    }

    // 12. Cat commands (cat, cat sidharth.config.json, cat skills.txt, etc.)
    if (lower.startsWith("cat")) {
      const target = lower.replace("cat", "").trim();
      let outputLines = [];

      if (!target || target === "sidharth.config.json" || target === "config" || target === "config.json") {
        outputLines = [
          "{",
          `  "name": "${PERSONAL_INFO.name}",`,
          `  "role": "${PERSONAL_INFO.title}",`,
          `  "degree": "B.Tech in Computer Science & Engineering (AKTU)",`,
          `  "experience": "1.5+ years enterprise ERP & full-stack platforms",`,
          `  "stats": {`,
          `    "reactProjects": "${PERSONAL_INFO.statsSummary?.reactProjects || "60+"}",`,
          `    "mernApps": "${PERSONAL_INFO.statsSummary?.mernApps || "15+"}",`,
          `    "leetcodeSolved": "${PERSONAL_INFO.statsSummary?.leetcodeSolved || "200+"}",`,
          `    "activeUsers": "${PERSONAL_INFO.statsSummary?.activeUsers || "700+"}"`,
          `  },`,
          `  "motto": "${PERSONAL_INFO.personalMotto}",`,
          `  "location": "${PERSONAL_INFO.location}",`,
          `  "coreStack": ["React 19", "Node.js", "TypeScript", "MySQL", "MongoDB", "Qdrant"],`,
          `  "status": "open_for_opportunities"`,
          "}",
        ];
      } else if (target === "skills.txt" || target === "skills") {
        outputLines = [
          "[CORE ARSENAL]",
          "  Languages  : JavaScript (ES5/ES6+), TypeScript, Java, Python, C Language, SQL, HTML5, CSS3",
          "  Frontend   : React 19, Next.js 16, Redux Toolkit, Ant Design, Tailwind 4, Material UI, Chakra UI",
          "  Backend    : Node.js, Express.js, REST APIs, Socket.IO, Axios, Express Validator, OAuth",
          "  Databases  : MongoDB Atlas, Qdrant (Vector DB), MySQL, PostgreSQL, Sequelize, Prisma",
          "  Security   : Centralized RBAC, JOSE HS256 JWT, Argon2, Bcrypt",
          "  DevOps     : Git, Gitea, Docker, Vercel, Hostinger, Postman, Chrome DevTools",
        ];
      } else if (target === "portfolio_evolution.md" || target === "portfolio" || target === "portfoliov2" || target === "v2") {
        outputLines = [
          "[PORTFOLIO v2.6 vs v1.0 ARCHITECTURAL EVOLUTION]",
          "  v2.6 Live       : https://sidharth-singh-portfolio-v2.vercel.app/ (Production Platform)",
          "  v1.0 Baseline   : https://sidharth-singh-portfolio.vercel.app/ (Original React.js + Vite Archive)",
          "  Highlights      : 3D Canvas Particle Mesh, UNIX Shell Kernel, GitHub REST API Live Stream,",
          "                   Web Audio Synthesizer, ⌘K Command Palette, Dynamic OKLCH Theming (+8 upgrades).",
        ];
      } else if (target === "resume.pdf" || target === "resume") {
        outputLines = [`Opening official resume: ${PERSONAL_INFO.resumeUrl}`];
        window.open(PERSONAL_INFO.resumeUrl, "_blank");
      } else if (target === "education.md" || target === "education") {
        outputLines = [
          "[ACADEMIC QUALIFICATIONS]",
          "  Degree     : Bachelor of Technology (B.Tech) in Computer Science & Engineering",
          "  University : Dr. APJ Abdul Kalam Technical University (AKTU), Lucknow",
          "  Duration   : 2021 – 2025 · CGPA: 7.03",
          "  Training   : MERN Full Stack Development, QSpiders Bengaluru (2025)",
        ];
      } else {
        outputLines = [`cat: ${target}: No such file or directory (try 'ls' to see available files)`];
      }

      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 13. Ping commands (ping, ping erp, ping api, ping showoff)
    if (lower.startsWith("ping")) {
      const outputLines = [
        "PING api.qugenie.internal (10.0.4.12): 56 data bytes",
        "64 bytes from 10.0.4.12: icmp_seq=1 ttl=64 time=98.4 ms",
        "64 bytes from 10.0.4.12: icmp_seq=2 ttl=64 time=99.1 ms",
        "64 bytes from 10.0.4.12: icmp_seq=3 ttl=64 time=97.8 ms",
        "--- api.qugenie.internal ping statistics ---",
        "3 packets transmitted, 3 received, 0% packet loss, time 2002ms",
        "rtt min/avg/max = 97.8/98.4/99.1 ms [sub-100ms verified across 19 submodules]",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 14. Curl commands (curl, curl showoff, curl api)
    if (lower.startsWith("curl")) {
      const outputLines = [
        "HTTP/2 200 OK",
        "date: " + new Date().toUTCString(),
        "server: cloudflare",
        "content-type: application/json; charset=utf-8",
        "{",
        '  "status": "healthy",',
        '  "service": "ShowOff AI Blogging & Devlog Engine",',
        '  "version": "1.4.0",',
        '  "lighthouse": { "performance": 98, "seo": 100 },',
        '  "uptime": "99.98%"',
        "}",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 15. Uptime & uname commands
    if (lower === "uptime" || lower === "top") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "output", text: "portfolio.kernel up 42 days, 13:37, 1 active session, load average: 0.08, 0.04, 0.01" },
        { type: "accent", text: "Sub-100ms API latency verified across all production services." },
      ]);
      setInputVal("");
      return;
    }

    if (lower === "uname" || lower === "uname -a") {
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        { type: "output", text: "Linux portfolio-node 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux" },
      ]);
      setInputVal("");
      return;
    }

    // 16. Help / Commands list
    if (lower === "help" || lower === "?" || lower === "commands") {
      const helpLines = [
        "Core Commands:",
        "  about        Developer summary JSON, verified stats & motto",
        "  skills       Technical arsenal (Languages, React 19, Node.js, DBs)",
        "  projects     List production platforms & live URLs",
        "  leetcode     200+ solved algorithmic problem breakdown",
        "  experience   Enterprise ERP role at Qugates & QSpiders",
        "  education    B.Tech CSE (AKTU) & professional certifications",
        "  contact      Direct contact channels & email dispatch",
        "  resume       View & download official resume (Resume.pdf)",
        "  github       Open GitHub profile (@SidharthSinghShrinet)",
        "  linkedin     Open LinkedIn profile",
        "",
        "System & Utilities:",
        "  ping erp     Sub-100ms microservice latency test",
        "  curl showoff Inspect ShowOff API health & status",
        "  ls           List simulated file system entries",
        "  cat <file>   Inspect files (e.g. cat sidharth.config.json)",
        "  whoami       Current shell user & role context",
        "  status       Current role availability & location",
        "  motto        Developer engineering philosophy",
        "  uptime       System runtime & status",
        "  history      Show command history",
        "  date         Current time in Bengaluru (IST)",
        "  clear        Clear terminal display buffer (or Ctrl+L)",
        "  sudo hire    Trigger direct interview protocol (Easter Egg)",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...helpLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 17. About command
    if (lower === "about" || lower === "bio" || lower === "profile" || lower === "info") {
      const outputLines = [
        "{",
        `  "name": "${PERSONAL_INFO.name}",`,
        `  "role": "${PERSONAL_INFO.title}",`,
        `  "degree": "B.Tech in Computer Science & Engineering (AKTU)",`,
        `  "experience": "1.5+ years enterprise ERP & full-stack platforms",`,
        `  "stats": {`,
        `    "reactProjects": "${PERSONAL_INFO.statsSummary?.reactProjects || "60+"}",`,
        `    "mernApps": "${PERSONAL_INFO.statsSummary?.mernApps || "15+"}",`,
        `    "leetcodeSolved": "${PERSONAL_INFO.statsSummary?.leetcodeSolved || "200+"}",`,
        `    "activeUsers": "${PERSONAL_INFO.statsSummary?.activeUsers || "700+"}"`,
        `  },`,
        `  "motto": "${PERSONAL_INFO.personalMotto}",`,
        `  "location": "${PERSONAL_INFO.location}",`,
        `  "coreStack": ["React 19", "Node.js", "TypeScript", "MySQL", "MongoDB", "Qdrant"],`,
        `  "status": "open_for_opportunities"`,
        "}",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 18. Skills command
    if (lower === "skills" || lower === "stack" || lower === "tech" || lower === "arsenal" || lower === "languages") {
      const outputLines = [
        "[CORE ARSENAL]",
        "  Languages  : JavaScript (ES5/ES6+), TypeScript, Java, Python, C Language, SQL, HTML5, CSS3",
        "  Frontend   : React 19, Next.js 16, Redux Toolkit, Ant Design, Tailwind 4, Material UI, Chakra UI",
        "  Backend    : Node.js, Express.js, REST APIs, Socket.IO, Axios, Express Validator, OAuth",
        "  Databases  : MongoDB Atlas, Qdrant (Vector DB), MySQL, PostgreSQL, Sequelize, Prisma",
        "  Security   : Centralized RBAC, JOSE HS256 JWT, Argon2, Bcrypt",
        "  DevOps     : Git, Gitea, Docker, Vercel, Hostinger, Postman, Chrome DevTools",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 19. Projects command
    if (lower === "projects" || lower === "proj" || lower === "apps" || lower === "work") {
      const outputLines = [
        "1. ShowOff — AI Blogging & Devlog Platform [LIVE]",
        "   Live   : https://showoff4u.in/",
        "   GitHub : https://github.com/SidharthSinghShrinet/Sequelize-BlogApp",
        "2. DesireMart — Production E-Commerce Platform",
        "   GitHub : https://github.com/SidharthSinghShrinet/NextJS-E-Commerce (Next.js 16 App Router)",
        "3. Real-Time Chat App [LIVE]",
        "   Live   : https://chat-app-frontend-lovat-six.vercel.app/",
        "   GitHub : https://github.com/SidharthSinghShrinet/ChatApp-MERN",
        "4. Qugenie Automotive ERP (Dealership Management System)",
        "   Scale  : 19 sales + 9 HR/Admin submodules, RBAC for 700+ daily staff",
        "5. Personal Portfolio v2.6 — Interactive Engineering Platform [CURRENT]",
        "   Live   : https://sidharth-singh-portfolio-v2.vercel.app/",
        "   GitHub : https://github.com/SidharthSinghShrinet/PortFolio/tree/main-V2 (branch: main-V2)",
        "6. Personal Portfolio v1.0 — Foundational Developer Showcase [ARCHIVE]",
        "   Live   : https://sidharth-singh-portfolio.vercel.app/",
        "   GitHub : https://github.com/SidharthSinghShrinet/PortFolio/tree/main (branch: main)",
        "7. Zomato Clone — Food Discovery UI/UX [LIVE]",
        "   Live   : https://zomato-clone-eta-black.vercel.app/",
        "   GitHub : https://github.com/SidharthSinghShrinet/Zomato-Clone",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 20. LeetCode command
    if (lower === "leetcode" || lower === "dsa" || lower === "algo" || lower === "problems") {
      const outputLines = [
        "[LEETCODE SOLVED: 200+ PROBLEMS]",
        "  Data Structures : Arrays, Hash Tables, Two Pointers, Sliding Window, Linked Lists",
        "  Trees & Graphs  : Binary Trees, Binary Search Trees, DFS, BFS, Shortest Paths",
        "  Dynamic Program : Memoization, Tabulation, 0/1 Knapsack, Subsequence",
        "  Algorithms      : Sorting, Binary Search, Divide & Conquer, Greedy, Backtracking",
        `  Motto           : "${PERSONAL_INFO.personalMotto}"`,
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 21. Experience command
    if (lower === "experience" || lower === "exp" || lower === "qugates" || lower === "qspiders") {
      const outputLines = [
        "[01] Qugates Technologies — Full Stack Developer (Feb 2026 – Sept 2026)",
        "     • Architecture : 19 sales submodules + 9 HR/Admin submodules for Qugenie automotive ERP.",
        "     • RBAC Engine  : Centralized authorization governing 700+ daily active staff.",
        "     • Performance  : ~100ms average API response time under concurrent dealership load.",
        "     • Frontend     : Micro-frontends using React.js and Ant Design.",
        "[02] QSpiders — MERN Stack Intern (Jan 2025 – Dec 2025)",
        "     • MongoDB aggregations, 15+ REST endpoints, JWT authentication in Agile sprints.",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 22. Education command
    if (lower === "education" || lower === "edu" || lower === "degree" || lower === "college" || lower === "aktu") {
      const outputLines = [
        "[ACADEMIC FOUNDATIONS & CERTIFICATIONS]",
        "  Degree     : Bachelor of Technology (B.Tech) in Computer Science & Engineering",
        "  University : Dr. APJ Abdul Kalam Technical University (AKTU), Lucknow",
        "  Duration   : 2021 – 2025 · CGPA: 7.03",
        "  Training   : MERN Full Stack Development, QSpiders Bengaluru (2025)",
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // 23. Contact command
    if (lower === "contact" || lower === "email" || lower === "phone" || lower === "reach") {
      const outputLines = [
        `Email    : ${PERSONAL_INFO.email}`,
        `Phone    : ${PERSONAL_INFO.phone}`,
        `LinkedIn : ${PERSONAL_INFO.linkedin}`,
        `GitHub   : ${PERSONAL_INFO.github}`,
        `Resume   : ${PERSONAL_INFO.resumeUrl}`,
        `Form     : Submit directly via Section 05 [Contact Dispatch Form]`,
      ];
      setHistory((prev) => [
        ...prev,
        { type: "command", text: trimmed },
        ...outputLines.map((text) => ({ type: "output", text })),
      ]);
      setInputVal("");
      return;
    }

    // Default: Command not found
    setHistory((prev) => [
      ...prev,
      { type: "command", text: trimmed },
      {
        type: "error",
        text: `shell: command not found: "${trimmed}". Type 'help' to see valid commands or press Tab.`,
      },
    ]);
    setInputVal("");
  };

  const handleKeyDown = (e) => {
    // 1. Ctrl + L: Clear terminal buffer
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setHistory([]);
      setInputVal("");
      return;
    }

    // 2. Tab: Autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;

      const matches = AUTOCOMPLETE_LIST.filter((cmd) => cmd.startsWith(current));
      if (matches.length === 1) {
        setInputVal(matches[0]);
      } else if (matches.length > 1) {
        // Find longest common prefix or show matches
        const exactMatch = matches.find((m) => m === current);
        if (exactMatch) {
          setInputVal(exactMatch);
        } else {
          setInputVal(matches[0]);
        }
      }
      return;
    }

    // 3. Enter: Execute command
    if (e.key === "Enter") {
      executeCommand(inputVal);
      return;
    }

    // 4. ArrowUp: Command history backward
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex + 1 < cmdHistory.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
      return;
    }

    // 5. ArrowDown: Command history forward
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
      } else {
        setHistoryIndex(-1);
        setInputVal("");
      }
      return;
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div id="terminal" className="terminal w-full shadow-lg" onClick={handleTerminalClick}>
      {/* Terminal Titlebar */}
      <div className="terminal-bar justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="dot r flex-shrink-0" />
          <span className="dot y flex-shrink-0" />
          <span className="dot g flex-shrink-0" />
          <span className="title ml-2 font-mono text-xs truncate">sidharth@kernel-node: ~</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {easterEggActive && (
            <span className="text-[10px] font-mono text-emerald-400 animate-pulse whitespace-nowrap font-bold">
              [SUDO HIRED]
            </span>
          )}
          <span className="text-[10px] font-mono text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/35 whitespace-nowrap hidden sm:inline-block font-semibold">
            CLI INTERACTIVE · TAB AUTOCOMPLETE
          </span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={terminalBodyRef}
        className="terminal-body font-mono text-xs max-h-[240px] overflow-y-auto"
      >
        {history.map((item, idx) => (
          <div key={idx} className="terminal-line">
            {item.type === "command" ? (
              <div className="flex items-center gap-1.5 text-orange-300 font-semibold">
                <span className="text-emerald-400 flex-shrink-0 font-semibold">sidharth:~$</span>
                <span className="break-all">{item.text}</span>
              </div>
            ) : item.type === "error" ? (
              <span className="text-red-400 font-medium break-words">{item.text}</span>
            ) : item.type === "accent" ? (
              <span className="text-emerald-300 font-semibold break-words">{item.text}</span>
            ) : (
              <span className="text-slate-200 opacity-95 break-words">{item.text}</span>
            )}
          </div>
        ))}

        {/* Live Input Line */}
        <div className="terminal-line flex items-center gap-1.5 mt-1.5">
          <span className="text-emerald-400 flex-shrink-0 font-semibold">sidharth:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'projects', 'leetcode' or press Tab..."
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-400 caret-orange-400 font-mono text-xs p-0 m-0 min-w-0"
            autoComplete="off"
            spellCheck="false"
            aria-label="Interactive terminal command input"
          />
        </div>
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="p-2.5 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center gap-1.5 flex-wrap overflow-x-auto">
        <span className="text-[10px] font-mono text-slate-400 mr-1 font-medium">Quick:</span>
        {["help", "skills", "projects", "leetcode", "experience", "ping erp", "sudo hire"].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              executeCommand(cmd);
            }}
            className="px-2 py-0.5 rounded text-[10.5px] font-mono bg-white/[0.06] backdrop-blur-sm text-slate-200 border border-white/15 hover:border-orange-400 hover:text-orange-300 hover:bg-orange-500/15 transition-colors cursor-pointer"
          >
            ${cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
