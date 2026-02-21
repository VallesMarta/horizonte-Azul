"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-3 w-10 h-10" />;

  const toggleTheme = () => {
    const nuevoTema = theme === "dark" ? "light" : "dark";    
    setTheme(nuevoTema);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white/20 hover:bg-white/40 transition-all border border-white/20 flex items-center justify-center text-white cursor-pointer relative z-[150]"
      style={{ minWidth: '40px', minHeight: '40px' }} 
    >
      {theme === "dark" ? (
        <FaSun className="text-yellow-400" size={18} />
      ) : (
        <FaMoon className="text-blue-200" size={18} />
      )}
    </button>
  );
}