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
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-electric-blue via-brand-500 to-electric-pink z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl py-1 px-1.5"
            aria-label="Doraemon Gadgets Homepage"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-electric-pink p-0.5 shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-200">
              <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse-subtle" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight leading-tight text-white group-hover:text-brand-300 transition-colors">
                Doraemon <span className="gradient-text-electric">Gadgets</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wider uppercase">
                Reels Showcase
              </span>
            </div>
          </a>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Explore Link */}
            <button
              onClick={scrollToGadgets}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Compass className="w-4 h-4 text-brand-400" />
              <span>Explore All</span>
            </button>

            {/* Instagram Follow Pill */}
            <motion.a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-md hover:shadow-pink-500/25 transition-all min-h-[40px]"
              aria-label="Follow Doraemon Gadgets on Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="hidden xs:inline">@doraemon_gadgets7</span>
              <span className="xs:hidden">Follow</span>
            </motion.a>

            {/* Dark / Light Mode Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 transition-transform -rotate-12 hover:rotate-0" />
              )}
            </motion.button>
          </div>

        </div>
      </header>
    </>
  );
}
