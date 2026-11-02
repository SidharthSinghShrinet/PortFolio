import { useState, useEffect, useCallback } from "react";
import {
  PROJECTS as STATIC_PROJECTS,
  STATS_DATA as STATIC_STATS,
  NOW_DATA as STATIC_NOW,
  PERSONAL_INFO as STATIC_PERSONAL,
  EXPERIENCES as STATIC_EXPERIENCES,
  TECH_CATEGORIES as STATIC_TECH,
  EDUCATION_DATA as STATIC_EDUCATION,
} from "../data/portfolioData";
import {
  fetchProjectsFromDb,
  fetchStatsFromDb,
  fetchNowStatusFromDb,
  fetchPersonalInfoFromDb,
  fetchExperiencesFromDb,
  fetchTechSkillsFromDb,
  fetchEducationFromDb,
  isSupabaseConfigured,
} from "../lib/supabase";

const CATEGORY_MAP = {
  ai: "ai",
  "ai & full stack": "ai",
  "full stack": "ai",
  ecommerce: "ecommerce",
  "e-commerce": "ecommerce",
  realtime: "realtime",
  "real-time": "realtime",
  "real-time / sockets": "realtime",
  sockets: "realtime",
  enterprise: "enterprise",
  "enterprise erp": "enterprise",
  erp: "enterprise",
  frontend: "frontend",
  "frontend ui/ux": "frontend",
  "ui/ux": "frontend",
};

/**
 * Normalizes Supabase project record into the portfolio card format
 */
function normalizeProject(dbRow, index) {
  const staticMatch =
    STATIC_PROJECTS.find(
      (p) =>
        p.id === dbRow.id ||
        (p.title && dbRow.title && p.title.toLowerCase().includes(dbRow.title.toLowerCase())) ||
        (dbRow.title && p.title && dbRow.title.toLowerCase().includes(p.title.toLowerCase()))
    ) || STATIC_PROJECTS[index];

  const bullets =
    Array.isArray(dbRow.bullets) && dbRow.bullets.length > 0
      ? dbRow.bullets
      : typeof dbRow.bullets === "string" && dbRow.bullets.trim()
      ? dbRow.bullets.split("\n").map((b) => b.trim()).filter(Boolean)
      : staticMatch?.bullets || [
          dbRow.description,
          `Engineered using ${Array.isArray(dbRow.tech_tags) ? dbRow.tech_tags.join(", ") : "modern web technologies"}.`,
        ];

  const subtitle =
    dbRow.subtitle ||
    staticMatch?.subtitle ||
    (dbRow.category ? `${dbRow.category} Project` : "Full Stack Platform");

  const kv =
    Array.isArray(dbRow.kv) && dbRow.kv.length > 0
      ? dbRow.kv
      : staticMatch?.kv || [
          { k: "Category", v: dbRow.category || "Web App" },
          { k: "Priority", v: `Rank #${index + 1}` },
          ...(dbRow.live_url ? [{ k: "Live URL", v: dbRow.live_url, accent: true }] : []),
          ...(dbRow.github_url ? [{ k: "GitHub", v: "Available", accent: true }] : []),
        ];

  const rawCat = (dbRow.category || "").toLowerCase().trim();
  const category = CATEGORY_MAP[rawCat] || staticMatch?.category || "ai";

  // Check if project is Qugenie or explicitly has no image
  const isQugenie =
    (dbRow.title && dbRow.title.toLowerCase().includes("qugenie")) ||
    staticMatch?.id === "qugenie";

  let previewImg = "";
  if (!isQugenie) {
    if (typeof dbRow.image_url === "string" && dbRow.image_url.trim()) {
      previewImg = dbRow.image_url.trim();
    } else if (dbRow.image_url === "" || dbRow.image_url === null) {
      previewImg = "";
    } else {
      previewImg = staticMatch?.previewImg || "";
    }
  }

  const slugId = staticMatch?.id || (dbRow.title ? dbRow.title.toLowerCase().replace(/[^a-z0-9]/g, "") : dbRow.id);

  return {
    id: slugId,
    dbId: dbRow.id,
    category,
    title: dbRow.title,
    subtitle,
    tagline: dbRow.description || staticMatch?.tagline || "",
    liveUrl: dbRow.live_url || staticMatch?.liveUrl || "",
    githubUrl: dbRow.github_url || staticMatch?.githubUrl || "",
    previewImg,
    featured: dbRow.featured !== false,
    chips:
      Array.isArray(dbRow.tech_tags) && dbRow.tech_tags.length > 0
        ? dbRow.tech_tags
        : typeof dbRow.tech_tags === "string" && dbRow.tech_tags.trim()
        ? dbRow.tech_tags.split(",").map((s) => s.trim()).filter(Boolean)
        : staticMatch?.chips || [],
    bullets,
    kv,
    comparisonVsV1: staticMatch?.comparisonVsV1 || null,
    isCurrentApp: staticMatch?.isCurrentApp || false,
    isLegacyBaseline: staticMatch?.isLegacyBaseline || false,
    sort_order: dbRow.sort_order ?? index,
  };
}

