/**
 * Helper utilities for Doraemon Gadget Store
 */

/**
 * Check if a product was added within the last `days` days.
 * Handles both past dates and current time.
 */
export function isProductNew(dateAdded, days = 14) {
  if (!dateAdded) return false;
  const added = new Date(dateAdded).getTime();
  const now = new Date().getTime();
  const diffTime = now - added;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  // Also guard against future dates within reason (e.g. timezone offsets)
  return diffDays >= -1 && diffDays <= days;
}

/**
 * Extract distinct categories from the products array, prepended with 'All'
 */
export function getAllCategories(products = []) {
  const set = new Set();
  products.forEach((p) => {
    if (p.category) {
      set.add(p.category.trim());
    }
  });
  return ['All', ...Array.from(set)];
}

/**
 * Parses numeric price string like "₹1,499" into integer 1499
 */
export function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const clean = String(priceStr).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/**
 * Find lowest price among all store links for a product
 */
export function getLowestPrice(product) {
  if (!product.links || product.links.length === 0) return null;
  const prices = product.links
    .map((l) => ({ raw: l.price, num: parsePrice(l.price) }))
    .filter((p) => p.num > 0);
  
  if (prices.length === 0) return null;
  prices.sort((a, b) => a.num - b.num);
  return prices[0].raw;
}
