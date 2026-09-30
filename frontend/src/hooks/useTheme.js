import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToggle } from "../redux/globalSlice";

/**
 * Custom hook to manage theme state, DOM attribute synchronization,
 * localStorage persistence, and Redux sync.
 */
export function useTheme() {
  const dispatch = useDispatch();
  const reduxToggle = useSelector((state) => state.global?.toggle);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  const applyTheme = useCallback((currentTheme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", currentTheme);
      if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    dispatch(setToggle(theme === "light"));
  }, [theme, applyTheme, dispatch]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme, isDark: theme === "dark" };
}
