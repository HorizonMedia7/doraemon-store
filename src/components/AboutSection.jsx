import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HeartHandshake, Film, ArrowUpRight } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function AboutSection() {
  return (
    <section className="relative py-16 sm:py-24 border-t border-white/10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Creator message */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>The Story Behind The Pocket</span>
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                Why I built <span className="gradient-text-electric">Doraemon Gadgets</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Whenever I posted a reel featuring a futuristic lamp, a pocket gadget, or a viral life-hack tool, my Instagram DMs would blow up with questions: <em className="text-white font-medium">"Link please?"</em> or <em className="text-white font-medium">"Where did you buy this?"</em>
              </p>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Instagram direct messages are chaotic, and links expire or get buried in comment sections. I created this catalog so every gadget seen in my reels has a permanent home with tested, working links and genuine price comparisons across Amazon, Flipkart, Meesho, and more.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <motion.a
                  href="https://www.instagram.com/doraemon_gadgets7"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm shadow-md shadow-pink-600/20"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Join 50k+ Followers on Instagram</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.a>
              </div>
            </div>

            {/* Right Column: Instagram Teaser Card */}
            <div className="md:col-span-5">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-[#090a0f] flex items-center justify-center">
                      <Film className="w-6 h-6 text-pink-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      doraemon_gadgets7
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Instagram Creator & Gadget Reviewer
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-white/10 text-xs">
                  <div>
                    <div className="font-extrabold text-white text-sm">Daily</div>
                    <div className="text-slate-400">Reels</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-sm">100%</div>
                    <div className="text-slate-400">Tested</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-sm">Direct</div>
                    <div className="text-slate-400">Links</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <HeartHandshake className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Independent curation. No shady sponsored junk.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
