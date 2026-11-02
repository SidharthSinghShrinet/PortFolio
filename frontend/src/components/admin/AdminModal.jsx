import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Lock,
  LogOut,
  FolderPlus,
  Edit2,
  Trash2,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  BarChart3,
  Compass,
  FileText,
  Loader2,
  RefreshCw,
  User,
  Briefcase,
  Code2,
  GraduationCap,
  Plus,
} from "lucide-react";
import {
  supabase,
  loginAdmin,
  logoutAdmin,
  getAdminSession,
  upsertProjectInDb,
  deleteProjectFromDb,
  updateStatsInDb,
  updateNowStatusInDb,
  updatePersonalInfoInDb,
  upsertExperienceInDb,
  deleteExperienceFromDb,
  upsertTechSkillInDb,
  deleteTechSkillFromDb,
  upsertEducationInDb,
  deleteEducationFromDb,
  uploadAssetToStorage,
} from "../../lib/supabase";

export default function AdminModal({ isOpen, onClose, onRefreshData, rawDbData }) {
  const [session, setSession] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("projects");

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Feedback notifications
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // 1. Project Editing State
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    id: null,
    title: "",
    subtitle: "",
    description: "",
    category: "Full Stack",
    tech_tags: "",
    bullets: "",
    image_url: "",
    live_url: "",
    github_url: "",
    featured: true,
    sort_order: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // 2. Personal Info Form State
  const [personalForm, setPersonalForm] = useState({
    id: null,
    name: "Sidharth Singh",
    title: "Full Stack Developer",
    headline: "I build scalable enterprise systems & production-grade platforms.",
    bio: "Full Stack Developer (B.Tech CSE) with 1.5+ years of experience, 60+ React projects, and 200+ LeetCode problems solved. Hands-on domain experience in automotive dealership ERP systems, HR management, and e-commerce with low-latency API optimization (~100ms under heavy transaction load).",
    email: "tushar15464@gmail.com",
    phone: "+91-9936474728",
    location: "Bengaluru, KA (Open to Remote / Relocation)",
    role_status: "AVAILABLE FOR ROLES · FULL STACK DEVELOPER",
    personal_motto: "Crafting beautiful code is my passion, solving problems is my mission.",
    resume_url: "/Resume.pdf",
    profile_img: "/profile.png",
    photo_tag: "sidharth_singh.fullstack [v1.5]",
    photo_corner: "KA/BLR",
    github_url: "https://github.com/SidharthSinghShrinet/",
    linkedin_url: "https://www.linkedin.com/in/sidharth-singh-shrinet",
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // 3. Experience State
  const [isEditingExp, setIsEditingExp] = useState(false);
  const [expForm, setExpForm] = useState({
    id: null,
    company: "",
    role: "",
    duration: "",
    location: "",
    summary: "",
    bullets: "",
    tags: "",
    is_latest: false,
    sort_order: 0,
  });

  // 4. Tech Skills State
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({
    id: null,
    category_index: "01",
    category_title: "",
    skills: "",
    sort_order: 0,
  });

  // 5. Education State
  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({
    id: null,
    degree: "",
    institution: "",
    period: "",
    sort_order: 0,
  });

  // 6. Stats Form State
  const [statsForm, setStatsForm] = useState({
    id: null,
    years_exp: "1.5",
    erp_submodules: "19",
    react_projects: "60",
    mern_apps: "15",
    leetcode_solved: "200",
    active_users: "700",
    api_latency: "~100ms",
  });

  // 7. Now Status Form State
  const [nowForm, setNowForm] = useState({
    id: null,
    label: "Currently Building & Exploring",
    title: "Core Java, DSA & AI Semantic Recommendation Systems",
    description:
      "Actively deepening algorithmic rigor with Data Structures & Algorithms (DSA) and Core Java (JVM memory architecture, multithreading, concurrency, and OOP design patterns). Concurrently engineering AI semantic search workflows using Qdrant vector embeddings, hybrid cosine similarity retrieval, and personalized recommendation engines.",
    focus_areas: [
      {
        domain: "Core Java & System Architecture",
        badge: "BACKEND FOUNDATION",
        desc: "JVM internals, Garbage Collection tuning, Java 21 Virtual Threads, Multithreading Concurrency, and Low-Level Object-Oriented Design (SOLID & Gang of Four patterns).",
        skills: ["Java 21", "JVM Internals", "Multithreading", "OOP Patterns", "Collections Framework"],
        status: "ACTIVE EXPLORATION",
        accent: "orange",
      },
      {
        domain: "Data Structures & Algorithms (DSA)",
        badge: "ALGORITHMIC RIGOR",
        desc: "Optimizing time/space complexity through daily algorithmic problem-solving across Graph Traversals (BFS/DFS), Dynamic Programming, Tree balancing, and Sliding Window techniques.",
        skills: ["Graph Theory", "Dynamic Programming", "Trees & Tries", "Complexity Optimization", "Backtracking"],
        status: "DAILY DRILLS",
        accent: "blue",
      },
      {
        domain: "In AI Semantic Search & Recommendation Systems",
        badge: "VECTOR RETRIEVAL",
        desc: "Designing contextual vector search pipelines via Qdrant & OpenAI/Gemini embeddings. Implementing Cosine Similarity ranking, hybrid dense-sparse retrieval, and real-time personalized recommendation algorithms.",
        skills: ["Qdrant Vector DB", "Cosine Similarity", "Dense Embeddings", "Hybrid Re-ranking", "Collaborative Filtering"],
        status: "PROTOTYPE PIPELINES",
        accent: "purple",
      },
    ],
    telemetry: [
      { k: "Primary Focus", v: "Core Java + Advanced DSA", accent: true },
      { k: "AI Architecture", v: "Semantic Search & Recommendation", accent: true },
      { k: "Vector Engine", v: "Qdrant (Cosine / Dense)" },
      { k: "Design Focus", v: "Sub-100ms Low-Memory Retrieval" },
      { k: "Location", v: "Bengaluru, KA (IST)" },
      { k: "Availability", v: "Open to SWE Opportunities", accent: true },
    ],
    role_status: "AVAILABLE FOR ROLES · FULL STACK DEVELOPER",
    current_focus: "Core Java, JVM memory architecture & Advanced DSA",
    current_learning: "AI Semantic Search & Qdrant Vector Pipelines",
    location: "Bengaluru, KA (Open to Remote / Relocation)",
    personal_motto: "Crafting beautiful code is my passion, solving problems is my mission.",
  });

  // Asset Upload State
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState("");
  const [uploadingAsset, setUploadingAsset] = useState(false);

  const modalRef = useRef(null);

  // Sync session on mount
  useEffect(() => {
    async function checkAuth() {
      setAuthChecking(true);
      const activeSession = await getAdminSession();
      setSession(activeSession);
      setAuthChecking(false);
    }
    checkAuth();

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
        }
      );
      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  // Sync existing db data into forms when opened or refreshed
  useEffect(() => {
    if (rawDbData?.stats) {
      setStatsForm({
        id: rawDbData.stats.id || null,
        years_exp: rawDbData.stats.years_exp || "1.5",
        erp_submodules: rawDbData.stats.erp_submodules || "19",
        react_projects: rawDbData.stats.react_projects || "60",
        mern_apps: rawDbData.stats.mern_apps || "15",
        leetcode_solved: rawDbData.stats.leetcode_solved || "200",
        active_users: rawDbData.stats.active_users || "700",
        api_latency: rawDbData.stats.api_latency || "~100ms",
      });
    }

    if (rawDbData?.nowStatus) {
      setNowForm({
        id: rawDbData.nowStatus.id || null,
        label: rawDbData.nowStatus.label || "Currently Building & Exploring",
        title: rawDbData.nowStatus.title || "Core Java, DSA & AI Semantic Recommendation Systems",
        description: rawDbData.nowStatus.description || "",
        focus_areas: Array.isArray(rawDbData.nowStatus.focus_areas) && rawDbData.nowStatus.focus_areas.length > 0
          ? rawDbData.nowStatus.focus_areas
          : [
              {
                domain: "Core Java & System Architecture",
                badge: "BACKEND FOUNDATION",
                desc: "JVM internals, Garbage Collection tuning, Java 21 Virtual Threads, Multithreading Concurrency, and Low-Level Object-Oriented Design (SOLID & Gang of Four patterns).",
                skills: ["Java 21", "JVM Internals", "Multithreading", "OOP Patterns", "Collections Framework"],
                status: "ACTIVE EXPLORATION",
                accent: "orange",
              },
              {
                domain: "Data Structures & Algorithms (DSA)",
                badge: "ALGORITHMIC RIGOR",
                desc: "Optimizing time/space complexity through daily algorithmic problem-solving across Graph Traversals (BFS/DFS), Dynamic Programming, Tree balancing, and Sliding Window techniques.",
                skills: ["Graph Theory", "Dynamic Programming", "Trees & Tries", "Complexity Optimization", "Backtracking"],
                status: "DAILY DRILLS",
                accent: "blue",
              },
              {
                domain: "In AI Semantic Search & Recommendation Systems",
                badge: "VECTOR RETRIEVAL",
                desc: "Designing contextual vector search pipelines via Qdrant & OpenAI/Gemini embeddings. Implementing Cosine Similarity ranking, hybrid dense-sparse retrieval, and real-time personalized recommendation algorithms.",
                skills: ["Qdrant Vector DB", "Cosine Similarity", "Dense Embeddings", "Hybrid Re-ranking", "Collaborative Filtering"],
                status: "PROTOTYPE PIPELINES",
                accent: "purple",
              },
            ],
        telemetry: Array.isArray(rawDbData.nowStatus.telemetry) && rawDbData.nowStatus.telemetry.length > 0
          ? rawDbData.nowStatus.telemetry
          : [
              { k: "Primary Focus", v: "Core Java + Advanced DSA", accent: true },
              { k: "AI Architecture", v: "Semantic Search & Recommendation", accent: true },
              { k: "Vector Engine", v: "Qdrant (Cosine / Dense)" },
              { k: "Design Focus", v: "Sub-100ms Low-Memory Retrieval" },
              { k: "Location", v: "Bengaluru, KA (IST)" },
              { k: "Availability", v: "Open to SWE Opportunities", accent: true },
            ],
        role_status: rawDbData.nowStatus.role_status || "",
        current_focus: rawDbData.nowStatus.current_focus || "",
        current_learning: rawDbData.nowStatus.current_learning || "",
        location: rawDbData.nowStatus.location || "",
        personal_motto: rawDbData.nowStatus.personal_motto || "",
      });
    }

    if (rawDbData?.personalInfo) {
      setPersonalForm({
        id: rawDbData.personalInfo.id || null,
        name: rawDbData.personalInfo.name || "Sidharth Singh",
        title: rawDbData.personalInfo.title || "Full Stack Developer",
        headline: rawDbData.personalInfo.headline || "I build scalable enterprise systems & production-grade platforms.",
        bio: rawDbData.personalInfo.bio || "Full Stack Developer (B.Tech CSE) with 1.5+ years of experience, 60+ React projects, and 200+ LeetCode problems solved. Hands-on domain experience in automotive dealership ERP systems, HR management, and e-commerce with low-latency API optimization (~100ms under heavy transaction load).",
        email: rawDbData.personalInfo.email || "tushar15464@gmail.com",
        phone: rawDbData.personalInfo.phone || "+91-9936474728",
        location: rawDbData.personalInfo.location || "Bengaluru, KA",
        role_status: rawDbData.personalInfo.role_status || "",
        personal_motto: rawDbData.personalInfo.personal_motto || "",
        resume_url: rawDbData.personalInfo.resume_url || "/Resume.pdf",
        profile_img: rawDbData.personalInfo.profile_img || "/profile.png",
        photo_tag: rawDbData.personalInfo.photo_tag || "sidharth_singh.fullstack [v1.5]",
        photo_corner: rawDbData.personalInfo.photo_corner || "KA/BLR",
        github_url: rawDbData.personalInfo.github_url || "",
        linkedin_url: rawDbData.personalInfo.linkedin_url || "",
      });
    }
  }, [rawDbData]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const showNotification = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: "", text: "" });
    }, 4500);
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await loginAdmin(email, password);
      setSession(res.session);
      showNotification("success", "Authentication successful. Root Admin verified.");
      if (onRefreshData) onRefreshData();
    } catch (err) {
      setLoginError(err.message || "Failed to authenticate as administrator.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logoutAdmin();
    setSession(null);
    showNotification("info", "Logged out from administrator session.");
  };

  // 1. Project Handlers
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      await upsertProjectInDb(projectForm);
      showNotification("success", `Project "${projectForm.title}" saved successfully!`);
      setIsEditingProject(false);
      setProjectForm({
        id: null,
        title: "",
        subtitle: "",
        description: "",
        category: "Full Stack",
        tech_tags: "",
        bullets: "",
        image_url: "",
        live_url: "",
        github_url: "",
        featured: true,
        sort_order: 0,
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to save project.");
    }
  };

  const handleEditProjectClick = (p) => {
    setProjectForm({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || "",
      description: p.description || p.tagline || "",
      category: p.category || "Full Stack",
      tech_tags: Array.isArray(p.tech_tags)
        ? p.tech_tags.join(", ")
        : Array.isArray(p.chips)
        ? p.chips.join(", ")
        : p.tech_tags || "",
      bullets: Array.isArray(p.bullets) ? p.bullets.join("\n") : p.bullets || "",
      image_url: p.image_url || p.previewImg || "",
      live_url: p.live_url || p.liveUrl || "",
      github_url: p.github_url || p.githubUrl || "",
      featured: p.featured !== false,
      sort_order: p.sort_order ?? 0,
    });
    setIsEditingProject(true);
  };

  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await deleteProjectFromDb(id);
      showNotification("success", `Project deleted.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to delete project.");
    }
  };

  const handleProjectImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const publicUrl = await uploadAssetToStorage(file);
      setProjectForm((prev) => ({ ...prev, image_url: publicUrl }));
      showNotification("success", "Screenshot uploaded to portfolio-assets storage!");
    } catch (err) {
      showNotification("error", `Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // 2. Personal Info Handler
  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      await updatePersonalInfoInDb(personalForm);
      showNotification("success", "Personal bio & contact information updated!");
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to update profile info.");
    }
  };

  // 3. Experience Handlers
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    try {
      const bulletsArray = expForm.bullets
        ? (Array.isArray(expForm.bullets) ? expForm.bullets : expForm.bullets.split("\n").map(b => b.trim()).filter(Boolean))
        : [];
      const tagsArray = expForm.tags
        ? (Array.isArray(expForm.tags) ? expForm.tags : expForm.tags.split(",").map(t => t.trim()).filter(Boolean))
        : [];

      await upsertExperienceInDb({
        ...expForm,
        bullets: bulletsArray,
        tags: tagsArray,
      });

      showNotification("success", `Experience at "${expForm.company}" saved!`);
      setIsEditingExp(false);
      setExpForm({
        id: null,
        company: "",
        role: "",
        duration: "",
        location: "",
        summary: "",
        bullets: "",
        tags: "",
        is_latest: false,
        sort_order: 0,
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to save experience.");
    }
  };

  const handleDeleteExperience = async (id, company) => {
    if (!window.confirm(`Delete experience record at "${company}"?`)) return;
    try {
      await deleteExperienceFromDb(id);
      showNotification("success", `Experience record removed.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to delete.");
    }
  };

  // 4. Skills Handlers
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skillForm.skills
        ? (Array.isArray(skillForm.skills) ? skillForm.skills : skillForm.skills.split(",").map(s => s.trim()).filter(Boolean))
        : [];

      await upsertTechSkillInDb({
        ...skillForm,
        skills: skillsArray,
      });

      showNotification("success", `Skill category "${skillForm.category_title}" saved!`);
      setIsEditingSkill(false);
      setSkillForm({
        id: null,
        category_index: "01",
        category_title: "",
        skills: "",
        sort_order: 0,
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to save skills.");
    }
  };

  const handleDeleteSkill = async (id, title) => {
    if (!window.confirm(`Delete skill category "${title}"?`)) return;
    try {
      await deleteTechSkillFromDb(id);
      showNotification("success", `Skill category removed.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to delete skill.");
    }
  };

  // 5. Education Handlers
  const handleSaveEducation = async (e) => {
    e.preventDefault();
    try {
      await upsertEducationInDb(eduForm);
      showNotification("success", `Education milestone saved!`);
      setIsEditingEdu(false);
      setEduForm({
        id: null,
        degree: "",
        institution: "",
        period: "",
        sort_order: 0,
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to save education.");
    }
  };

  const handleDeleteEducation = async (id, degree) => {
    if (!window.confirm(`Delete education record "${degree}"?`)) return;
    try {
      await deleteEducationFromDb(id);
      showNotification("success", `Education record removed.`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to delete.");
    }
  };

  // 6. Stats save
  const handleSaveStats = async (e) => {
    e.preventDefault();
    try {
      await updateStatsInDb(statsForm);
      showNotification("success", "Live metrics and stats updated successfully!");
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to update stats.");
    }
  };

  // 7. Now Status Handlers
  const handleUpdateFocusArea = (index, field, value) => {
    setNowForm((prev) => {
      const updated = [...(prev.focus_areas || [])];
      if (!updated[index]) return prev;
      if (field === "skills") {
        updated[index] = {
          ...updated[index],
          skills: typeof value === "string" ? value.split(",").map((s) => s.trim()).filter(Boolean) : value,
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, focus_areas: updated };
    });
  };

  const handleUpdateTelemetry = (index, field, value) => {
    setNowForm((prev) => {
      const updated = [...(prev.telemetry || [])];
      if (!updated[index]) return prev;
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, telemetry: updated };
    });
  };

  const handleSaveNow = async (e) => {
    e.preventDefault();
    try {
      await updateNowStatusInDb(nowForm);
      showNotification("success", "Now & Status section updated successfully!");
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showNotification("error", err.message || "Failed to update status.");
    }
  };

  // Generic asset upload
  const handleGenericAssetUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAsset(true);
    try {
      const publicUrl = await uploadAssetToStorage(file, file.name.includes("Resume") ? "Resume.pdf" : undefined);
      setUploadedAssetUrl(publicUrl);
      showNotification("success", "File uploaded into portfolio-assets storage bucket!");
    } catch (err) {
      showNotification("error", `Upload failed: ${err.message}`);
    } finally {
      setUploadingAsset(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] shadow-2xl overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--line)] bg-[var(--paper-2)]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              SYS.ADMIN // FULL CONTROL CENTER
            </span>
            {session && (
              <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--paper-3)] border border-[var(--line)] text-[var(--muted)]">
                {session.user.email}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {session && (
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs font-mono rounded border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 flex items-center gap-1 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-3)] transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status notification banner */}
        {statusMsg.text && (
          <div
            className={`px-4 py-2 text-xs font-mono flex items-center gap-2 border-b ${statusMsg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : statusMsg.type === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                : "bg-blue-500/10 border-blue-500/30 text-blue-500"
              }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {authChecking ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-[var(--muted)] font-mono text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span>Verifying credentials...</span>
            </div>
          ) : !session ? (
            /* ========================================================== */
            /* LOGIN FORM (Unauthenticated)                               */
            /* ========================================================== */
            <div className="max-w-md mx-auto py-10">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-3 border border-orange-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-mono text-[var(--ink)]">
                  ADMINISTRATIVE_GATE
                </h3>
                <p className="text-xs font-mono text-[var(--muted)] mt-1">
                  Authenticate with your registered admin credentials to manage portfolio data.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                    ADMIN_EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="[EMAIL_ADDRESS]"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>AUTHENTICATE ROOT SESSION</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ========================================================== */
            /* DASHBOARD TABS (Authenticated)                             */
            /* ========================================================== */
            <div>
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-1.5 pb-4 mb-6 border-b border-[var(--line)]">
                <button
                  onClick={() => {
                    setActiveTab("projects");
                    setIsEditingProject(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "projects"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Projects ({rawDbData?.projects?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "profile"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <User className="w-4 h-4" />
                  <span>Personal Info</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("experience");
                    setIsEditingExp(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "experience"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Experience ({rawDbData?.experiences?.length || 0})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("skills");
                    setIsEditingSkill(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "skills"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Skills ({rawDbData?.techSkills?.length || 0})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("education");
                    setIsEditingEdu(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "education"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Education ({rawDbData?.education?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "stats"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Stats &amp; Metrics</span>
                </button>

                <button
                  onClick={() => setActiveTab("now")}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "now"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Now &amp; Status</span>
                </button>

                <button
                  onClick={() => setActiveTab("assets")}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === "assets"
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-600 dark:text-orange-400 font-bold"
                    : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)]"
                    }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Storage</span>
                </button>

                <button
                  onClick={onRefreshData}
                  className="ml-auto px-2.5 py-1 text-xs font-mono rounded text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper-2)] flex items-center gap-1 cursor-pointer"
                  title="Reload DB"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sync</span>
                </button>
              </div>

              {/* ====================================================== */}
              {/* TAB 1: PROJECTS                                         */}
              {/* ====================================================== */}
              {activeTab === "projects" && (
                <div>
                  {!isEditingProject ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-mono text-[var(--muted)]">
                          Manage live production projects visible on your portfolio.
                        </p>
                        <button
                          onClick={() => {
                            setProjectForm({
                              id: null,
                              title: "",
                              subtitle: "",
                              description: "",
                              category: "Full Stack",
                              tech_tags: "",
                              bullets: "",
                              image_url: "",
                              live_url: "",
                              github_url: "",
                              featured: true,
                              sort_order: (rawDbData?.projects?.length || 0) + 1,
                            });
                            setIsEditingProject(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FolderPlus className="w-4 h-4" />
                          <span>Add New Project</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {rawDbData?.projects?.length === 0 ? (
                          <div className="p-8 text-center text-xs font-mono text-[var(--muted)] border border-dashed border-[var(--line)] rounded-xl">
                            No projects found in database. Click "Add New Project" above.
                          </div>
                        ) : (
                          rawDbData?.projects?.map((p) => (
                            <div
                              key={p.id}
                              className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-orange-500/40 transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {p.image_url ? (
                                  <img
                                    src={p.image_url}
                                    alt={p.title}
                                    className="w-12 h-12 rounded-lg object-cover border border-[var(--line)] shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-[var(--paper-3)] border border-[var(--line)] flex items-center justify-center font-mono text-xs text-[var(--muted)] shrink-0">
                                    IMG
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-[var(--ink)] truncate font-mono">
                                      {p.title}
                                    </h4>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                      {p.category}
                                    </span>
                                  </div>
                                  <p className="text-xs text-[var(--muted)] truncate mt-0.5 max-w-md">
                                    {p.description}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {p.live_url && (
                                  <a
                                    href={p.live_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg text-[var(--muted)] hover:text-orange-500 hover:bg-[var(--paper-3)]"
                                    title="Open Live URL"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => handleEditProjectClick(p)}
                                  className="px-2.5 py-1 rounded text-xs font-mono bg-[var(--paper-3)] hover:bg-orange-500/20 hover:text-orange-500 text-[var(--ink)] border border-[var(--line)] flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(p.id, p.title)}
                                  className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Project Add/Edit Form */
                    <form onSubmit={handleSaveProject} className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                        <h4 className="text-sm font-bold font-mono text-[var(--ink)] flex items-center gap-2">
                          <Edit2 className="w-4 h-4 text-orange-500" />
                          <span>{projectForm.id ? "Edit Project" : "Create New Project"}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="text-xs font-mono text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            PROJECT_TITLE *
                          </label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) =>
                              setProjectForm((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="e.g. ShowOff"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            SUBTITLE / ARCHITECTURE SPEC
                          </label>
                          <input
                            type="text"
                            value={projectForm.subtitle}
                            onChange={(e) =>
                              setProjectForm((prev) => ({ ...prev, subtitle: e.target.value }))
                            }
                            placeholder="e.g. AI-Powered Devlog & Blogging Platform"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            CATEGORY
                          </label>
                          <select
                            value={projectForm.category}
                            onChange={(e) =>
                              setProjectForm((prev) => ({ ...prev, category: e.target.value }))
                            }
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                          >
                            <option value="Full Stack">Full Stack</option>
                            <option value="AI & Full Stack">AI &amp; Full Stack</option>
                            <option value="E-Commerce">E-Commerce</option>
                            <option value="Real-Time / Sockets">Real-Time / Sockets</option>
                            <option value="Enterprise ERP">Enterprise ERP</option>
                            <option value="Frontend UI/UX">Frontend UI/UX</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            TECH_TAGS (Comma separated)
                          </label>
                          <input
                            type="text"
                            value={projectForm.tech_tags}
                            onChange={(e) =>
                              setProjectForm((prev) => ({ ...prev, tech_tags: e.target.value }))
                            }
                            placeholder="React 19, Node.js, Express, PostgreSQL"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          TAGLINE / BRIEF SUMMARY *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={projectForm.description}
                          onChange={(e) =>
                            setProjectForm((prev) => ({ ...prev, description: e.target.value }))
                          }
                          placeholder="Brief technical summary..."
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          PROJECT_BULLET_POINTS (One accomplishment per line)
                        </label>
                        <textarea
                          rows={5}
                          value={projectForm.bullets}
                          onChange={(e) =>
                            setProjectForm((prev) => ({ ...prev, bullets: e.target.value }))
                          }
                          placeholder="Architected a monorepo full-stack publishing platform with Express and React 19...&#10;Built a GitHub-integrated Project Showcase module...&#10;Designed a five-tier AI cover art generation pipeline with Gemini Flash...&#10;Secured session authentication using JOSE HS256 JWTs with Argon2..."
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500 leading-relaxed"
                        />
                        <p className="text-[11px] font-mono text-[var(--muted)] mt-1">
                          Each line will display as an interactive bullet point inside this project card.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            LIVE_URL
                          </label>
                          <input
                            type="url"
                            value={projectForm.live_url}
                            onChange={(e) =>
                              setProjectForm((prev) => ({ ...prev, live_url: e.target.value }))
                            }
                            placeholder="https://..."
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            GITHUB_URL
                          </label>
                          <input
                            type="url"
                            value={projectForm.github_url}
                            onChange={(e) =>
                              setProjectForm((prev) => ({ ...prev, github_url: e.target.value }))
                            }
                            placeholder="https://github.com/..."
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          PROJECT_IMAGE (URL or Upload)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={projectForm.image_url}
                            onChange={(e) =>
                              setProjectForm((prev) => ({ ...prev, image_url: e.target.value }))
                            }
                            placeholder="/showoff4u.png or https://..."
                            className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-orange-500"
                          />
                          <label className="px-3 py-2 rounded-lg bg-[var(--paper-3)] border border-[var(--line)] hover:border-orange-500 font-mono text-xs text-[var(--ink)] flex items-center gap-1.5 cursor-pointer shrink-0">
                            {uploadingImage ? (
                              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                            ) : (
                              <Upload className="w-4 h-4 text-orange-500" />
                            )}
                            <span>Upload Screenshot</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProjectImageUpload}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--line)]">
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="px-4 py-2 rounded-lg font-mono text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Project</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ====================================================== */}
              {/* TAB 2: PERSONAL INFO                                   */}
              {/* ====================================================== */}
              {activeTab === "profile" && (
                <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                  <p className="text-xs font-mono text-[var(--muted)] mb-4">
                    Modify your public developer profile, contact details, and resume link.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        FULL_NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.name}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        HEADLINE_TITLE (e.g. Full Stack Developer)
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.title}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        HERO_HEADING (Main H1 display)
                      </label>
                      <input
                        type="text"
                        value={personalForm.headline}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, headline: e.target.value }))
                        }
                        placeholder="I build scalable enterprise systems & production-grade platforms."
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        HERO_BIO (Introduction narrative paragraph)
                      </label>
                      <textarea
                        rows={3}
                        value={personalForm.bio}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        placeholder="Full Stack Developer (B.Tech CSE) with 1.5+ years of experience..."
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        EMAIL_ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        value={personalForm.email}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        PHONE_NUMBER
                      </label>
                      <input
                        type="text"
                        value={personalForm.phone}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        LOCATION
                      </label>
                      <input
                        type="text"
                        value={personalForm.location}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, location: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        ROLE_STATUS (HERO BADGE)
                      </label>
                      <input
                        type="text"
                        value={personalForm.role_status}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, role_status: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        GITHUB_URL
                      </label>
                      <input
                        type="url"
                        value={personalForm.github_url}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, github_url: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        LINKEDIN_URL
                      </label>
                      <input
                        type="url"
                        value={personalForm.linkedin_url}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, linkedin_url: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                      PERSONAL_MOTTO
                    </label>
                    <textarea
                      rows={2}
                      value={personalForm.personal_motto}
                      onChange={(e) =>
                        setPersonalForm((prev) => ({ ...prev, personal_motto: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                    />
                  </div>

                  {/* Resume and Avatar Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        RESUME_PDF_URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={personalForm.resume_url}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({ ...prev, resume_url: e.target.value }))
                          }
                          className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                        <label className="px-3 py-2 rounded-lg bg-[var(--paper-3)] border border-[var(--line)] font-mono text-xs cursor-pointer shrink-0">
                          {uploadingResume ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingResume(true);
                              try {
                                const url = await uploadAssetToStorage(file, "Resume.pdf");
                                setPersonalForm(prev => ({ ...prev, resume_url: url }));
                                showNotification("success", "Resume PDF uploaded!");
                              } catch (err) {
                                showNotification("error", err.message);
                              } finally {
                                setUploadingResume(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        PROFILE_IMAGE_URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={personalForm.profile_img}
                          onChange={(e) =>
                            setPersonalForm((prev) => ({ ...prev, profile_img: e.target.value }))
                          }
                          className="flex-1 px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                        <label className="px-3 py-2 rounded-lg bg-[var(--paper-3)] border border-[var(--line)] font-mono text-xs cursor-pointer shrink-0">
                          {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingAvatar(true);
                              try {
                                const url = await uploadAssetToStorage(file);
                                setPersonalForm(prev => ({ ...prev, profile_img: url }));
                                showNotification("success", "Avatar uploaded!");
                              } catch (err) {
                                showNotification("error", err.message);
                              } finally {
                                setUploadingAvatar(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        PHOTO_TAG (Overlay badge on photo)
                      </label>
                      <input
                        type="text"
                        value={personalForm.photo_tag || ""}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, photo_tag: e.target.value }))
                        }
                        placeholder="sidharth_singh.fullstack [v1.5]"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        PHOTO_CORNER (Corner geo tag)
                      </label>
                      <input
                        type="text"
                        value={personalForm.photo_corner || ""}
                        onChange={(e) =>
                          setPersonalForm((prev) => ({ ...prev, photo_corner: e.target.value }))
                        }
                        placeholder="KA/BLR"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[var(--line)]">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Personal Info</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ====================================================== */}
              {/* TAB 3: WORK EXPERIENCE                                 */}
              {/* ====================================================== */}
              {activeTab === "experience" && (
                <div>
                  {!isEditingExp ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-mono text-[var(--muted)]">
                          Manage your work history, enterprise accomplishments, and roles.
                        </p>
                        <button
                          onClick={() => {
                            setExpForm({
                              id: null,
                              company: "",
                              role: "",
                              duration: "",
                              location: "Bengaluru, KA",
                              summary: "",
                              bullets: "",
                              tags: "React.js, Node.js, TypeScript",
                              is_latest: false,
                              sort_order: (rawDbData?.experiences?.length || 0) + 1,
                            });
                            setIsEditingExp(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Work Experience</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {rawDbData?.experiences?.length === 0 ? (
                          <div className="p-8 text-center text-xs font-mono text-[var(--muted)] border border-dashed border-[var(--line)] rounded-xl">
                            No experiences found in database. Click "Add Work Experience" to add one.
                          </div>
                        ) : (
                          rawDbData?.experiences?.map((exp) => (
                            <div
                              key={exp.id}
                              className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-orange-500/40 transition-all"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-[var(--ink)] font-mono">
                                    {exp.role} · {exp.company}
                                  </h4>
                                  {exp.is_latest && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                                      CURRENT
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[var(--muted)] font-mono mt-0.5">
                                  {exp.duration} · {exp.location}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  onClick={() => {
                                    setExpForm({
                                      id: exp.id,
                                      company: exp.company,
                                      role: exp.role,
                                      duration: exp.duration || exp.period || "",
                                      location: exp.location || "",
                                      summary: exp.summary || "",
                                      bullets: Array.isArray(exp.bullets) ? exp.bullets.join("\n") : exp.bullets || "",
                                      tags: Array.isArray(exp.tags) ? exp.tags.join(", ") : exp.tags || "",
                                      is_latest: Boolean(exp.is_latest),
                                      sort_order: exp.sort_order ?? 0,
                                    });
                                    setIsEditingExp(true);
                                  }}
                                  className="px-2.5 py-1 rounded text-xs font-mono bg-[var(--paper-3)] hover:bg-orange-500/20 hover:text-orange-500 text-[var(--ink)] border border-[var(--line)] flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteExperience(exp.id, exp.company)}
                                  className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveExperience} className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                        <h4 className="text-sm font-bold font-mono text-[var(--ink)]">
                          {expForm.id ? "Edit Work Experience" : "Add Work Experience"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingExp(false)}
                          className="text-xs font-mono text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            COMPANY_NAME *
                          </label>
                          <input
                            type="text"
                            required
                            value={expForm.company}
                            onChange={(e) => setExpForm(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="e.g. Qugates Technologies"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            ROLE_TITLE *
                          </label>
                          <input
                            type="text"
                            required
                            value={expForm.role}
                            onChange={(e) => setExpForm(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="e.g. Full Stack Developer"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            PERIOD / DURATION *
                          </label>
                          <input
                            type="text"
                            required
                            value={expForm.duration}
                            onChange={(e) => setExpForm(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="e.g. Feb 2026 – Sept 2026"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            LOCATION
                          </label>
                          <input
                            type="text"
                            value={expForm.location}
                            onChange={(e) => setExpForm(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Bengaluru, KA"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          SUMMARY
                        </label>
                        <textarea
                          rows={2}
                          value={expForm.summary}
                          onChange={(e) => setExpForm(prev => ({ ...prev, summary: e.target.value }))}
                          placeholder="Brief overview of scope and responsibilities..."
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          BULLET_POINTS (One per line)
                        </label>
                        <textarea
                          rows={4}
                          value={expForm.bullets}
                          onChange={(e) => setExpForm(prev => ({ ...prev, bullets: e.target.value }))}
                          placeholder="Architected enterprise ERP ecosystem...&#10;Enforced RBAC security engine..."
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          TAGS (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={expForm.tags}
                          onChange={(e) => setExpForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="React.js, Node.js, MySQL, Microservices"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs font-mono text-[var(--ink)] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={expForm.is_latest}
                            onChange={(e) => setExpForm(prev => ({ ...prev, is_latest: e.target.checked }))}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                          <span>MARK_AS_CURRENT_ROLE</span>
                        </label>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[var(--muted)]">SORT_ORDER:</span>
                          <input
                            type="number"
                            value={expForm.sort_order}
                            onChange={(e) => setExpForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                            className="w-16 px-2 py-1 text-xs rounded bg-[var(--paper-2)] border border-[var(--line)] font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--line)]">
                        <button
                          type="button"
                          onClick={() => setIsEditingExp(false)}
                          className="px-4 py-2 rounded-lg font-mono text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Experience</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ====================================================== */}
              {/* TAB 4: SKILLS & TECH STACK                             */}
              {/* ====================================================== */}
              {activeTab === "skills" && (
                <div>
                  {!isEditingSkill ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-mono text-[var(--muted)]">
                          Manage technical categories and skill pills in your Technical Arsenal.
                        </p>
                        <button
                          onClick={() => {
                            setSkillForm({
                              id: null,
                              category_index: `0${(rawDbData?.techSkills?.length || 0) + 1}`,
                              category_title: "",
                              skills: "",
                              sort_order: (rawDbData?.techSkills?.length || 0) + 1,
                            });
                            setIsEditingSkill(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Skill Category</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {rawDbData?.techSkills?.length === 0 ? (
                          <div className="p-8 text-center text-xs font-mono text-[var(--muted)] border border-dashed border-[var(--line)] rounded-xl">
                            No skills in database. Click "Add Skill Category" above.
                          </div>
                        ) : (
                          rawDbData?.techSkills?.map((skill) => (
                            <div
                              key={skill.id}
                              className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-orange-500/40 transition-all"
                            >
                              <div>
                                <h4 className="text-sm font-bold text-[var(--ink)] font-mono">
                                  {skill.category_index} // {skill.category_title}
                                </h4>
                                <p className="text-xs text-[var(--muted)] font-mono mt-1">
                                  {Array.isArray(skill.skills) ? skill.skills.join(" · ") : skill.skills}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  onClick={() => {
                                    setSkillForm({
                                      id: skill.id,
                                      category_index: skill.category_index,
                                      category_title: skill.category_title,
                                      skills: Array.isArray(skill.skills) ? skill.skills.join(", ") : skill.skills || "",
                                      sort_order: skill.sort_order ?? 0,
                                    });
                                    setIsEditingSkill(true);
                                  }}
                                  className="px-2.5 py-1 rounded text-xs font-mono bg-[var(--paper-3)] hover:bg-orange-500/20 hover:text-orange-500 text-[var(--ink)] border border-[var(--line)] flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(skill.id, skill.category_title)}
                                  className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveSkill} className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                        <h4 className="text-sm font-bold font-mono text-[var(--ink)]">
                          {skillForm.id ? "Edit Skill Category" : "Add Skill Category"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingSkill(false)}
                          className="text-xs font-mono text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            CATEGORY_INDEX (e.g. 01)
                          </label>
                          <input
                            type="text"
                            required
                            value={skillForm.category_index}
                            onChange={(e) => setSkillForm(prev => ({ ...prev, category_index: e.target.value }))}
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                            CATEGORY_TITLE *
                          </label>
                          <input
                            type="text"
                            required
                            value={skillForm.category_title}
                            onChange={(e) => setSkillForm(prev => ({ ...prev, category_title: e.target.value }))}
                            placeholder="e.g. Cloud &amp; DevOps"
                            className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          SKILLS (Comma separated)
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={skillForm.skills}
                          onChange={(e) => setSkillForm(prev => ({ ...prev, skills: e.target.value }))}
                          placeholder="Docker, Kubernetes, AWS, CI/CD Pipelines, GitHub Actions"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--line)]">
                        <button
                          type="button"
                          onClick={() => setIsEditingSkill(false)}
                          className="px-4 py-2 rounded-lg font-mono text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Skills</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ====================================================== */}
              {/* TAB 5: EDUCATION                                       */}
              {/* ====================================================== */}
              {activeTab === "education" && (
                <div>
                  {!isEditingEdu ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-mono text-[var(--muted)]">
                          Manage degrees, certifications, and academic qualifications.
                        </p>
                        <button
                          onClick={() => {
                            setEduForm({
                              id: null,
                              degree: "",
                              institution: "",
                              period: "",
                              sort_order: (rawDbData?.education?.length || 0) + 1,
                            });
                            setIsEditingEdu(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Education</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {rawDbData?.education?.length === 0 ? (
                          <div className="p-8 text-center text-xs font-mono text-[var(--muted)] border border-dashed border-[var(--line)] rounded-xl">
                            No education entries in database. Click "Add Education" above.
                          </div>
                        ) : (
                          rawDbData?.education?.map((edu) => (
                            <div
                              key={edu.id}
                              className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-orange-500/40 transition-all"
                            >
                              <div>
                                <h4 className="text-sm font-bold text-[var(--ink)] font-mono">
                                  {edu.degree}
                                </h4>
                                <p className="text-xs text-[var(--muted)] font-mono mt-0.5">
                                  {edu.institution} · {edu.period}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  onClick={() => {
                                    setEduForm({
                                      id: edu.id,
                                      degree: edu.degree,
                                      institution: edu.institution,
                                      period: edu.period,
                                      sort_order: edu.sort_order ?? 0,
                                    });
                                    setIsEditingEdu(true);
                                  }}
                                  className="px-2.5 py-1 rounded text-xs font-mono bg-[var(--paper-3)] hover:bg-orange-500/20 hover:text-orange-500 text-[var(--ink)] border border-[var(--line)] flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteEducation(edu.id, edu.degree)}
                                  className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveEducation} className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                        <h4 className="text-sm font-bold font-mono text-[var(--ink)]">
                          {eduForm.id ? "Edit Education" : "Add Education"}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingEdu(false)}
                          className="text-xs font-mono text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          DEGREE / CERTIFICATE *
                        </label>
                        <input
                          type="text"
                          required
                          value={eduForm.degree}
                          onChange={(e) => setEduForm(prev => ({ ...prev, degree: e.target.value }))}
                          placeholder="Bachelor of Technology (B.Tech) · CSE"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          INSTITUTION *
                        </label>
                        <input
                          type="text"
                          required
                          value={eduForm.institution}
                          onChange={(e) => setEduForm(prev => ({ ...prev, institution: e.target.value }))}
                          placeholder="Dr. APJ Abdul Kalam Technical University"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          PERIOD *
                        </label>
                        <input
                          type="text"
                          required
                          value={eduForm.period}
                          onChange={(e) => setEduForm(prev => ({ ...prev, period: e.target.value }))}
                          placeholder="2021 – 2025 · CGPA: 7.03"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--line)]">
                        <button
                          type="button"
                          onClick={() => setIsEditingEdu(false)}
                          className="px-4 py-2 rounded-lg font-mono text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Education</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ====================================================== */}
              {/* TAB 6: METRICS & STATS                                 */}
              {/* ====================================================== */}
              {activeTab === "stats" && (
                <form onSubmit={handleSaveStats} className="space-y-4">
                  <p className="text-xs font-mono text-[var(--muted)] mb-4">
                    Update the high-density metrics displayed in your stats banner &amp; hero section.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        YEARS_EXP (e.g. 1.5)
                      </label>
                      <input
                        type="text"
                        value={statsForm.years_exp}
                        onChange={(e) =>
                          setStatsForm((prev) => ({ ...prev, years_exp: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        ERP_SUBMODULES (e.g. 19)
                      </label>
                      <input
                        type="text"
                        value={statsForm.erp_submodules}
                        onChange={(e) =>
                          setStatsForm((prev) => ({ ...prev, erp_submodules: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        REACT_PROJECTS (e.g. 60)
                      </label>
                      <input
                        type="text"
                        value={statsForm.react_projects}
                        onChange={(e) =>
                          setStatsForm((prev) => ({ ...prev, react_projects: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        MERN_APPS (e.g. 15)
                      </label>
                      <input
                        type="text"
                        value={statsForm.mern_apps}
                        onChange={(e) =>
                          setStatsForm((prev) => ({ ...prev, mern_apps: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        LEETCODE_SOLVED (e.g. 200)
                      </label>
                      <input
                        type="text"
                        value={statsForm.leetcode_solved}
                        onChange={(e) =>
                          setStatsForm((prev) => ({ ...prev, leetcode_solved: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        ACTIVE_USERS (e.g. 700)
                      </label>
                      <input
                        type="text"
                        value={statsForm.active_users}
                        onChange={(e) =>
                          setStatsForm((prev) => ({ ...prev, active_users: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        API_LATENCY (e.g. ~100ms)
                      </label>
                      <input
                        type="text"
                        value={statsForm.api_latency}
                        onChange={(e) =>
                          setStatsForm((prev) => ({ ...prev, api_latency: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[var(--line)]">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Live Stats</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ====================================================== */}
              {/* TAB 7: NOW & STATUS                                    */}
              {/* ====================================================== */}
              {activeTab === "now" && (
                <form onSubmit={handleSaveNow} className="space-y-6">
                  <p className="text-xs font-mono text-[var(--muted)]">
                    Customize your live Now section (label, title, overview description), 3 domain focus cards, bottom telemetry strip, and availability status.
                  </p>

                  {/* 1. Header Overview */}
                  <div className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] space-y-4">
                    <h4 className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      Section Header &amp; Overview
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          SECTION_LABEL (Badge)
                        </label>
                        <input
                          type="text"
                          value={nowForm.label || ""}
                          onChange={(e) =>
                            setNowForm((prev) => ({ ...prev, label: e.target.value }))
                          }
                          placeholder="Currently Building & Exploring"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          SECTION_TITLE
                        </label>
                        <input
                          type="text"
                          value={nowForm.title || ""}
                          onChange={(e) =>
                            setNowForm((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="Core Java, DSA & AI Semantic Recommendation Systems"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                        DESCRIPTION (Detailed lead paragraph)
                      </label>
                      <textarea
                        rows={3}
                        value={nowForm.description || ""}
                        onChange={(e) =>
                          setNowForm((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Actively deepening algorithmic rigor with..."
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                      />
                    </div>
                  </div>

                  {/* 2. Three Focus Cards */}
                  <div className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] space-y-4">
                    <h4 className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      Domain Focus Cards (3 Cards)
                    </h4>

                    {(nowForm.focus_areas || []).map((card, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-[var(--paper-3)]/60 border border-[var(--line)] space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400">
                            CARD 0{idx + 1}: {card.domain || `Domain ${idx + 1}`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono text-[var(--muted)] mb-1">
                              DOMAIN_TITLE
                            </label>
                            <input
                              type="text"
                              value={card.domain || ""}
                              onChange={(e) =>
                                handleUpdateFocusArea(idx, "domain", e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[var(--muted)] mb-1">
                              TOP_BADGE
                            </label>
                            <input
                              type="text"
                              value={card.badge || ""}
                              onChange={(e) =>
                                handleUpdateFocusArea(idx, "badge", e.target.value)
                              }
                              placeholder="e.g. BACKEND FOUNDATION"
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[var(--muted)] mb-1">
                              STATUS_PILL
                            </label>
                            <input
                              type="text"
                              value={card.status || ""}
                              onChange={(e) =>
                                handleUpdateFocusArea(idx, "status", e.target.value)
                              }
                              placeholder="e.g. ACTIVE EXPLORATION"
                              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1">
                            CARD_DESCRIPTION
                          </label>
                          <textarea
                            rows={2}
                            value={card.desc || ""}
                            onChange={(e) =>
                              handleUpdateFocusArea(idx, "desc", e.target.value)
                            }
                            placeholder="What you are researching or implementing..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-[var(--muted)] mb-1">
                            SKILL_PILLS (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={
                              Array.isArray(card.skills)
                                ? card.skills.join(", ")
                                : card.skills || ""
                            }
                            onChange={(e) =>
                              handleUpdateFocusArea(idx, "skills", e.target.value)
                            }
                            placeholder="Java 21, JVM Internals, Multithreading, OOP Patterns"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 3. Bottom Telemetry Strip */}
                  <div className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] space-y-4">
                    <h4 className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      Bottom Telemetry Strip (6 Items)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(nowForm.telemetry || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[var(--paper-3)]/60 border border-[var(--line)] space-y-2"
                        >
                          <div>
                            <label className="block text-[10px] font-mono text-[var(--muted)] mb-0.5">
                              LABEL (Key)
                            </label>
                            <input
                              type="text"
                              value={item.k || ""}
                              onChange={(e) =>
                                handleUpdateTelemetry(idx, "k", e.target.value)
                              }
                              className="w-full px-2 py-1 text-xs rounded bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-[var(--muted)] mb-0.5">
                              VALUE
                            </label>
                            <input
                              type="text"
                              value={item.v || ""}
                              onChange={(e) =>
                                handleUpdateTelemetry(idx, "v", e.target.value)
                              }
                              className="w-full px-2 py-1 text-xs rounded bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                            />
                          </div>

                          <label className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(item.accent)}
                              onChange={(e) =>
                                handleUpdateTelemetry(idx, "accent", e.target.checked)
                              }
                              className="accent-orange-500 rounded"
                            />
                            <span>Highlight Accent</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Availability & Role Info */}
                  <div className="p-4 rounded-xl bg-[var(--paper-2)]/60 border border-[var(--line)] space-y-4">
                    <h4 className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      Developer Availability &amp; Status
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          ROLE_STATUS
                        </label>
                        <input
                          type="text"
                          value={nowForm.role_status || ""}
                          onChange={(e) =>
                            setNowForm((prev) => ({ ...prev, role_status: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          LOCATION
                        </label>
                        <input
                          type="text"
                          value={nowForm.location || ""}
                          onChange={(e) =>
                            setNowForm((prev) => ({ ...prev, location: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-[var(--muted)] mb-1">
                          PERSONAL_MOTTO
                        </label>
                        <input
                          type="text"
                          value={nowForm.personal_motto || ""}
                          onChange={(e) =>
                            setNowForm((prev) => ({ ...prev, personal_motto: e.target.value }))
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink)] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[var(--line)]">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-orange-500/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Now Section</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ====================================================== */}
              {/* TAB 8: RESUME & STORAGE                                */}
              {/* ====================================================== */}
              {activeTab === "assets" && (
                <div className="space-y-6">
                  <p className="text-xs font-mono text-[var(--muted)]">
                    Upload new files directly to your public Supabase Storage bucket (<code>portfolio-assets</code>).
                  </p>

                  <div className="p-6 rounded-xl border border-dashed border-[var(--line)] bg-[var(--paper-2)]/40 text-center">
                    <label className="inline-flex flex-col items-center gap-2 cursor-pointer">
                      <div className="p-3 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        {uploadingAsset ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6" />
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold text-[var(--ink)]">
                        Click to upload Resume.pdf or project screenshots
                      </span>
                      <span className="font-mono text-[11px] text-[var(--muted)]">
                        Files are automatically stored in the public CDN
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleGenericAssetUpload}
                      />
                    </label>
                  </div>

                  {uploadedAssetUrl && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                      <div className="text-xs font-mono font-bold mb-1">
                        FILE UPLOADED SUCCESSFULLY:
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={uploadedAssetUrl}
                          className="flex-1 px-2.5 py-1.5 text-xs rounded bg-[var(--paper)] text-[var(--ink)] font-mono border border-[var(--line)]"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(uploadedAssetUrl);
                            showNotification("info", "URL copied to clipboard!");
                          }}
                          className="px-3 py-1.5 text-xs font-mono rounded bg-emerald-600 text-white cursor-pointer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
