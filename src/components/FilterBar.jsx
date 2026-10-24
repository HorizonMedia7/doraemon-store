import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  Grid2X2,
  LayoutList,
  Rows3
} from 'lucide-react';

export default function FilterBar({
  categories = [],
  activeCategory = 'All',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  sortBy = 'newest',
  onSortChange,
  totalResults = 0,
  viewMode = 'grid',
  onViewChange
}) {
  return (
    <div className="w-full space-y-3 mb-5">
      {/* Search Input & Sort Row */}
      <div className="flex items-center gap-2.5">
        {/* Search Bar - Subtle neutral dark tones without blue tint */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search gadgets, keywords..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-zinc-700 shadow-xs min-h-[44px] transition-colors"
            aria-label="Search gadgets"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-zinc-400 dark:hover:text-white min-w-[36px] justify-center cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Compact Sort Selector - Subtle grey tones */}
        <div className="relative flex-shrink-0">
          <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-7 py-2.5 rounded-xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 text-xs font-semibold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-zinc-700 shadow-xs min-h-[44px] transition-colors"
            aria-label="Sort products by"
          >
            <option value="newest" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">✨ Newest</option>
            <option value="name" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100">🔤 Name (A - Z)</option>
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-zinc-500 text-[10px]">▼</span>
        </div>
      </div>

      {/* Horizontal Scrollable Category Pills - Clean white & grey tones */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 min-h-[38px] flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-zinc-600 border cursor-pointer ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-white/[0.08] dark:hover:text-white shadow-xs'
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

      {/* Results Count & View Mode Switcher */}
      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-zinc-400 px-0.5 pt-0.5">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-semibold text-slate-700 dark:text-zinc-200">{totalResults}</strong> {totalResults === 1 ? 'gadget' : 'gadgets'}
          </span>
          {(searchQuery || activeCategory !== 'All') && (
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('All');
              }}
              className="text-slate-800 dark:text-zinc-200 font-semibold hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* View Switcher: Grid / List / Full Card */}
        {onViewChange && (
          <div
            className="flex items-center gap-0.5 bg-slate-100 dark:bg-zinc-900/90 p-1 rounded-xl border border-slate-200/80 dark:border-zinc-800"
            role="group"
            aria-label="Product display layout"
          >
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              title="Compact Grid (2 per row on mobile)"
              aria-label="Compact Grid View"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('list')}
              title="Compact List View"
              aria-label="List View"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>

            <button
              type="button"
              onClick={() => onViewChange('detailed')}
              title="Full Card View (1 per row on mobile)"
              aria-label="Full Card View"
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'detailed'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Rows3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