/**
 * Normalizes Supabase stats row into the STATS_DATA array format
 */
function normalizeStats(dbRow) {
  if (!dbRow) return STATIC_STATS;
  return [
    {
      num: dbRow.years_exp || "1.5",
      plus: "+",
      label: "YEARS EXP",
      sub: "Architecting enterprise ERP platforms & microservices.",
    },
    {
      num: dbRow.erp_submodules || "19",
      plus: "+",
      label: "ERP SUBMODULES",
      sub: "Built across Sales, HRMS & Admin with sub-100ms latency.",
    },
    {
      num: dbRow.react_projects || "60",
      plus: "+",
      label: "REACT PROJECTS",
      sub: "Engineered single-page apps, SPAs & full-stack platforms.",
    },
    {
      num: dbRow.mern_apps || "15",
      plus: "+",
      label: "MERN APPS",
      sub: "High-throughput production solutions with MongoDB & MySQL.",
    },
    {
      num: dbRow.leetcode_solved || "200",
      plus: "+",
      label: "LEETCODE SOLVED",
      sub: "Strong foundation in Data Structures, Algorithms & problem solving.",
    },
    {
      num: dbRow.active_users || "700",
      plus: "+",
      label: "ACTIVE USERS",
      sub: "Enterprise users governed by centralized RBAC daily.",
    },
  ];
}

/**
 * Normalizes Supabase experience record
 */
function normalizeExperience(dbRow) {
  return {
    id: dbRow.id,
    company: dbRow.company,
    role: dbRow.role,
    period: dbRow.duration || dbRow.period || "",
    location: dbRow.location || "",
    isLatest: Boolean(dbRow.is_latest),
    summary: dbRow.summary || (dbRow.bullets && dbRow.bullets[0]) || "",
    bullets: Array.isArray(dbRow.bullets) ? dbRow.bullets : [],
    tags: Array.isArray(dbRow.tags) ? dbRow.tags : [],
    sort_order: dbRow.sort_order ?? 0,
  };
}

/**
 * Normalizes Supabase tech skill record
 */
function normalizeTechSkill(dbRow) {
  return {
    id: dbRow.id,
    index: dbRow.category_index || "01",
    title: dbRow.category_title || "Category",
    skills: Array.isArray(dbRow.skills) ? dbRow.skills : [],
    sort_order: dbRow.sort_order ?? 0,
  };
}

/**
 * Normalizes Supabase education record
 */
function normalizeEducation(dbRow) {
  return {
    id: dbRow.id,
    degree: dbRow.degree,
    institution: dbRow.institution,
    period: dbRow.period,
    sort_order: dbRow.sort_order ?? 0,
  };
}

/**
 * usePortfolioDb Hook
 * 100% Dynamic data layer backed by Supabase with resilient static fallback to portfolioData.js
 */
