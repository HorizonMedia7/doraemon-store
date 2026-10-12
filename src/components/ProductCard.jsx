import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { isProductNew, getLowestPrice } from '../utils/productHelpers';

export default function ProductCard({ product, onSelect, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isNew = isProductNew(product.dateAdded);
  const lowestPrice = getLowestPrice(product);
  const primaryImage = product.images?.[0] || '/products/placeholder.jpg';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(product);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
      className="group relative flex flex-col justify-between rounded-3xl glass-panel p-4 cursor-pointer overflow-hidden transition-all duration-300 hover:border-brand-500/50 hover:shadow-glow-violet focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {/* Glow Hover Ambient */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-brand-500/0 via-brand-500/10 to-electric-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Image Container with Skeleton Loader */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 mb-4 select-none">
          {/* Skeleton Pulse */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse" />
          )}

          {/* Product Image */}
          <motion.img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
            {/* Category Chip */}
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md text-brand-300 border border-white/10 shadow-sm">
              {product.category}
            </span>

            {/* NEW Badge if added within last 14 days */}
            {isNew && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30"
              >
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>NEW</span>
              </motion.span>
            )}
          </div>

          {/* Quick Stores Count pill on bottom right of image */}
          {product.links && product.links.length > 0 && (
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-black/75 backdrop-blur-md text-slate-300 border border-white/10">
              {product.links.length} {product.links.length === 1 ? 'Store' : 'Stores'}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          <h2 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-brand-300 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Starting from
          </span>
          <span className="text-sm sm:text-base font-extrabold text-white">
            {lowestPrice || 'Check Stores'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/15 group-hover:bg-brand-500 text-brand-300 group-hover:text-white text-xs font-bold transition-all duration-200">
          <span>View Gadget</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
}
