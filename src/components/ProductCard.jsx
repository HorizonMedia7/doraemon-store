import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25) }}
      onClick={() => onSelect(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View store links for ${product.name}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#11131a] border border-slate-200/80 dark:border-white/10 p-3 sm:p-3.5 cursor-pointer overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-2.5 select-none">
          {/* Skeleton Pulse */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-pulse" />
          )}

          {/* Image */}
          <motion.img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
            {/* Category Pill */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/95 dark:bg-slate-950/85 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/10 shadow-xs">
              {product.category}
            </span>

            {/* NEW Badge */}
            {isNew && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                <span>NEW</span>
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
        {lowestPrice ? (
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
              Starts from
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {lowestPrice}
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {product.links?.length} {product.links?.length === 1 ? 'store link' : 'stores'}
          </span>
        )}

        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 group-hover:bg-sky-600 dark:bg-white dark:group-hover:bg-sky-400 text-white dark:text-slate-900 text-xs font-bold transition-colors">
          <span>View Deals</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
}
