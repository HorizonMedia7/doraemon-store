import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const scrollToGrid = () => {
    const el = document.getElementById('gadgets-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-8 sm:pt-12 sm:pb-14 border-b border-slate-200/60 dark:border-white/5">
      {/* Subtle Light/Dark Gradient Ambient */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-brand-200/40 via-pink-200/30 to-sky-200/30 dark:from-brand-600/20 dark:via-purple-500/15 dark:to-electric-pink/15 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Top Pill Tag */}
          <motion.div variants={itemVariants} className="mb-3">
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

          {/* Short, Direct Tagline */}
          <motion.p
            variants={itemVariants}
            className="mt-2.5 text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
          >
            No more DMing for links! Every viral and genuinely useful gadget featured on{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">@doraemon_gadgets7</strong> with direct store links and verified deals.
          </motion.p>

          {/* Mobile-Friendly CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-4 sm:mt-6 flex flex-row items-center justify-center gap-2.5 w-full sm:w-auto"
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

          {/* Quick Trust Highlights (Compact Strip) */}
          <motion.div
            variants={itemVariants}
            className="mt-5 sm:mt-7 flex items-center justify-center flex-wrap gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium"
          >
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Tested on camera</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>Direct store links</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
              <span>Updated daily</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
