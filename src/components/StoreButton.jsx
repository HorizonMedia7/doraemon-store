import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { useAffiliateTracker } from '../hooks/useAffiliateTracker';
import { formatPrice } from '../utils/productHelpers';

// Authentic brand configurations with user-uploaded official logos & website theme colors
const STORE_CONFIGS = {
  amazon: {
    name: 'Amazon',
    bgClass: 'bg-[#131921] hover:bg-[#1a232f] text-white border-amber-500/40 hover:border-amber-400',
    accentColor: '#FF9900',
    badgeClass: 'bg-[#FF9900] hover:bg-[#ff8f00] text-slate-950 font-extrabold shadow-sm',
    priceClass: 'bg-black/40 text-amber-300 border border-amber-500/30',
    icon: (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-sm border border-slate-200/80 flex-shrink-0">
        <img
          src="/stores/amazon.jpg"
          alt="Amazon"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    )
  },
  flipkart: {
    name: 'Flipkart',
    bgClass: 'bg-[#2874F0] hover:bg-[#1f63d6] text-white border-yellow-300/50 hover:border-yellow-200',
    accentColor: '#FFE500',
    badgeClass: 'bg-[#FFE500] hover:bg-[#ffdf00] text-[#1e3a8a] font-extrabold shadow-sm',
    priceClass: 'bg-black/25 text-yellow-300 border border-yellow-300/30',
    icon: (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FFE500] flex items-center justify-center p-0.5 shadow-sm border border-yellow-400/50 flex-shrink-0">
        <img
          src="/stores/flipkart.jpg"
          alt="Flipkart"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  },
  meesho: {
    name: 'Meesho',
    bgClass: 'bg-[#540947] hover:bg-[#430739] text-white border-pink-400/40 hover:border-pink-300',
    accentColor: '#F43397',
    badgeClass: 'bg-[#F43397] hover:bg-[#e02685] text-white font-extrabold shadow-sm',
    priceClass: 'bg-black/30 text-pink-200 border border-pink-300/30',
    icon: (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#540947] flex items-center justify-center p-0.5 shadow-sm border border-pink-400/30 flex-shrink-0">
        <img
          src="/stores/meesho.jpg"
          alt="Meesho"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  },
  myntra: {
    name: 'Myntra',
    bgClass: 'bg-gradient-to-r from-[#ff3f6c] via-[#ff5860] to-[#ff8f00] hover:opacity-95 text-white border-pink-300/40',
    accentColor: '#ffffff',
    badgeClass: 'bg-white hover:bg-slate-100 text-[#ff3f6c] font-extrabold shadow-sm',
    priceClass: 'bg-black/30 text-white border border-white/25',
    icon: (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 shadow-sm border border-slate-200 flex-shrink-0">
        <img
          src="/stores/myntra.jpg"
          alt="Myntra"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    )
  },
  ajio: {
    name: 'Ajio',
    bgClass: 'bg-[#202b3c] hover:bg-[#18212e] text-white border-slate-500/40 hover:border-slate-400',
    accentColor: '#ffffff',
    badgeClass: 'bg-white hover:bg-slate-100 text-[#202b3c] font-extrabold shadow-sm',
    priceClass: 'bg-black/35 text-slate-100 border border-slate-400/30',
    icon: (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#202b3c] flex items-center justify-center p-0.5 shadow-sm border border-slate-600/40 flex-shrink-0">
        <img
          src="/stores/ajio.jpg"
          alt="Ajio"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  },
  'tata cliq': {
    name: 'Tata CLiQ',
    bgClass: 'bg-[#bd081c] hover:bg-[#a60718] text-white border-red-300/40',
    accentColor: '#ffffff',
    badgeClass: 'bg-white text-slate-900 font-extrabold hover:bg-slate-100',
    priceClass: 'bg-black/30 text-white border border-white/20',
    icon: (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#bd081c] flex items-center justify-center p-1 shadow-sm border border-white/30 flex-shrink-0">
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
          <circle cx="15" cy="14" r="7" stroke="#FFFFFF" strokeWidth="2.6" fill="none" />
          <path d="M20 19l4.5 4.5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  croma: {
    name: 'Croma',
    bgClass: 'bg-[#121212] hover:bg-[#1a1a1a] text-white border-emerald-400/40',
    accentColor: '#00E9BF',
    badgeClass: 'bg-[#00E9BF] hover:bg-[#00cfaa] text-slate-950 font-extrabold shadow-sm',
    priceClass: 'bg-black/40 text-emerald-300 border border-emerald-500/30',
    icon: (
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#18181b] flex items-center justify-center p-1 shadow-sm border border-emerald-400/30 flex-shrink-0">
        <span className="font-black text-white text-[11px] tracking-tight">cr<span className="text-[#00E9BF]">o</span>ma</span>
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
    priceClass: 'bg-black/30 text-white border border-white/20',
    icon: (
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-1 shadow-xs text-zinc-300 flex-shrink-0">
        <ShoppingBag className="w-5 h-5" />
      </div>
    )
  };

  const handleClick = () => {
    trackClick({
      store: config.name,
      productName,
      productId,
      url: link.url,
      price: formatPrice(link.price)
    });
  };

  const formattedPrice = formatPrice(link.price);

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl border shadow-sm transition-all duration-150 min-h-[56px] ${config.bgClass}`}
      aria-label={`Buy ${productName} on ${config.name}${formattedPrice ? ` for ${formattedPrice}` : ''}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {config.icon}
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider text-white/75 font-semibold leading-tight">
            Available on
          </span>
          <span className="text-sm sm:text-base font-bold tracking-tight truncate leading-tight text-white">
            {config.name}
          </span>
        </div>
      </div>

      {/* Price tag & Buy CTA */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {formattedPrice && (
          <span className={`px-2.5 py-1 text-xs sm:text-sm font-extrabold rounded-lg shadow-xs ${config.priceClass || 'bg-black/30 text-white border border-white/20'}`}>
            {formattedPrice}
          </span>
        )}
        <span className={`px-3 py-1.5 text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors ${config.badgeClass}`}>
          <span>Buy Now</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.a>
  );
}
