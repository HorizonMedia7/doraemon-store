import { createClient } from '@supabase/supabase-js';
import localProducts from '../data/products';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Fetch all products.
 * If includeDrafts = true, fetches both published and draft products (for Admin).
 * If includeDrafts = false, fetches only published products (for Public store).
 * Falls back safely to local hardcoded products if Supabase is not yet connected.
 */
export async function getProducts(includeDrafts = false) {
  if (!isSupabaseConfigured || !supabase) {
    return localProducts;
  }

  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeDrafts) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch failed:', error.message);
      return [];
    }

    if (!data) {
      return [];
    }

    // Map database fields to application shape
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      tagline: item.tagline || '',
      description: item.description || '',
      highlights: Array.isArray(item.highlights) ? item.highlights : [],
      category: item.category || 'Tech Accessories',
      images: Array.isArray(item.images) ? item.images : [],
      links: Array.isArray(item.links) ? item.links : [],
      dateAdded: item.date_added || item.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      is_published: item.is_published ?? true,
      featured: item.featured ?? false,
      show_tag: item.show_tag !== false,
      click_count: item.click_count || 0
    }));
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

/**
 * Save product (Create or Update)
 */
export async function upsertProduct(product) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const payload = {
    id: product.id,
    name: product.name,
    tagline: product.tagline || '',
    description: product.description || '',
    highlights: product.highlights || [],
    category: product.category || 'Tech Accessories',
    images: product.images || [],
    links: product.links || [],
    is_published: product.is_published !== undefined ? product.is_published : true,
    featured: product.featured || false,
    show_tag: product.show_tag !== undefined ? product.show_tag : true,
    date_added: product.dateAdded || new Date().toISOString().slice(0, 10),
    updated_at: new Date().toISOString()
  };

  let { data, error } = await supabase
    .from('products')
    .upsert(payload, { onConflict: 'id' })
    .select();

  // If show_tag column does not exist yet in database (code 42703), safely retry without it
  if (error && error.code === '42703') {
    delete payload.show_tag;
    const retry = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' })
      .select();
    if (retry.error) throw retry.error;
    data = retry.data;
  } else if (error) {
    throw error;
  }

  return data?.[0];
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(productId) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
  return true;
}

/**
 * Quick toggle published status
 */
export async function toggleProductPublished(productId, currentStatus) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('products')
    .update({ is_published: !currentStatus, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) throw error;
  return !currentStatus;
}

/**
 * Upload an image file to Supabase Storage bucket 'product-images'
 * Returns the public URL of the uploaded image
 */
export async function uploadImage(file) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const fileExt = file.name.split('.').pop() || 'webp';
  const cleanName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
  const fileName = `${Date.now()}-${cleanName}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Track an affiliate click securely via RPC or table insert
 */
export async function recordAffiliateClick({ productId, productName, store, url, price }) {
  if (!supabase) return;

  try {
    // Try calling the atomic RPC function
    const { error: rpcError } = await supabase.rpc('track_affiliate_click', {
      p_product_id: productId,
      p_product_name: productName,
      p_store: store,
      p_url: url,
      p_price: price || null
    });

    if (rpcError) {
      // Fallback: direct insert to click_events
      await supabase.from('click_events').insert({
        product_id: productId,
        product_name: productName,
        store: store,
        url: url,
        price: price || null
      });
    }
  } catch (err) {
    console.debug('Click tracking failed silently:', err);
  }
}

/**
 * Get Click Statistics for Admin Dashboard
 */
export async function getClickStats() {
  if (!supabase) {
    return {
      totalClicks: 0,
      totalProductsWithClicks: 0,
      topProducts: [],
      topStores: []
    };
  }

  try {
    // 1. Get products sorted by click count
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name, click_count, category, images')
      .order('click_count', { ascending: false });

    // 2. Get recent click events
    const { data: eventsData, count } = await supabase
      .from('click_events')
      .select('store, product_name, product_id', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(500);

    const storeCounts = {};
    if (eventsData) {
      eventsData.forEach((ev) => {
        const s = ev.store || 'Unknown';
        storeCounts[s] = (storeCounts[s] || 0) + 1;
      });
    }

    const topStores = Object.entries(storeCounts)
      .map(([store, count]) => ({ store, count }))
      .sort((a, b) => b.count - a.count);

    const totalClicks = (productsData || []).reduce((sum, p) => sum + (p.click_count || 0), 0) || (count || 0);

    const topProducts = (productsData || [])
      .filter((p) => (p.click_count || 0) > 0)
      .slice(0, 5);

    return {
      totalClicks,
      totalProductsWithClicks: topProducts.length,
      topProducts,
      topStores
    };
  } catch (err) {
    console.error('Error fetching click stats:', err);
    return {
      totalClicks: 0,
      totalProductsWithClicks: 0,
      topProducts: [],
      topStores: []
    };
  }
}

/**
 * Migrate hardcoded products from local file into Supabase
 */
export async function migrateLocalProducts() {
  if (!supabase) throw new Error('Supabase is not configured.');

  let inserted = 0;
  for (const item of localProducts) {
    const payload = {
      id: item.id,
      name: item.name,
      tagline: item.tagline || '',
      description: item.description || '',
      highlights: item.highlights || [],
      category: item.category || 'Tech Accessories',
      images: item.images || [],
      links: item.links || [],
      is_published: true,
      featured: false,
      date_added: item.dateAdded || new Date().toISOString().slice(0, 10)
    };

    const { error } = await supabase
      .from('products')
      .upsert(payload, { onConflict: 'id' });

    if (!error) inserted++;
  }

  return inserted;
}

/**
 * Authentication helpers
 */
export async function loginAdmin(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
