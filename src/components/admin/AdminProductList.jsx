import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  MousePointerClick,
  TrendingUp,
  Layers,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  AlertTriangle,
  DownloadCloud,
  CheckCircle2
} from 'lucide-react';
import { toggleProductPublished, deleteProduct, migrateLocalProducts } from '../../services/supabase';

export default function AdminProductList({
  products = [],
  stats = {},
  onAddProduct,
  onEditProduct,
  onRefresh
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, published, hidden, featured
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  // Filter products by search and status
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tagline?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'published') return p.is_published !== false;
      if (statusFilter === 'hidden') return p.is_published === false;
      if (statusFilter === 'featured') return Boolean(p.featured);

      return true;
    });
  }, [products, searchQuery, statusFilter]);

  // Quick toggle published status
  const handleTogglePublished = async (product, e) => {
    e.stopPropagation();
    try {
      setToggleLoadingId(product.id);
      await toggleProductPublished(product.id, product.is_published !== false);
      onRefresh();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setToggleLoadingId(null);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert(`Delete failed: ${err.message || 'Please try again.'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // 1-Click Migration of existing hardcoded products
  const handleMigrate = async () => {
    try {
      setIsMigrating(true);
      setMigrationStatus('Importing existing products to database...');
      const count = await migrateLocalProducts();
      setMigrationStatus(`Successfully imported ${count} products!`);
      setTimeout(() => setMigrationStatus(''), 4000);
      onRefresh();
    } catch (err) {
      console.error('Migration failed:', err);
      setMigrationStatus(`Import failed: ${err.message || 'Check database connection'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Click Stats Section */}
      <section className="bg-white dark:bg-[#11131a] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Live Store Analytics
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Outbound affiliate clicks & customer interest
              </p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Clicks</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {stats.totalClicks || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Products</span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {products.length}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Top Store</span>
            <p className="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400 truncate mt-0.5">
              {stats.topStores?.[0]?.store ? `${stats.topStores[0].store} (${stats.topStores[0].count})` : 'None yet'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Top Gadget</span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
              {stats.topProducts?.[0]?.name || 'None yet'}
            </p>
          </div>
        </div>

        {/* Top breakdown if data exists */}
        {(stats.topProducts?.length > 0 || stats.topStores?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {stats.topProducts?.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                  🔥 Most Clicked Gadgets
                </span>
                <ul className="space-y-1">
                  {stats.topProducts.map((p, idx) => (
                    <li key={p.id || idx} className="flex items-center justify-between gap-2 text-slate-500 dark:text-slate-400">
                      <span className="truncate">{idx + 1}. {p.name}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex-shrink-0">
                        {p.click_count || 0} clicks
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stats.topStores?.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5">
                <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                  🛒 Store Click Breakdown
                </span>
                <div className="flex flex-wrap gap-2">
                  {stats.topStores.map((st) => (
                    <span
                      key={st.store}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 font-medium text-slate-700 dark:text-slate-300 text-[11px]"
                    >
                      {st.store}: <strong className="text-sky-600 dark:text-sky-400">{st.count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 2. Migration Notice if needed */}
      {migrationStatus && (
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{migrationStatus}</span>
        </div>
      )}

      {/* 3. Controls & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gadgets by name or category..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#11131a] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMigrate}
            disabled={isMigrating}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131a] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Import existing code products to database"
          >
            <DownloadCloud className="w-4 h-4 text-sky-500" />
            <span className="hidden sm:inline">Import Existing</span>
            <span className="sm:hidden">Import</span>
          </button>

          <button
            type="button"
            onClick={onAddProduct}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gadget</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All (${products.length})` },
          { id: 'published', label: `Published (${products.filter((p) => p.is_published !== false).length})` },
          { id: 'hidden', label: `Hidden (${products.filter((p) => p.is_published === false).length})` },
          { id: 'featured', label: `Featured (${products.filter((p) => p.featured).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Products List */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const isLive = product.is_published !== false;
            const primaryImg = product.images?.[0] || '/products/placeholder.jpg';
            const linksCount = product.links?.length || 0;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-[#11131a] rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-white/20 transition-all"
              >
                {/* Product Thumbnail & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex-shrink-0">
                    <img
                      src={primaryImg}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.featured && (
                      <span className="absolute top-1 left-1 p-0.5 rounded-full bg-amber-500 text-slate-950">
                        <Sparkles className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                        {product.category}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          isLive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isLive ? 'Published' : 'Hidden'}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {product.tagline || 'No tagline'}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3 text-sky-500" />
                        <span>{product.click_count || 0} clicks</span>
                      </span>
                      <span>•</span>
                      <span>{linksCount} {linksCount === 1 ? 'affiliate link' : 'affiliate links'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                  {/* Quick Toggle Live/Hidden */}
                  <button
                    type="button"
                    disabled={toggleLoadingId === product.id}
                    onClick={(e) => handleTogglePublished(product, e)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isLive
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                        : 'border-slate-300 dark:border-white/10 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    title={isLive ? 'Click to Hide from website' : 'Click to Publish to website'}
                  >
                    {isLive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isLive ? 'Live' : 'Hidden'}</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setProductToDelete(product)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-[#11131a] border border-slate-200 dark:border-white/10 space-y-3">
          <Layers className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            No gadgets match your filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for something else, or add your first product using the button above.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#11131a] rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Delete this gadget?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently delete <strong className="text-slate-800 dark:text-slate-200">{productToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
