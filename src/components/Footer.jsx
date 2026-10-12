import React from 'react';
import { Sparkles, Heart, ArrowUp } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#06070a] pt-12 pb-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-electric-pink p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white">
                Doraemon <span className="gradient-text-electric">Gadgets</span>
              </span>
              <p className="text-xs text-slate-400">
                Curated viral gadgets featured on Instagram Reels
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-white text-xs font-semibold hover:border-pink-500/40 hover:text-pink-300 transition-colors"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              <span>@doraemon_gadgets7</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Affiliate Disclosure Box - Required Feature */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Affiliate Disclosure & Transparency Notice
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            As an affiliate, I may earn a commission from qualifying purchases at no extra cost to you. Product prices, coupons, and stock availability are subject to change by the respective e-commerce stores (Amazon, Flipkart, Meesho, Myntra, etc.). Always verify details on the store checkout page.
          </p>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-white/5">
          <p>© {new Date().getFullYear()} Doraemon Gadgets. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for gadget fans worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
