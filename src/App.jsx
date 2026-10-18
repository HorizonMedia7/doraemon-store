import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Frown, RefreshCw } from 'lucide-react';
import productsData from './data/products';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import Footer from './components/Footer';
import { getAllCategories } from './utils/productHelpers';
import { useProductRouting } from './hooks/useProductRouting';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('dg_view_mode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('dg_view_mode', mode);
    } catch {
      // Ignore in private browsing
    }
  };

  // Deep-linking URL routing for full page product view
  const { selectedProduct, openProduct, closeProduct } = useProductRouting(productsData);

  // Navigate from recommendations to filtered category on main catalog
  const handleViewCategory = (category) => {
    closeProduct();
    if (category) {
      setActiveCategory(category);
    }
    setSearchQuery('');
    setTimeout(() => {
      const element = document.getElementById('gadgets-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

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
      return 0;
    });

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  // Compute container class based on active view mode
  const gridContainerClass = useMemo(() => {
    if (viewMode === 'list') {
      return 'flex flex-col gap-2.5 sm:gap-3.5';
    }
    if (viewMode === 'detailed') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5';
    }
    // Default 'grid': 2 columns on mobile (efficient, no scroll overload!), 3 on desktop
    return 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5';
  }, [viewMode]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090a0f] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Minimal Sticky Navbar */}
      <Navbar onHome={closeProduct} />

      {selectedProduct ? (
        /* Full Page Dedicated Product View with Similar Recommendations */
        <ProductDetailPage
          product={selectedProduct}
          allProducts={productsData}
          onSelectProduct={openProduct}
          onViewCategory={handleViewCategory}
          onBack={closeProduct}
        />
      ) : (
        /* Main Catalog & Grid View */
        <>
          <main id="gadgets-section" className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 w-full">
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalResults={filteredProducts.length}
              viewMode={viewMode}
              onViewChange={handleViewChange}
            />

            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                className={gridContainerClass}
              >
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      viewMode={viewMode}
                      onSelect={openProduct}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset filters</span>
                </button>
              </motion.div>
            )}
          </main>

          {/* Minimal Footer with Mandatory Affiliate Disclosure on Main Catalog */}
          <Footer />
        </>
      )}
    </div>
  );
}
