import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';
import StoreButton from './StoreButton';
import { isProductNew, getLowestPrice } from '../utils/productHelpers';

export default function ProductModal({ product, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const modalContentRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus trap & return focus
  useEffect(() => {
    previouslyFocusedElementRef.current = document.activeElement;
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleFocusTrap = (e) => {
      if (e.key !== 'Tab' || !modalContentRef.current) return;

      const focusableElements = modalContentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleFocusTrap);
    return () => {
      window.removeEventListener('keydown', handleFocusTrap);
      if (previouslyFocusedElementRef.current && previouslyFocusedElementRef.current.focus) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, []);

  // Lock body scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Reset active image index when product changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : ['/products/placeholder.jpg'];
  const isNew = isProductNew(product.dateAdded);
  const lowestPrice = getLowestPrice(product);

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

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto sm:overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
      />

      {/* Sheet / Modal Container - Optimized for mobile viewports (dvh) */}
      <motion.div
        ref={modalContentRef}
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 120 }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > 120 || velocity.y > 350) {
            onClose();
          }
        }}
        className="relative w-full max-w-3xl max-h-[90dvh] sm:max-h-[85vh] bg-white dark:bg-[#0d0f17] border-t sm:border border-slate-200 dark:border-white/10 rounded-t-[28px] sm:rounded-2xl shadow-xl flex flex-col z-10 overflow-hidden"
      >
        {/* Mobile Swipe-Down Handle */}
        <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Modal Top Header Bar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
              {product.category}
            </span>
            {isNew && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950">
                <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                <span>NEW</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold min-h-[38px]"
              title="Copy link to product"
              aria-label="Share product link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span className="hidden xs:inline">Share</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6 pb-safe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
            
            {/* Left Column: Image Gallery Carousel */}
            <div className="space-y-2.5">
              {/* Main Active Image */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 select-none">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={`${product.name} photo ${activeImageIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover"
                />

                {/* Arrow Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/70 hover:bg-white text-slate-800 dark:text-white backdrop-blur-xs shadow-xs min-h-[38px] min-w-[38px] flex items-center justify-center focus:outline-none"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/70 hover:bg-white text-slate-800 dark:text-white backdrop-blur-xs shadow-xs min-h-[38px] min-w-[38px] flex items-center justify-center focus:outline-none"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/70 text-white backdrop-blur-xs">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-brand-600 dark:border-brand-400 ring-2 ring-brand-500/20'
                          : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Info & WHERE TO BUY (Straightforward & prominent) */}
            <div className="space-y-4">
              {/* Product Title, Tagline & Price */}
              <div>
                <h1
                  id="modal-product-title"
                  className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight"
                >
                  {product.name}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {product.tagline}
                </p>
                {lowestPrice && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <span>Starting from {lowestPrice}</span>
                  </div>
                )}
              </div>

              {/* WHERE TO BUY SECTION - High priority, directly visible */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>Where to Buy (Direct Links)</span>
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Verified links
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
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

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Why I Recommend It</span>
                  </div>
                  <ul className="space-y-1.5">
                    {product.highlights.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Affiliate Disclosure */}
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal italic pt-1 border-t border-slate-100 dark:border-white/5">
                Disclosure: Purchases made via these links may earn our channel an affiliate commission with no extra cost to you.
              </p>

            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
