import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { useAffiliateTracker } from '../hooks/useAffiliateTracker';

// Authentic brand configurations with official brand logos, colors, and badges
const STORE_CONFIGS = {
  amazon: {
    name: 'Amazon',
    bgClass: 'bg-[#131921] hover:bg-[#1a222d] text-white border-amber-500/40 hover:border-amber-400',
    accentColor: '#FF9900',
    badgeClass: 'bg-amber-400 text-slate-950 font-bold hover:bg-amber-300',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#131921] flex items-center justify-center p-1 shadow-xs border border-amber-500/30 flex-shrink-0">
        <svg viewBox="0 0 48 30" className="w-6 h-4" fill="none">
          <path
            d="M16 18c-1.5 0-2.8-.7-3.3-1.8l1.6-1.1c.3.6 1 1 1.7 1 .8 0 1.4-.4 1.4-1.1v-.3c-.5.4-1.2.6-2 .6-2.1 0-3.5-1.4-3.5-3.3 0-2.1 1.6-3.4 3.7-3.4 1 0 1.8.4 2.2.9V8.8h1.9v7.1c0 1.9-1.4 3-3.7 3zm-.2-3.4c1 0 1.8-.7 1.8-1.8 0-1-.8-1.8-1.8-1.8-1 0-1.8.7-1.8 1.8 0 1 .8 1.8 1.8 1.8z"
            fill="#FFFFFF"
          />
          <path d="M6 21c7 4.5 18 4.5 25 0" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
          <path d="M30 18.5l2.5 2.5-3.5 1" fill="#FF9900"/>
        </svg>
      </div>
    )
  },
  flipkart: {
    name: 'Flipkart',
    bgClass: 'bg-[#2874F0] hover:bg-[#1f63d6] text-white border-yellow-400/50 hover:border-yellow-300',
    accentColor: '#FFE500',
    badgeClass: 'bg-yellow-400 text-blue-950 font-bold hover:bg-yellow-300',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#2874F0] flex items-center justify-center p-1 shadow-xs border border-yellow-400/40 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none">
          <path d="M11 13h14l-1.8 15H12.8L11 13z" fill="#FFE11B"/>
          <path d="M15 13V10.5a3 3 0 0 1 6 0V13" stroke="#2874F0" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          <path d="M17 18h3.5m-3.5 3h2.5m-2.5-3.5v7" stroke="#2874F0" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M5.5 16h3m-4 3.5h3.5m-2.5 3.5h2" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
    )
  },
  meesho: {
    name: 'Meesho',
    bgClass: 'bg-[#800048] hover:bg-[#6e003e] text-white border-pink-400/40 hover:border-pink-300',
    accentColor: '#ff66b2',
    badgeClass: 'bg-pink-400 text-slate-950 font-bold hover:bg-pink-300',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#F43397] flex items-center justify-center p-1 shadow-xs border border-white/20 flex-shrink-0">
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
          <path d="M8 22V13.5c0-1.7 1.3-3 3-3s3 1.3 3 3V22m0-8.5c0-1.7 1.3-3 3-3s3 1.3 3 3V22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  },
  myntra: {
    name: 'Myntra',
    bgClass: 'bg-gradient-to-r from-[#ff3f6c] to-[#ff8f00] hover:opacity-95 text-white border-pink-300/40',
    accentColor: '#ffffff',
    badgeClass: 'bg-white text-slate-900 font-bold hover:bg-slate-100',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 shadow-xs border border-white/30 flex-shrink-0">
        <svg viewBox="0 0 36 28" className="w-6 h-5" fill="none">
          <path d="M3 24L11 4C11.8 2.4 14.2 2.4 15 4L20 14L15 24H3Z" fill="#F13AB1" />
          <path d="M12 24L18 12L24 24H12Z" fill="#F26A10" />
          <path d="M33 24L25 4C24.2 2.4 21.8 2.4 21 4L16 14L21 24H33Z" fill="#FFC107" />
          <path d="M18 12L13 22H7L15 6C15.8 4.4 18.2 4.4 19 6L23 14L18 12Z" fill="#FF3F6C" />
        </svg>
      </div>
    )
  },
  'tata cliq': {
    name: 'Tata CLiQ',
    bgClass: 'bg-[#bd081c] hover:bg-[#a60718] text-white border-red-300/40',
    accentColor: '#ffffff',
    badgeClass: 'bg-white text-slate-900 font-bold hover:bg-slate-100',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#bd081c] flex items-center justify-center p-1 shadow-xs border border-white/30 flex-shrink-0">
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
          <circle cx="15" cy="14" r="7" stroke="#FFFFFF" strokeWidth="2.6" fill="none" />
          <path d="M20 19l4.5 4.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  ajio: {
    name: 'Ajio',
    bgClass: 'bg-[#1e293b] hover:bg-[#15202e] text-white border-cyan-400/40',
    accentColor: '#38bdf8',
    badgeClass: 'bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center p-1 shadow-xs border border-cyan-400/30 flex-shrink-0">
        <span className="font-black text-white text-[10px] tracking-wider font-mono">AJIO</span>
      </div>
    )
  },
  croma: {
    name: 'Croma',
    bgClass: 'bg-[#121212] hover:bg-[#1a1a1a] text-white border-emerald-400/40',
    accentColor: '#00E9BF',
    badgeClass: 'bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-[#18181b] flex items-center justify-center p-1 shadow-xs border border-emerald-400/30 flex-shrink-0">
        <span className="font-black text-white text-[10px] tracking-tight">cr<span className="text-[#00E9BF]">o</span>ma</span>
      </div>
    )
  }
};

export default function StoreButton({ link, productName, productId }) {
  const { trackClick } = useAffiliateTracker();
  if (!link || !link.url) return null;

  const rawStoreName = (link.store || 'Store').trim();
  const lowerStore = rawStoreName.toLowerCase();
  
  // Lookup store config or fallback to clean neutral theme
  const config = STORE_CONFIGS[lowerStore] || {
    name: rawStoreName,
    bgClass: 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700',
    accentColor: '#38bdf8',
    badgeClass: 'bg-white/20 text-white font-bold',
    icon: (
      <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center p-1 shadow-xs text-sky-400 flex-shrink-0">
        <ShoppingBag className="w-4 h-4" />
      </div>
    )
  };

  const handleClick = () => {
    trackClick({
      store: config.name,
      productName,
      productId,
      url: link.url,
      price: link.price
    });
  };

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border shadow-sm transition-all duration-150 min-h-[50px] ${config.bgClass}`}
      aria-label={`Buy ${productName} on ${config.name}${link.price ? ` for ${link.price}` : ''}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {config.icon}
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold leading-tight">
            Available on
          </span>
          <span className="text-sm sm:text-base font-bold tracking-tight truncate leading-tight text-white">
            {config.name}
          </span>
        </div>
      </div>

      {/* Price tag & Buy CTA */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {link.price && (
          <span className="px-2.5 py-1 text-xs sm:text-sm font-extrabold rounded-lg bg-black/30 text-white border border-white/20 shadow-xs">
            {link.price}
          </span>
        )}
        <span className={`px-3 py-1.5 text-xs rounded-lg shadow-xs flex items-center gap-1 transition-colors ${config.badgeClass}`}>
          <span>Buy Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.a>
  );
}
