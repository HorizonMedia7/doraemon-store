import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const scrollToGrid = () => {
    const el = document.getElementById('gadgets-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-5 pb-6 sm:pt-10 sm:pb-10 border-b border-slate-200/60 dark:border-white/5">
      {/* Subtle Ambient Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-gradient-to-tr from-brand-200/30 via-pink-200/25 to-sky-200/25 dark:from-brand-600/15 dark:via-purple-500/10 dark:to-electric-pink/10 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Top Pill Tag */}
          <motion.div variants={itemVariants} className="mb-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-500/30 bg-white/80 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
              <span>Cataloged from Instagram Reels</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
            </div>
          </motion.div>

          {/* Straightforward Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Viral Gadgets You Saw on Reels,{' '}
            <span className="gradient-text-electric">In One Place</span>
          </motion.h1>

          {/* Mobile-Friendly CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-4 sm:mt-5 flex flex-row items-center justify-center gap-2.5 w-full sm:w-auto"
          >
            <motion.a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.96 }}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <InstagramIcon className="w-4 h-4 flex-shrink-0" />
              <span>Follow on Instagram</span>
            </motion.a>

            <motion.button
              onClick={scrollToGrid}
              whileTap={{ scale: 0.96 }}
              className="flex-1 sm:flex-initial min-h-[44px] px-4 sm:px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Browse All</span>
              <ArrowDown className="w-3.5 h-3.5 text-brand-500" />
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
