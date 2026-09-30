import { useState, useEffect } from "react";
import { PERSONAL_INFO } from "../data/portfolioData";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes client cache

/**
 * useGitHubData Hook
 * Dynamically fetches live GitHub profile stats, language distributions,
 * and the actual contribution history from public APIs.
 * 
 * Performance Optimized:
 * - Persistent localStorage caching with 30-minute TTL to eliminate cold-start delay
 *   and avoid GitHub unauthenticated rate limits (403).
 * - AbortController to cancel pending HTTP fetches on unmount.
 */
export function useGitHubData(username = PERSONAL_INFO.githubUsername || "SidharthSinghShrinet") {
  const cacheKey = `gh_cache_${username}`;

  // Helper to load valid cached snapshot
  const getCachedData = () => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(cacheKey);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        return parsed;
      }
    } catch {
      // ignore cache read errors
    }
    return null;
  };

  const initialCache = getCachedData();

  const [loading, setLoading] = useState(!initialCache);
  const [isLive, setIsLive] = useState(!!initialCache);

  const [profile, setProfile] = useState(
    initialCache?.profile || {
      login: username,
      name: PERSONAL_INFO.name,
      avatarUrl: PERSONAL_INFO.profileImg,
      publicRepos: 52,
      followers: 1,
      following: 4,
      hireable: true,
      createdAt: "May 2023",
    }
  );

  const [stats, setStats] = useState(
    initialCache?.stats || {
      totalContributions: 239,
      streak: 12,
      totalForks: 1,
      totalStars: 0,
      topLanguages: [
        { name: "JavaScript", count: 26, percent: 55 },
        { name: "Python", count: 13, percent: 28 },
        { name: "TypeScript", count: 3, percent: 7 },
        { name: "HTML/CSS", count: 5, percent: 10 },
      ],
    }
  );

  const [contributions, setContributions] = useState(initialCache?.contributions || []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchAllGitHubData() {
      // If we already have fresh cached data, skip immediate refetch
      if (initialCache && Date.now() - initialCache.timestamp < 10 * 60 * 1000) {
        setLoading(false);
        return;
      }

      try {
        if (!initialCache) setLoading(true);

        const fetchOptions = { signal: controller.signal };

        // Fetch User Profile, Repositories, and Contributions in parallel
        const [userRes, reposRes, contribRes] = await Promise.allSettled([
          fetch(`https://api.github.com/users/${username}`, fetchOptions),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`, fetchOptions),
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, fetchOptions),
        ]);

        if (!isMounted) return;

        let liveSuccess = false;
        let newProfile = profile;
        let newStats = stats;
        let newContributions = contributions;

        // 1. Process User Profile
        if (userRes.status === "fulfilled" && userRes.value.ok) {
          const userData = await userRes.value.json();
          const createdDate = new Date(userData.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });

          newProfile = {
            login: userData.login || username,
            name: userData.name || PERSONAL_INFO.name,
            avatarUrl: userData.avatar_url || PERSONAL_INFO.profileImg,
            publicRepos: userData.public_repos || 52,
            followers: userData.followers || 0,
            following: userData.following || 0,
            hireable: userData.hireable ?? true,
            createdAt: createdDate,
          };
          setProfile(newProfile);
          liveSuccess = true;
        }

        // 2. Process Repositories for Language breakdown & Stars
        if (reposRes.status === "fulfilled" && reposRes.value.ok) {
          const reposData = await reposRes.value.json();
          if (Array.isArray(reposData)) {
            const langMap = {};
            let stars = 0;
            let forks = 0;
            let totalWithLang = 0;

            reposData.forEach((repo) => {
              stars += repo.stargazers_count || 0;
              forks += repo.forks_count || 0;
              if (repo.language) {
                langMap[repo.language] = (langMap[repo.language] || 0) + 1;
                totalWithLang++;
              }
            });

            const sortedLangs = Object.entries(langMap)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([name, count]) => ({
                name,
                count,
                percent: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
              }));

            newStats = {
              ...newStats,
              totalStars: stars,
              totalForks: forks,
              topLanguages: sortedLangs.length > 0 ? sortedLangs : newStats.topLanguages,
            };
            setStats(newStats);
            liveSuccess = true;
          }
        }

        // 3. Process Real GitHub Contribution Heatmap
        if (contribRes.status === "fulfilled" && contribRes.value.ok) {
          const contribData = await contribRes.value.json();
          if (contribData && contribData.contributions) {
            const days = contribData.contributions;
            newContributions = days;
            setContributions(days);

            const total =
              contribData.total?.lastYear ||
              days.reduce((acc, curr) => acc + (curr.count || 0), 0);

            // Calculate active streak from the tail of contributions
            let currentStreak = 0;
            for (let i = days.length - 1; i >= 0; i--) {
              if (days[i].count > 0) {
                currentStreak++;
              } else if (currentStreak > 0) {
                break;
              }
            }

            newStats = {
              ...newStats,
              totalContributions: total,
              streak: currentStreak || newStats.streak,
            };
            setStats(newStats);
            liveSuccess = true;
          }
        }

        if (liveSuccess) {
          setIsLive(true);
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                timestamp: Date.now(),
                profile: newProfile,
                stats: newStats,
                contributions: newContributions,
              })
            );
          } catch {
            // ignore storage full errors
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setIsLive(!!initialCache);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAllGitHubData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [username]);

  return {
    loading,
    isLive,
    profile,
    stats,
    contributions,
  };
}
