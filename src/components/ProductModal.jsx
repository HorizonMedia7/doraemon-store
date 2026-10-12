import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import StoreButton from './StoreButton';
import { isProductNew } from '../utils/productHelpers';

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
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Sheet / Modal Container */}
      <motion.div
        ref={modalContentRef}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(e, { offset, velocity }) => {
          // If swiped down past threshold or with high velocity, close
          if (offset.y > 140 || velocity.y > 400) {
            onClose();
          }
        }}
        className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#0d0f17] border border-white/10 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
      >
        {/* Mobile Swipe-Down Handle Bar */}
        <div className="sm:hidden w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-slate-600" />
        </div>

        {/* Modal Top Header Bar */}
        <div className="px-5 sm:px-8 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {product.category}
            </span>
            {isNew && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase bg-emerald-500 text-slate-950">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>NEW</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Copy link to product"
              aria-label="Share product link"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-brand-400" />
                  <span className="hidden xs:inline">Share</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Image Gallery Carousel */}
            <div className="space-y-3">
              {/* Main Active Image with Next / Prev Controls */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group select-none">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={`${product.name} photo ${activeImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />

                {/* Left Arrow */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm opacity-80 hover:opacity-100 transition-all focus:outline-none"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm opacity-80 hover:opacity-100 transition-all focus:outline-none"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter Badge */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/75 text-white backdrop-blur-md">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-brand-500 scale-102 ring-2 ring-brand-500/40'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Information & Affiliate Buy Section */}
            <div className="space-y-6">
              {/* Product Title & Tagline */}
              <div>
                <h1
                  id="modal-product-title"
                  className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight"
                >
                  {product.name}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-brand-300 font-medium">
                  {product.tagline}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  About this Gadget
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Why I Like It Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Why I Recommend It</span>
                  </div>
                  <ul className="space-y-2.5">
                    {product.highlights.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* "Where to Buy" Affiliate Stores List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-400" />
                    <span>Where to Buy (Verified Links)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Opens direct store
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
                      Links currently updating. Check back shortly!
                    </p>
                  )}
                </div>
              </div>

              {/* Affiliate Disclosure Notice */}
              <p className="text-[11px] text-slate-500 leading-normal italic pt-2 border-t border-white/5">
                Disclosure: Purchases made via these links may earn our channel an affiliate commission with no extra cost to you.
              </p>

            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
