import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Frown, RefreshCw } from 'lucide-react';
import productsData from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Footer from './components/Footer';
import { getAllCategories, parsePrice } from './utils/productHelpers';
import { useProductRouting } from './hooks/useProductRouting';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Deep-linking URL routing for modal
  const { selectedProduct, openProduct, closeProduct } = useProductRouting(productsData);

  // Auto-generate categories from products data
  const categories = useMemo(() => {
    return getAllCategories(productsData);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(
        (p) => p.category && p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const tagMatch = p.tagline?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const highlightsMatch = p.highlights?.some((h) => h.toLowerCase().includes(q));
        return nameMatch || tagMatch || descMatch || catMatch || highlightsMatch;
      });
    }

    // Sort products
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = new Date(a.dateAdded || '2000-01-01').getTime();
        const dateB = new Date(b.dateAdded || '2000-01-01').getTime();
        return dateB - dateA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price-low' || sortBy === 'price-high') {
        const minPriceA = a.links?.reduce((min, l) => Math.min(min, parsePrice(l.price)), Infinity) || 0;
        const minPriceB = b.links?.reduce((min, l) => Math.min(min, parsePrice(l.price)), Infinity) || 0;
        return sortBy === 'price-low' ? minPriceA - minPriceB : minPriceB - minPriceA;
      }
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090a0f] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Minimal Sticky Navbar */}
      <Navbar />

      {/* Minimal Hero with Brand Logo */}
      <Hero />

      {/* Main Showcase / Product Grid Section */}
      <main id="gadgets-section" className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full">
        
        {/* Search, Filter Pills & Sort Controls */}
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredProducts.length}
        />

        {/* Product Cards Grid with Fast Smooth Layout */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onSelect={openProduct}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty Search / Filter State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-slate-50 dark:bg-[#11131a] border border-slate-200/80 dark:border-white/10 p-8 sm:p-12 text-center max-w-md mx-auto my-8 space-y-3 shadow-xs"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-slate-400">
              <Frown className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              No gadgets found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No gadgets match &quot;{searchQuery || activeCategory}&quot;. Try different keywords or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          </motion.div>
        )}

      </main>

      {/* Minimal Footer with Mandatory Affiliate Disclosure */}
      <Footer />

      {/* Shared-Element / Bottom Sheet Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={closeProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
