"use client";

import { useEffect, useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("hf:theme-change", callback);
  return () => window.removeEventListener("hf:theme-change", callback);
};
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    const preference = localStorage.getItem("theme");
    const isDark = preference === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    window.dispatchEvent(new Event("hf:theme-change"));
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("hf:theme-change"));
  }

  return <button type="button" onClick={toggle} aria-pressed={dark} className="rounded-lg border border-zinc-400 px-3 py-2 text-sm font-semibold text-white hover:border-rose-400">
    {dark ? "Modo claro" : "Modo oscuro"}
  </button>;
}
