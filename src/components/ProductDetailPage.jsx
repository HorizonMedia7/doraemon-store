import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  Maximize2,
  ArrowRight,
  X
} from 'lucide-react';
import StoreButton from './StoreButton';
import ProductCard from './ProductCard';
import { isProductNew } from '../utils/productHelpers';

export default function ProductDetailPage({
  product,
  allProducts = [],
  onSelectProduct,
  onViewCategory,
  onBack
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Swipe gesture touch tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const hasSwiped = useRef(false);

  // Scroll to top when product opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : ['/products/placeholder.jpg'];
  const isNew = product.show_new_tag !== undefined ? Boolean(product.show_new_tag) : isProductNew(product.dateAdded);

  // Compute up to 4 similar recommendations (prioritizing same category)
  const recommendations = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    const others = allProducts.filter((p) => p.id !== product.id);
    const sameCat = others.filter(
      (p) => p.category && p.category.toLowerCase() === product.category?.toLowerCase()
    );
    const diffCat = others.filter(
      (p) => !p.category || p.category.toLowerCase() !== product.category?.toLowerCase()
    );
    return [...sameCat, ...diffCat].slice(0, 4);
  }, [allProducts, product?.id, product?.category]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      } catch {
        // Fallback
      }
    }
  };

  // Linear image navigation without looping
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Lock background scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Keyboard navigation for full image modal (Esc, Left, Right)
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  // Touch handlers for swipe gestures (linear scrolling, no wrap around)
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    hasSwiped.current = false;
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 15) {
      hasSwiped.current = true;
    }
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 40;

    // Trigger only if horizontal swipe exceeds vertical movement & minimum distance
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swiped Left -> Next Image
        nextImage();
      } else {
        // Swiped Right -> Previous Image
        prevImage();
      }
    }

    setTimeout(() => {
      hasSwiped.current = false;
    }, 120);
  };

  return (
    <>
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.25 }}
        className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-14 sm:pb-20 w-full"
      >
        {/* Top Navigation Row: Back button & Share */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-semibold shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
            aria-label="Back to all gadgets"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all gadgets</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Share product link"
            aria-label="Share product link"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Main Full Page Product Card Grid */}
        <div className="rounded-3xl bg-white dark:bg-[#11131a] border border-slate-200/80 dark:border-white/10 p-4 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              {/* Main Active Image (Click to expand + swipe support on mobile) */}
              <div
                onClick={() => {
                  if (hasSwiped.current) return;
                  setIsLightboxOpen(true);
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="group relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-100/90 dark:bg-zinc-950 border border-slate-200/80 dark:border-white/10 select-none shadow-xs cursor-zoom-in touch-pan-y flex items-center justify-center"
                title="Click to view full image"
              >
                {/* Ambient soft blurred background matching the photo tones so odd aspect ratios blend cleanly without harsh letterbox gaps */}
                <div
                  className="absolute inset-0 bg-cover bg-center scale-115 blur-2xl opacity-25 dark:opacity-30 pointer-events-none transition-all duration-300"
                  style={{ backgroundImage: `url(${images[activeImageIndex]})` }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-white/40 dark:bg-black/35 pointer-events-none backdrop-blur-[2px]" aria-hidden="true" />

                {/* Foreground image: fully contained, zero cropping, beautiful natural look */}
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={`${product.name} photo ${activeImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 w-full h-full object-contain p-2 sm:p-4 drop-shadow-xs group-hover:scale-[1.02] transition-transform duration-300 pointer-events-none"
                />

                {/* Minimal Expand Icon/Pill - unobtrusive on mobile */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:px-2.5 sm:py-1 rounded-full sm:rounded-lg text-[10px] sm:text-[11px] font-semibold bg-black/40 sm:bg-black/50 text-white/90 backdrop-blur-xs flex items-center gap-1.5 shadow-xs pointer-events-none group-hover:bg-black/70 transition-colors">
                  <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Click to expand</span>
                </div>

                {/* Compact Arrow Controls on Card (No loop: hidden when at start/end) */}
                {images.length > 1 && (
                  <>
                    {activeImageIndex > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 text-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center focus:outline-none transition-transform active:scale-90 cursor-pointer"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    {activeImageIndex < images.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 text-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center focus:outline-none transition-transform active:scale-90 cursor-pointer"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </>
                )}

                {/* Subtle Counter Badge (Minimal size on mobile) */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-black/40 sm:bg-black/60 text-white/90 backdrop-blur-xs whitespace-nowrap tracking-wide">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 bg-slate-100 dark:bg-zinc-900 transition-all cursor-pointer p-1 flex items-center justify-center ${
                        activeImageIndex === idx
                          ? 'border-slate-900 dark:border-white ring-2 ring-slate-900/20 dark:ring-white/20'
                          : 'border-slate-200/80 dark:border-white/10 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Title -> Where to Buy -> Speciality & Features (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Top Badges & Product Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                    {product.category}
                  </span>
                  {isNew && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-500 text-slate-950 shadow-xs">
                      <Sparkles className="w-3 h-3 fill-slate-950" />
                      <span>NEW</span>
                    </span>
                  )}
                </div>

                <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* WHERE TO BUY SECTION - Prominent & Directly Accessible */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
                    <span>Where to Buy (Direct Links)</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    Verified deals
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.links && product.links.length > 0 ? (
                    product.links.map((link, idx) => (
                      <StoreButton
                        key={idx}
                        link={link}
                        productName={product.name}
                        productId={product.id}
                      />
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      Links currently updating.
                    </p>
                  )}
                </div>
              </div>

              {/* Speciality & Features */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="space-y-2.5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white font-bold">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Speciality & Features</span>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {product.highlights.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Affiliate Transparency Notice */}
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-normal italic pt-2 border-t border-slate-100 dark:border-white/5">
                Disclosure: Purchases made through these links may earn our channel an affiliate commission with no extra cost to you.
              </p>

            </div>

          </div>
        </div>

        {/* Similar Recommendations Section (Shown instead of footer on product page) */}
        {recommendations.length > 0 && (
          <section className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-slate-200/80 dark:border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Similar Recommendations</span>
                </div>
                <h2 className="font-display font-bold text-lg sm:text-2xl text-slate-900 dark:text-white">
                  You Might Also Like
                </h2>
              </div>
              {product.category && (
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Featured in {product.category}
                </span>
              )}
            </div>

            {/* 4 Recommendations in Responsive Grid View */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {recommendations.map((rec, idx) => (
                <ProductCard
                  key={rec.id}
                  product={rec}
                  onSelect={onSelectProduct}
                  index={idx}
                  viewMode="grid"
                />
              ))}
            </div>

            {/* Show More Similar Products Button */}
            <div className="mt-8 sm:mt-10 pt-2 flex flex-col items-center justify-center text-center">
              <button
                onClick={() => onViewCategory && onViewCategory(product.category)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 group cursor-pointer"
              >
                <span>Show more similar products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {product.category && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  View all gadgets in <span className="font-semibold text-slate-700 dark:text-slate-300">{product.category}</span>
                </p>
              )}
            </div>
          </section>
        )}
      </motion.main>

      {/* Full Image Window (Lightbox Modal with Mobile Swipe Support) */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (hasSwiped.current) return;
              setIsLightboxOpen(false);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 select-none touch-pan-y"
            role="dialog"
            aria-modal="true"
            aria-label="Full image viewer"
          >
            {/* Exit / Close Button (Top-Right) */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center shadow-lg"
              aria-label="Exit full image window"
              title="Exit (Esc)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Previous Image Button (Left) - Hidden at first image (no loop) */}
            {images.length > 1 && activeImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer min-w-[36px] min-h-[36px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center shadow-lg"
                aria-label="Previous photo"
                title="Previous (Left arrow or swipe right)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* Next Image Button (Right) - Hidden at last image (no loop) */}
            {images.length > 1 && activeImageIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer min-w-[36px] min-h-[36px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center shadow-lg"
                aria-label="Next photo"
                title="Next (Right arrow or swipe left)"
              >
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* Central Full-Resolution Image (Supports touch swipe) */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[82vh] max-w-[90vw] sm:max-w-[85vw] flex items-center justify-center select-none"
            >
              <motion.img
                key={activeImageIndex}
                src={images[activeImageIndex]}
                alt={`${product.name} photo ${activeImageIndex + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="max-h-[80vh] max-w-[90vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl pointer-events-none"
              />
            </div>

            {/* Bottom Photo Counter & Thumbnail Nav */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[92vw]"
            >
              {/* Counter Pill - Clean, single-line, current / total only */}
              <div className="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/75 text-white backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-bold tracking-wider shadow-lg whitespace-nowrap">
                {activeImageIndex + 1} / {images.length}
              </div>

              {/* Thumbnails in Lightbox */}
              {images.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1 bg-black/60 rounded-xl backdrop-blur-md border border-white/10 scrollbar-none">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-white scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`Jump to photo ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
