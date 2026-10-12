import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { useAffiliateTracker } from '../hooks/useAffiliateTracker';

// Authentic brand configurations with official brand logos, colors, and styling
const STORE_CONFIGS = {
  amazon: {
    name: 'Amazon',
    bgClass: 'bg-[#131921] hover:bg-[#1f2833] text-white border-amber-500/40 hover:border-amber-400',
    accentColor: '#FF9900',
    badgeClass: 'bg-amber-400 text-slate-950 font-bold hover:bg-amber-300',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.92 14.54c-2.45 1.83-6.03 2.8-9.13 2.8-4.32 0-8.21-1.63-11.14-4.38-.23-.22-.03-.52.24-.35 3.16 1.84 7.03 2.94 11.02 2.94 2.75 0 5.85-.75 8.65-2.28.42-.23.77.26.36.52v.75zm1.5-2.07c-.31-.41-.75-1.54-.75-2.2 0-1.42.84-2.26 2.06-2.26 1.25 0 1.95.84 1.95 2.26 0 1.48-.96 2.27-2.11 2.27-.42 0-.85-.04-1.15-.07zm-1.84 3.51c.36.46 1.34 1.05 2.37 1.05 1.57 0 2.87-.97 2.87-3.08v-4.9h-1.63v.83c-.49-.6-1.32-.98-2.23-.98-2.12 0-3.69 1.76-3.69 3.93 0 2.29 1.44 4.09 3.53 4.09.84 0 1.62-.35 2.08-.88v.67c0 1.13-.67 1.72-1.72 1.72-.94 0-1.52-.45-1.75-.92-.09-.2-.29-.31-.5-.27l-1.34.33c-.2.05-.33.24-.28.46z" fill="#FF9900"/>
      </svg>
    )
  },
  flipkart: {
    name: 'Flipkart',
    bgClass: 'bg-[#2874F0] hover:bg-[#1a65dc] text-white border-blue-300/40 hover:border-yellow-300',
    accentColor: '#FFE500',
    badgeClass: 'bg-yellow-400 text-blue-950 font-bold hover:bg-yellow-300',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7.1 5h14.4l-2.1 7.2a2 2 0 0 1-1.9 1.5H8.7l-.4 1.8h11.2v2H7.9a2 2 0 0 1-2-2.3L7.1 5zM5.5 3H2v2h2.4l1.1 5.3-1 2C4.1 13 4 13.5 4 14a3 3 0 0 0 3 3h14v-2H7a1 1 0 0 1-1-1v-.2l.9-1.8h9.8a3 3 0 0 0 2.9-2.2l2.3-7.8A1 1 0 0 0 21 1H5.5v2z" fill="#FFE500" />
      </svg>
    )
  },
  meesho: {
    name: 'Meesho',
    bgClass: 'bg-[#800048] hover:bg-[#6e003e] text-white border-pink-400/40 hover:border-pink-300',
    accentColor: '#ff66b2',
    badgeClass: 'bg-pink-400 text-slate-950 font-bold hover:bg-pink-300',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6h-3.18C15.4 4.84 14.3 4 13 4c-1.3 0-2.4.84-2.82 2H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-0.5c.55 0 1 .45 1 1h-2c0-.55.45-1 1-1zm-1 9.5l-2.5-3 1.4-1.4 1.1 1.3 3.1-3.4 1.4 1.4L12 15z" fill="#ffffff" />
      </svg>
    )
  },
  myntra: {
    name: 'Myntra',
    bgClass: 'bg-gradient-to-r from-[#ff3f6c] to-[#ff8f00] hover:opacity-95 text-white border-pink-300/40',
    accentColor: '#ffffff',
    badgeClass: 'bg-white text-slate-900 font-bold hover:bg-slate-100',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22h5l5-10 5 10h5L12 2z" fill="#ffffff" />
      </svg>
    )
  },
  'tata cliq': {
    name: 'Tata CLiQ',
    bgClass: 'bg-[#bd081c] hover:bg-[#a60718] text-white border-red-300/40',
    accentColor: '#ffffff',
    badgeClass: 'bg-white text-slate-900 font-bold hover:bg-slate-100',
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#ffffff" />
      </svg>
    )
  },
  ajio: {
    name: 'Ajio',
    bgClass: 'bg-[#2c4152] hover:bg-[#233544] text-white border-cyan-400/40',
    accentColor: '#38bdf8',
    badgeClass: 'bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300',
    icon: (
      <ShoppingBag className="w-5 h-5 flex-shrink-0 text-cyan-300" />
    )
  },
  croma: {
    name: 'Croma',
    bgClass: 'bg-[#121212] hover:bg-[#1a1a1a] text-white border-emerald-400/40',
    accentColor: '#00E9BF',
    badgeClass: 'bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300',
    icon: (
      <ShoppingBag className="w-5 h-5 flex-shrink-0 text-emerald-400" />
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
    icon: <ShoppingBag className="w-5 h-5 flex-shrink-0 text-sky-400" />
  };

  const handleClick = () => {
    trackClick({
      store: config.name,
      productName,
      productId,
      url: link.url
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
      className={`group relative flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border shadow-sm transition-all duration-150 min-h-[50px] ${config.bgClass}`}
      aria-label={`Check price and buy ${productName} on ${config.name}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-1.5 rounded-lg bg-black/25 flex-shrink-0 group-hover:scale-105 transition-transform">
          {config.icon}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold leading-tight">
            Available on
          </span>
          <span className="text-sm sm:text-base font-bold tracking-tight truncate leading-tight text-white">
            {config.name}
          </span>
        </div>
      </div>

      {/* High-converting 'Check Deal' button that encourages opening the link */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`px-3 py-1.5 text-xs rounded-lg shadow-xs flex items-center gap-1 transition-colors ${config.badgeClass}`}>
          <span>Check Deal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.a>
  );
}
