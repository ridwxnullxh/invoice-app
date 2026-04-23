// components/Layout.jsx
import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const LogoIcon = () => (
  <div className="relative w-10 h-10 flex items-center justify-center">
    <div className="absolute inset-0 bg-primary rounded-full" />
    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-primary-light rounded-b-full rounded-t-none" style={{ borderRadius: '0 0 20px 20px' }} />
    <svg width="28" height="26" viewBox="0 0 28 26" className="relative z-10" fill="none">
      <path d="M20.773 0L28 12.958 20.773 26H7.227L0 12.958 7.227 0h13.546z" fill="white" fillOpacity="0.3"/>
      <path d="M20.773 0L28 12.958H14.5L20.773 0z" fill="white"/>
    </svg>
  </div>
);

export default function Layout({ children, darkMode, setDarkMode }) {
  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[103px] bg-dark-nav dark:bg-dark-nav z-50 flex flex-col items-center justify-between rounded-r-[20px] overflow-hidden">
        {/* Logo area — purple top half */}
        <div className="w-full">
          <div className="w-full aspect-square bg-primary flex items-center justify-center rounded-r-[20px]">
            <LogoIcon />
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-6 pb-6">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 flex items-center justify-center text-text-body hover:text-white transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Divider */}
          <div className="w-full h-px bg-[#494E6E]" />

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary cursor-pointer">
            <img
              src="https://i.pravatar.cc/40?img=8"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[103px] flex-1 min-h-screen bg-light-bg dark:bg-dark-bg font-spartan transition-colors duration-300">
        {children}
      </main>
    </div>
  );
}
