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
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const scrollToGrid = () => {
    const el = document.getElementById('gadgets-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Dynamic Animated Gradient Blobs in the Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] bg-gradient-to-tr from-brand-600/20 via-purple-500/15 to-electric-pink/15 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-electric-blue/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-electric-pink/15 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        
        {/* Subtle dot pattern grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Top Pill Tag */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 backdrop-blur-md text-brand-300 text-xs sm:text-sm font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Curated from Instagram Reels</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </motion.div>

          {/* Bold Animated Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1] max-w-4xl"
          >
            Futuristic Gadgets That Feel Like{' '}
            <span className="gradient-text-electric underline decoration-wavy decoration-brand-500/40 underline-offset-8">
              Pure Magic
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed"
          >
            Stop scouring the comments for buy links. Every viral, mind-blowing, and genuinely useful gadget featured on{' '}
            <span className="text-white font-semibold">@doraemon_gadgets7</span> is cataloged right here with verified discount links.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            {/* Instagram Follow CTA */}
            <motion.a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-3 transition-all duration-200"
            >
              <InstagramIcon className="w-5 h-5 flex-shrink-0" />
              <span>Follow on Instagram</span>
            </motion.a>

            {/* Explore Gadgets Button */}
            <motion.button
              onClick={scrollToGrid}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl glass-panel text-slate-200 hover:text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>Explore Gadgets</span>
              <ArrowDown className="w-4 h-4 text-brand-400 animate-bounce" />
            </motion.button>
          </motion.div>

          {/* Trust Highlights Strip */}
          <motion.div
            variants={itemVariants}
            className="mt-12 sm:mt-16 grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-white/10 w-full max-w-3xl"
          >
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Hands-on Tested</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Direct Store Deals</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>Zero Sponsored Bias</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
