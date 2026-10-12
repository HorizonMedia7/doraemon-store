import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#06070a] pt-8 pb-12 text-slate-500 dark:text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top Footer Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Doraemon Gadgets"
              className="w-7 h-7 rounded-full object-cover border border-slate-200/80 dark:border-white/10"
            />
            <div>
              <span className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Doraemon <span className="text-sky-600 dark:text-sky-400">Gadgets</span>
              </span>
              <p className="text-[11px] text-slate-400">
                Curated viral gadgets featured on Instagram Reels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-pink-600 dark:hover:text-pink-400 transition-colors shadow-xs"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>@doraemon_gadgets7</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors shadow-xs"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Affiliate Disclosure Box */}
        <div className="p-3 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-300 font-semibold mr-1">Affiliate Disclosure:</strong>
          As an affiliate, I may earn a commission from qualifying purchases at no extra cost to you. Product prices and deals are determined by the respective stores (Amazon, Flipkart, Meesho, etc.).
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500 pt-1">
          <p>© {new Date().getFullYear()} Doraemon Gadgets.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for gadget fans</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
