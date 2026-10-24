import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, ExternalLink, ArrowLeft, Shield } from 'lucide-react';
import AdminLogin from './AdminLogin';
import AdminProductList from './AdminProductList';
import AdminProductForm from './AdminProductForm';
import {
  supabase,
  isSupabaseConfigured,
  getProducts,
  getClickStats,
  getCurrentUser,
  logoutAdmin
} from '../../services/supabase';

export default function AdminPage({ onBackToStore }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // View state: 'list' | 'add' | 'edit'
  const [currentView, setCurrentView] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);

  // Products and Stats state
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [dataLoading, setDataLoading] = useState(false);

  // Ensure this page is NEVER indexed by search engines
  useEffect(() => {
    let metaTag = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
      created = true;
    }
    const previousContent = metaTag.getAttribute('content');
    metaTag.setAttribute('content', 'noindex, nofollow, noarchive');

    return () => {
      if (created) {
        metaTag.remove();
      } else if (previousContent) {
        metaTag.setAttribute('content', previousContent);
      } else {
        metaTag.removeAttribute('content');
      }
    };
  }, []);

  // Listen to Supabase Auth State
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Load products (including drafts) and stats
  const loadData = useCallback(async () => {
    try {
      setDataLoading(true);
      const [fetchedProducts, fetchedStats] = await Promise.all([
        getProducts(true), // true = include unpublished drafts
        getClickStats()
      ]);
      setProducts(fetchedProducts || []);
      setStats(fetchedStats || {});
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  // View handlers
  const handleAddNew = () => {
    setEditingProduct(null);
    setCurrentView('add');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setCurrentView('edit');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleFormSave = () => {
    setCurrentView('list');
    setEditingProduct(null);
    loadData();
  };

  const handleFormCancel = () => {
    setCurrentView('list');
    setEditingProduct(null);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is not logged in, show login screen
  if (!user) {
    return (
      <AdminLogin
        onLoginSuccess={loadData}
        onBackToStore={onBackToStore}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090a0f] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Admin Sticky Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#11131a]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center border border-sky-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight block">
                Doraemon Admin
              </span>
              <span className="text-[10px] text-slate-400 block truncate max-w-[140px] sm:max-w-none">
                {user.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Store</span>
              <span className="sm:hidden">Store</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {currentView === 'list' && (
          <AdminProductList
            products={products}
            stats={stats}
            onAddProduct={handleAddNew}
            onEditProduct={handleEdit}
            onRefresh={loadData}
          />
        )}

        {(currentView === 'add' || currentView === 'edit') && (
          <AdminProductForm
            product={editingProduct}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}
      </main>
    </div>
  );
}