export function usePortfolioDb() {
  const [projects, setProjects] = useState(STATIC_PROJECTS);
  const [stats, setStats] = useState(STATIC_STATS);
  const [nowData, setNowData] = useState(STATIC_NOW);
  const [personalInfo, setPersonalInfo] = useState(STATIC_PERSONAL);
  const [experiences, setExperiences] = useState(STATIC_EXPERIENCES);
  const [techCategories, setTechCategories] = useState(STATIC_TECH);
  const [educationData, setEducationData] = useState(STATIC_EDUCATION);

  const [rawDbData, setRawDbData] = useState({
    projects: [],
    stats: null,
    nowStatus: null,
    personalInfo: null,
    experiences: [],
    techSkills: [],
    education: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const reloadData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setIsLoading(true);

    try {
      const [
        dbProjects,
        dbStats,
        dbNow,
        dbPersonal,
        dbExperiences,
        dbTechSkills,
        dbEducation,
      ] = await Promise.all([
        fetchProjectsFromDb(),
        fetchStatsFromDb(),
        fetchNowStatusFromDb(),
        fetchPersonalInfoFromDb(),
        fetchExperiencesFromDb(),
        fetchTechSkillsFromDb(),
        fetchEducationFromDb(),
      ]);

      setRawDbData({
        projects: dbProjects || [],
        stats: dbStats || null,
        nowStatus: dbNow || null,
        personalInfo: dbPersonal || null,
        experiences: dbExperiences || [],
        techSkills: dbTechSkills || [],
        education: dbEducation || [],
      });

      // 1. Hydrate projects
      if (dbProjects && dbProjects.length > 0) {
        setProjects(dbProjects.map(normalizeProject));
        setIsLiveConnected(true);
      }

      // 2. Hydrate stats
      if (dbStats) {
        setStats(normalizeStats(dbStats));
        setIsLiveConnected(true);
      }

      // 3. Hydrate Now Section
      if (dbNow) {
        setNowData((prev) => ({
          ...prev,
          label: dbNow.label || prev.label || "Currently Building & Exploring",
          title: dbNow.title || prev.title || "Core Java, DSA & AI Semantic Recommendation Systems",
          description: dbNow.description || prev.description,
          focusAreas:
            Array.isArray(dbNow.focus_areas) && dbNow.focus_areas.length > 0
              ? dbNow.focus_areas.map((area) => ({
                  ...area,
                  skills: Array.isArray(area.skills)
                    ? area.skills
                    : typeof area.skills === "string"
                    ? area.skills.split(",").map((s) => s.trim()).filter(Boolean)
                    : [],
                }))
              : prev.focusAreas,
          telemetry:
            Array.isArray(dbNow.telemetry) && dbNow.telemetry.length > 0
              ? dbNow.telemetry
              : prev.telemetry,
        }));

        setPersonalInfo((prev) => ({
          ...prev,
          roleStatus: dbNow.role_status || prev.roleStatus,
          location: dbNow.location || prev.location,
          personalMotto: dbNow.personal_motto || prev.personalMotto,
        }));
        setIsLiveConnected(true);
      }

      // 4. Hydrate Personal Info from dedicated table if present
      if (dbPersonal) {
        setPersonalInfo((prev) => ({
          ...prev,
          name: dbPersonal.name || prev.name,
          title: dbPersonal.title || prev.title,
          headline: dbPersonal.headline || prev.headline,
          bio: dbPersonal.bio || prev.bio,
          email: dbPersonal.email || prev.email,
          phone: dbPersonal.phone || prev.phone,
          location: dbPersonal.location || prev.location,
          roleStatus: dbPersonal.role_status || prev.roleStatus,
          personalMotto: dbPersonal.personal_motto || prev.personalMotto,
          resumeUrl: dbPersonal.resume_url || prev.resumeUrl,
          profileImg: dbPersonal.profile_img || prev.profileImg,
          photoTag: dbPersonal.photo_tag || prev.photoTag,
          photoCorner: dbPersonal.photo_corner || prev.photoCorner,
          github: dbPersonal.github_url || prev.github,
          linkedin: dbPersonal.linkedin_url || prev.linkedin,
          githubUsername: dbPersonal.github_username || prev.githubUsername,
        }));
        setIsLiveConnected(true);
      }

      // 5. Hydrate Experiences
      if (dbExperiences && dbExperiences.length > 0) {
        setExperiences(dbExperiences.map(normalizeExperience));
        setIsLiveConnected(true);
      }

      // 6. Hydrate Tech Categories (Skills)
      if (dbTechSkills && dbTechSkills.length > 0) {
        setTechCategories(dbTechSkills.map(normalizeTechSkill));
        setIsLiveConnected(true);
      }

      // 7. Hydrate Education
      if (dbEducation && dbEducation.length > 0) {
        setEducationData(dbEducation.map(normalizeEducation));
        setIsLiveConnected(true);
      }
    } catch (err) {
      console.warn("usePortfolioDb error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  return {
    projects,
    stats,
    nowData,
    personalInfo,
    experiences,
    techCategories,
    educationData,
    rawDbData,
    isLoading,
    isLiveConnected,
    refresh: reloadData,
  };
}
