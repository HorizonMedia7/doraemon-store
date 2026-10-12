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
    <div className="w-full space-y-3 mb-6">
      {/* Search Input & Sort Row */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search gadgets, keywords..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-xs min-h-[44px]"
            aria-label="Search gadgets"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white min-w-[36px] justify-center"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Compact Sort Selector */}
        <div className="relative flex-shrink-0">
          <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-7 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs min-h-[44px]"
            aria-label="Sort products by"
          >
            <option value="newest">✨ Newest</option>
            <option value="name">🔤 Name (A - Z)</option>
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
        </div>
      </div>

      {/* Horizontal Scrollable Category Pills */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 min-h-[38px] flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 border ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-brand-500 dark:bg-brand-600 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 shadow-xs'
                }`}
                aria-pressed={isActive}
              >
                {cat === 'All' && <Sparkles className="w-3 h-3 opacity-80" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Quick Reset */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-0.5">
        <span>
          Showing <strong className="font-semibold text-slate-700 dark:text-slate-200">{totalResults}</strong> {totalResults === 1 ? 'gadget' : 'gadgets'}
        </span>
        {(searchQuery || activeCategory !== 'All') && (
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('All');
            }}
            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
