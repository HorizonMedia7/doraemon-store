import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage full-page view synchronized with browser URL history.
 * Supports /product/:slug, ?product=:slug, and #product/:slug
 */
export function useProductRouting(products = []) {
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Extract product ID from current browser location
  const getProductIdFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return null;

    // 1. Check path: /product/some-slug
    const pathMatch = window.location.pathname.match(/^\/product\/([^/?#]+)/);
    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }

    // 2. Check query params: ?product=some-slug
    const urlParams = new URLSearchParams(window.location.search);
    const queryProduct = urlParams.get('product');
    if (queryProduct) {
      return queryProduct;
    }

    // 3. Check hash: #product/some-slug
    const hashMatch = window.location.hash.match(/^#product\/([^/?#]+)/);
    if (hashMatch && hashMatch[1]) {
      return hashMatch[1];
    }

    return null;
  }, []);

  // Initialize and handle popstate (back/forward browser buttons)
  useEffect(() => {
    const handleUrlChange = () => {
      const slug = getProductIdFromUrl();
      if (slug) {
        const found = products.find((p) => p.id === slug);
        if (found) {
          setSelectedProductId(found.id);
          window.scrollTo({ top: 0, behavior: 'instant' });
          return;
        }
      }
      setSelectedProductId(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    // Run on initial load
    handleUrlChange();

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [getProductIdFromUrl, products]);

  // Open product page & update URL
  const openProduct = useCallback((product) => {
    if (!product) return;
    setSelectedProductId(product.id);
    const newPath = `/product/${product.id}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ productId: product.id }, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Return to all products & restore URL
  const closeProduct = useCallback(() => {
    setSelectedProductId(null);
    if (window.location.pathname.startsWith('/product/')) {
      window.history.pushState(null, '', '/');
    } else if (window.location.search.includes('product=')) {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;

  return {
    selectedProduct,
    selectedProductId,
    openProduct,
    closeProduct
  };
}
