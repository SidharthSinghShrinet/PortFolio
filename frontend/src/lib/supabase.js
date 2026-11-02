import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  supabaseAnonKey.length > 10
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  : null;

// ============================================================================
// Public Read Queries (with resilient error catching)
// ============================================================================

export async function fetchProjectsFromDb() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Supabase fetchProjects warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Failed to fetch projects from Supabase:", err);
    return null;
  }
}

export async function fetchStatsFromDb() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetchStats warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Failed to fetch stats from Supabase:", err);
    return null;
  }
}

export async function fetchNowStatusFromDb() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("now_status")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("Supabase fetchNowStatus warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Failed to fetch now_status from Supabase:", err);
    return null;
  }
}

export async function fetchPersonalInfoFromDb() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("personal_info")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) {
      console.warn("Supabase fetchPersonalInfo warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Failed to fetch personal_info from Supabase:", err);
    return null;
  }
}

export async function fetchExperiencesFromDb() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase fetchExperiences warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Failed to fetch experiences from Supabase:", err);
    return null;
  }
}

export async function fetchTechSkillsFromDb() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("tech_skills")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("Supabase fetchTechSkills warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Failed to fetch tech_skills from Supabase:", err);
    return null;
  }
}

export async function fetchEducationFromDb() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("Supabase fetchEducation warning:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("Failed to fetch education from Supabase:", err);
    return null;
  }
}

// ============================================================================
// Admin Authenticated Mutations (Protected by Supabase Auth & RLS)
// ============================================================================

export async function upsertProjectInDb(project) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const bulletsArray = Array.isArray(project.bullets)
    ? project.bullets
    : typeof project.bullets === "string"
      ? project.bullets.split("\n").map((b) => b.trim()).filter(Boolean)
      : [];

  const payload = {
    title: project.title,
    subtitle: project.subtitle || "",
    description: project.description || project.tagline || "",
    category: project.category || "Full Stack",
    tech_tags: Array.isArray(project.tech_tags)
      ? project.tech_tags
      : typeof project.tech_tags === "string"
        ? project.tech_tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    bullets: bulletsArray,
    image_url: project.image_url !== undefined ? project.image_url : (project.previewImg || ""),
    live_url: project.live_url || project.liveUrl || "",
    github_url: project.github_url || project.githubUrl || "",
    featured: project.featured !== undefined ? project.featured : true,
    sort_order: project.sort_order ?? 0,
  };

  if (project.id && !project.id.toString().startsWith("custom-")) {
    payload.id = project.id;
  }

  const { data, error } = await supabase
    .from("projects")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProjectFromDb(id) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function updateStatsInDb(stats) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const payload = {
    years_exp: stats.years_exp || stats.yearsExp || "1.5",
    erp_submodules: stats.erp_submodules || stats.erpSubmodules || "19",
    react_projects: stats.react_projects || stats.reactProjects || "60",
    mern_apps: stats.mern_apps || stats.mernApps || "15",
    leetcode_solved: stats.leetcode_solved || stats.leetcodeSolved || "200",
    active_users: stats.active_users || stats.activeUsers || "700",
    api_latency: stats.api_latency || stats.apiLatency || "~100ms",
    updated_at: new Date().toISOString(),
  };

  if (stats.id) {
    payload.id = stats.id;
  }

  const { data, error } = await supabase
    .from("stats")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNowStatusInDb(nowData) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const payload = {
    label: nowData.label || "Currently Building & Exploring",
    title: nowData.title || "Core Java, DSA & AI Semantic Recommendation Systems",
    description: nowData.description || "",
    focus_areas: Array.isArray(nowData.focus_areas)
      ? nowData.focus_areas
      : Array.isArray(nowData.focusAreas)
      ? nowData.focusAreas
      : [],
    telemetry: Array.isArray(nowData.telemetry) ? nowData.telemetry : [],
    role_status: nowData.role_status || nowData.roleStatus || "",
    current_focus: nowData.current_focus || nowData.currentFocus || "",
    current_learning: nowData.current_learning || nowData.currentLearning || "",
    location: nowData.location || "",
    personal_motto: nowData.personal_motto || nowData.personalMotto || "",
    updated_at: new Date().toISOString(),
  };

  if (nowData.id) {
    payload.id = nowData.id;
  }

  const { data, error } = await supabase
    .from("now_status")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePersonalInfoInDb(info) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const payload = {
    name: info.name || "Sidharth Singh",
    title: info.title || "Full Stack Developer",
    headline: info.headline || "",
    bio: info.bio || "",
    email: info.email || "tushar15464@gmail.com",
    phone: info.phone || "+91-9936474728",
    location: info.location || "",
    role_status: info.role_status || info.roleStatus || "",
    personal_motto: info.personal_motto || info.personalMotto || "",
    resume_url: info.resume_url || info.resumeUrl || "/Resume.pdf",
    profile_img: info.profile_img || info.profileImg || "/profile.png",
    avatar_url: info.avatar_url || info.avatarUrl || "",
    photo_tag: info.photo_tag || info.photoTag || "",
    photo_corner: info.photo_corner || info.photoCorner || "",
    github_username: info.github_username || info.githubUsername || "",
    github_url: info.github_url || info.github || "",
    linkedin_url: info.linkedin_url || info.linkedin || "",
    updated_at: new Date().toISOString(),
  };

  if (info.id) {
    payload.id = info.id;
  }

  const { data, error } = await supabase
    .from("personal_info")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function upsertExperienceInDb(exp) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const payload = {
    company: exp.company,
    role: exp.role,
    duration: exp.duration || exp.period || "",
    location: exp.location || "",
    summary: exp.summary || "",
    bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
    tags: Array.isArray(exp.tags) ? exp.tags : (exp.tags ? exp.tags.split(",").map(t => t.trim()).filter(Boolean) : []),
    is_latest: Boolean(exp.is_latest || exp.isLatest),
    sort_order: exp.sort_order ?? 0,
  };

  if (exp.id && !exp.id.toString().startsWith("custom-")) {
    payload.id = exp.id;
  }

  const { data, error } = await supabase
    .from("experiences")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExperienceFromDb(id) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function upsertTechSkillInDb(skill) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const payload = {
    category_index: skill.category_index || skill.index || "01",
    category_title: skill.category_title || skill.title || "Category",
    skills: Array.isArray(skill.skills) ? skill.skills : (typeof skill.skills === "string" ? skill.skills.split(",").map(s => s.trim()).filter(Boolean) : []),
    sort_order: skill.sort_order ?? 0,
  };

  if (skill.id && !skill.id.toString().startsWith("custom-")) {
    payload.id = skill.id;
  }

  const { data, error } = await supabase
    .from("tech_skills")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTechSkillFromDb(id) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("tech_skills").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function upsertEducationInDb(edu) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const payload = {
    degree: edu.degree,
    institution: edu.institution,
    period: edu.period,
    sort_order: edu.sort_order ?? 0,
  };

  if (edu.id && !edu.id.toString().startsWith("custom-")) {
    payload.id = edu.id;
  }

  const { data, error } = await supabase
    .from("education")
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEducationFromDb(id) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Upload project thumbnail or resume to the public 'portfolio-assets' bucket
export async function uploadAssetToStorage(file, customPath) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const fileExt = file.name.split(".").pop();
  const fileName = customPath || `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-assets")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("portfolio-assets")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

// ============================================================================
// Auth Helpers
// ============================================================================

export async function loginAdmin(email, password) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAdminSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

