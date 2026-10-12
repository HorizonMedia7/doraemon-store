import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function FilterBar({
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  sortBy = 'newest',
  onSortChange,
  totalResults = 0
}) {
  return (
    <div className="w-full space-y-4 mb-8">
      {/* Search Input & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search viral gadgets by name, category, or keyword..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl glass-panel text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/70 transition-all min-h-[46px]"
            aria-label="Search gadgets"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative inline-flex items-center">
            <SlidersHorizontal className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-9 pr-8 py-3 rounded-2xl glass-panel text-slate-200 text-xs sm:text-sm font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[46px]"
              aria-label="Sort products by"
            >
              <option value="newest" className="bg-slate-900 text-white">✨ Newest First</option>
              <option value="name" className="bg-slate-900 text-white">🔤 Name (A - Z)</option>
              <option value="price-low" className="bg-slate-900 text-white">🏷️ Price: Low to High</option>
              <option value="price-high" className="bg-slate-900 text-white">💎 Price: High to Low</option>
            </select>
            <span className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</span>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Pills */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-200 min-h-[40px] flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                aria-pressed={isActive}
              >
                {/* Framer Motion Shared Active Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-xl shadow-md shadow-brand-500/25 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {cat === 'All' && <Sparkles className="w-3.5 h-3.5 opacity-70" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count Helper */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="font-semibold text-slate-200">{totalResults}</span> {totalResults === 1 ? 'gadget' : 'gadgets'}
        </span>
        {(searchQuery || activeCategory !== 'All') && (
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('All');
            }}
            className="text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
