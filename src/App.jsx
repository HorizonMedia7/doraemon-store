import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Frown, RefreshCw } from 'lucide-react';
import initialProductsData from './data/products';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import Footer from './components/Footer';
import AdminPage from './components/admin/AdminPage';
import { getAllCategories } from './utils/productHelpers';
import { useProductRouting } from './hooks/useProductRouting';
import { getProducts } from './services/supabase';

export default function App() {
  const [products, setProducts] = useState(initialProductsData);
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || path === '/admin/' || hash === '#admin' || hash === '#/admin';
  });

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

  // Fetch live products from Supabase (or fallback to local)
  const refreshProducts = useCallback(async () => {
    try {
      const data = await getProducts(false); // false = published only
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.warn('Using initial product data fallback:', err);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Listen to browser history navigation (popstate) for /admin and /product/:id
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const onAdmin = path === '/admin' || path === '/admin/' || hash === '#admin' || hash === '#/admin';
      setIsAdmin(onAdmin);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const handleBackToStore = useCallback(() => {
    window.history.pushState(null, '', '/');
    setIsAdmin(false);
    refreshProducts();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [refreshProducts]);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('dg_view_mode', mode);
    } catch {
      // Ignore in private browsing
    }
  };

  // Deep-linking URL routing for full page product view
  const { selectedProduct, openProduct, closeProduct } = useProductRouting(products);

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
    return getAllCategories(products);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

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
      // Prioritize featured items
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      if (sortBy === 'newest') {
        const dateA = new Date(a.dateAdded || '2000-01-01').getTime();
        const dateB = new Date(b.dateAdded || '2000-01-01').getTime();
        return dateB - dateA;
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

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

  // Render Admin Page if on /admin route
  if (isAdmin) {
    return <AdminPage onBackToStore={handleBackToStore} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090a0f] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Minimal Sticky Navbar */}
      <Navbar onHome={closeProduct} />

      {selectedProduct ? (
        /* Full Page Dedicated Product View with Similar Recommendations */
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
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
