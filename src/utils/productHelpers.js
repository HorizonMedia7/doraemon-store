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
 * Parses numeric price string like "₹1,499" or "470" into integer 1499
 */
export function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const clean = String(priceStr).replace(/[^0-9]/g, '');
  return parseInt(clean, 10) || 0;
}

/**
 * Formats any price input into a clean string starting with ₹ (e.g. 470 -> ₹470)
 */
export function formatPrice(price) {
  if (price === undefined || price === null) return '';
  const str = String(price).trim();
  if (!str) return '';

  // If already starts with ₹, return normalized
  if (str.startsWith('₹')) {
    return str;
  }

  // Remove any redundant "Rs." / "Rs" / "INR"
  const cleaned = str.replace(/^(rs\.?|inr)\s*/i, '').trim();
  return `₹${cleaned}`;
}

/**
 * Find lowest price among all store links for a product, formatted with ₹
 */
export function getLowestPrice(product) {
  if (!product.links || product.links.length === 0) return null;
  const prices = product.links
    .map((l) => ({ raw: formatPrice(l.price), num: parsePrice(l.price) }))
    .filter((p) => p.num > 0);
  
  if (prices.length === 0) return null;
  prices.sort((a, b) => a.num - b.num);
  return prices[0].raw;
}
