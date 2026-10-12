import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, Film, ArrowUpRight } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function AboutSection() {
  return (
    <section className="relative py-10 sm:py-16 border-t border-slate-200/80 dark:border-white/10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-white/10 p-5 sm:p-8 shadow-xs relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left Column: Creator message */}
            <div className="md:col-span-7 space-y-3.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>The Story</span>
              </div>

              <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight">
                Why I built <span className="gradient-text-electric">Doraemon Gadgets</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Whenever I posted a reel featuring a futuristic lamp, a pocket tool, or a viral life-hack gadget, my Instagram DMs would overflow with <em className="text-slate-900 dark:text-white font-medium">"Where is the link?"</em>
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Links get lost or buried in Instagram comments. I created this clean catalog so every gadget seen on my page has a permanent place with direct links and verified deals across Amazon, Flipkart, Meesho, and more.
              </p>

              <div className="pt-1">
                <motion.a
                  href="https://www.instagram.com/doraemon_gadgets7"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-xs"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Follow @doraemon_gadgets7</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.a>
              </div>
            </div>

            {/* Right Column: Instagram Teaser Card */}
            <div className="md:col-span-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/10 space-y-3.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#090a0f] flex items-center justify-center">
                      <Film className="w-5 h-5 text-pink-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                      @doraemon_gadgets7
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Instagram Reels Creator & Gadget Reviews
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-slate-200/80 dark:border-white/10 text-xs">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Daily</div>
                    <div className="text-[10px] text-slate-500">Reels</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">100%</div>
                    <div className="text-[10px] text-slate-500">Tested</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Direct</div>
                    <div className="text-[10px] text-slate-500">Links</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <HeartHandshake className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Zero sponsored junk. Only gadgets I genuinely like.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
