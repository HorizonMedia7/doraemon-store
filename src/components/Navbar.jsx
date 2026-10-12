import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sparkles, Sun, Moon, Compass } from 'lucide-react';
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

  const scrollToGadgets = (e) => {
    e.preventDefault();
    const el = document.getElementById('gadgets-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-brand-500 to-pink-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Sticky Glass Navbar - Compact on mobile */}
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#090a0f]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl py-1"
            aria-label="Doraemon Gadgets Homepage"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-pink-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-amber-300" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight leading-tight text-slate-900 dark:text-white">
                Doraemon <span className="gradient-text-electric">Gadgets</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
                Reels Finds
              </span>
            </div>
          </a>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Explore Link - Desktop */}
            <button
              onClick={scrollToGadgets}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-brand-500" />
              <span>Explore</span>
            </button>

            {/* Instagram Follow Pill */}
            <motion.a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-sm hover:opacity-95 transition-opacity min-h-[36px]"
              aria-label="Follow Doraemon Gadgets on Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">@doraemon_gadgets7</span>
              <span className="xs:hidden">Follow</span>
            </motion.a>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
