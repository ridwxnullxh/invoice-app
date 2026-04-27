import { useTheme } from "../context/ThemeContext.jsx";
import logo from "/icons.png";

const Sun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const Moon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

export default function Layout({ children }) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-[#F8F8FB] dark:bg-[#141625] text-gray-900 dark:text-white flex flex-col md:flex-row">
      {/* ── Desktop Sidebar (md+) ── */}
      <aside
        aria-label="Application sidebar"
        className="hidden md:flex w-[103px] bg-[#1E2139] flex-col items-center py-0 gap-0 fixed left-0 top-0 h-screen z-30 rounded-r-[20px] overflow-hidden"
      >
        {/* Logo */}
        <div className="w-full aspect-square bg-[#7C5DFA] rounded-r-[20px] flex items-center justify-center relative overflow-hidden flex-shrink-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#9277FF] rounded-tl-[20px]" />
          <img
            src={logo}
            alt="Logo"
            className="relative z-10 w-8 h-8 object-contain"
          />
        </div>

        <div className="flex-1" />

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-10 h-10 mb-6 rounded-full hover:opacity-80 transition flex items-center justify-center text-xl text-[#858BB2] hover:text-white"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>

        {/* Divider */}
        <div className="w-full h-px bg-[#494E6E] mb-6" />

        {/* Avatar */}
        <button
          aria-label="User profile"
          className="w-10 h-10 mb-8 rounded-full bg-[#7C5DFA] overflow-hidden border-2 border-transparent hover:border-white transition flex items-center justify-center text-white font-bold"
        >
          U
        </button>
      </aside>

      {/* ── Mobile Header (< md) ── */}
      <header className="md:hidden flex items-center justify-between bg-[#1E2139] h-[72px] px-0 sticky top-0 z-30">
        {/* Logo block */}
        <div className="w-[72px] h-[72px] bg-[#7C5DFA] rounded-r-[15px] flex items-center justify-center relative overflow-hidden flex-shrink-0">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#9277FF] rounded-tl-[15px]" />
          <img
            src={logo}
            alt="Logo"
            className="relative z-10 w-8 h-8 object-contain"
          />
        </div>

        <div className="flex items-center gap-4 pr-4">
          <button
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className="text-[#858BB2] hover:text-white transition text-xl"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <div className="w-px h-8 bg-[#494E6E]" />
          <button
            aria-label="User profile"
            className="w-8 h-8 rounded-full bg-[#7C5DFA] flex items-center justify-center text-white font-bold text-sm border-2 border-transparent hover:border-white transition"
          >
            U
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-[103px] min-h-screen">{children}</main>
    </div>
  );
}
