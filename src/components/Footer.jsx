import React from 'react';
import { Sparkles, Heart, ArrowUp } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-[#06070a] pt-8 pb-12 sm:pt-12 sm:pb-16 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top Footer Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-electric-pink p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-amber-300" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                Doraemon <span className="gradient-text-electric">Gadgets</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Curated viral gadgets featured on Instagram Reels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-white text-xs font-semibold hover:border-pink-500/40 hover:text-pink-600 transition-colors shadow-xs"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>@doraemon_gadgets7</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors shadow-xs"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Affiliate Disclosure Box - Required Feature */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-1.5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Affiliate Disclosure
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            As an affiliate, I may earn a commission from qualifying purchases at no extra cost to you. Product prices, discounts, and availability are set by the respective stores (Amazon, Flipkart, Meesho, Myntra, etc.). Always verify details on the checkout page.
          </p>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200/60 dark:border-white/5">
          <p>© {new Date().getFullYear()} Doraemon Gadgets. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for reel gadget lovers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
