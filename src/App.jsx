import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Frown, RefreshCw } from 'lucide-react';
import productsData from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AboutSection from './components/AboutSection';
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
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-slate-100 transition-colors duration-300">
      {/* Sticky Glass Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Main Showcase / Product Grid Section */}
      <main id="gadgets-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Section Heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-brand-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Catalog</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Featured In Reels
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Click any gadget for in-depth specs, photo galleries, and verified buy links across top shopping apps.
          </p>
        </div>

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

        {/* Product Cards Grid with Reordering Animation */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-7"
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
            className="rounded-3xl glass-panel p-12 text-center max-w-lg mx-auto my-12 space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
              <Frown className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              No gadgets found
            </h3>
            <p className="text-sm text-slate-400">
              We couldn't find any gadgets matching &quot;{searchQuery || activeCategory}&quot;. Try adjusting your search keywords or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset all filters</span>
            </button>
          </motion.div>
        )}

      </main>

      {/* Creator Story / About Section */}
      <AboutSection />

      {/* Footer with Mandatory Affiliate Disclosure */}
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
