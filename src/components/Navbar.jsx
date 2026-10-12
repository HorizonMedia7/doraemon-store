import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Minimal Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Sticky Minimal Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#090a0f]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
            aria-label="Doraemon Gadgets Homepage"
          >
            <img
              src="/logo.jpg"
              alt="Doraemon Gadgets"
              className="w-8 h-8 rounded-full object-cover shadow-xs border border-slate-200/80 dark:border-white/10 group-hover:scale-105 transition-transform"
            />
            
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              Doraemon <span className="text-sky-600 dark:text-sky-400">Gadgets</span>
            </span>
          </a>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Instagram Follow Pill */}
            <motion.a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors shadow-xs min-h-[34px]"
              aria-label="Follow Doraemon Gadgets on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">@doraemon_gadgets7</span>
              <span className="sm:hidden">Follow</span>
            </motion.a>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
