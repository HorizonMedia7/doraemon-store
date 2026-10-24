import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Camera,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { upsertProduct, uploadImage } from '../../services/supabase';
import { compressImage, formatBytes } from '../../utils/imageCompressor';

const PRESET_STORES = ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Tata CLiQ', 'Croma', 'Ajio'];
const PRESET_CATEGORIES = [
  'Tech Accessories',
  'Smart Gadgets',
  'Home & Desk',
  'Audio & Music',
  'Travel & Portable',
  'Cleaning & Care'
];

export default function AdminProductForm({ product, onSave, onCancel }) {
  const isEditing = Boolean(product && product.id);

  // Form State
  const [name, setName] = useState(product?.name || '');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || 'Tech Accessories');
  const [customCategory, setCustomCategory] = useState('');
  const [isPublished, setIsPublished] = useState(product?.is_published ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [showTag, setShowTag] = useState(product?.show_tag ?? true);

  // Highlights / bullet points
  const [highlights, setHighlights] = useState(
    Array.isArray(product?.highlights) && product.highlights.length > 0
      ? product.highlights
      : ['']
  );

  // Images: array of string URLs or uploaded URLs
  const [images, setImages] = useState(
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : []
  );

  // Affiliate store links
  const [links, setLinks] = useState(
    Array.isArray(product?.links) && product.links.length > 0
      ? product.links
      : [{ store: 'Amazon', url: '', price: '' }]
  );

  // Uploading / compression status
  const [uploadProgress, setUploadProgress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [externalImageUrl, setExternalImageUrl] = useState('');

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Slug generator helper
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle image files from gallery or camera
  const handleImageFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setErrorMessage('');
    setUploadProgress(`Processing ${files.length} photo(s)...`);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Compressing photo ${i + 1} of ${files.length}...`);

        // 1. Client-side Canvas Compression
        const { file: compressedFile, originalSize, compressedSize } = await compressImage(file, {
          maxWidth: 1400,
          quality: 0.82
        });

        console.log(
          `Compressed ${file.name}: ${formatBytes(originalSize)} -> ${formatBytes(compressedSize)}`
        );

        // 2. Upload to Supabase Storage
        setUploadProgress(`Uploading photo ${i + 1} of ${files.length}...`);
        const publicUrl = await uploadImage(compressedFile);
        uploadedUrls.push(publicUrl);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      setUploadProgress('');
    } catch (err) {
      console.error('Image upload failed:', err);
      setErrorMessage(`Image upload failed: ${err.message || 'Please check storage configuration.'}`);
      setUploadProgress('');
    }

    // Reset file inputs
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Add external image URL
  const handleAddExternalImage = () => {
    if (!externalImageUrl.trim()) return;
    setImages((prev) => [...prev, externalImageUrl.trim()]);
    setExternalImageUrl('');
  };

  // Image actions: Reorder & Remove
  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImages(updated);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Highlights handlers
  const handleHighlightChange = (index, val) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };

  const addHighlight = () => {
    setHighlights((prev) => [...prev, '']);
  };

  const removeHighlight = (index) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  // Links handlers
  const handleLinkChange = (index, field, value) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  };

  const addLink = (storeName = 'Amazon') => {
    setLinks((prev) => [...prev, { store: storeName, url: '', price: '' }]);
  };

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter a product name.');
      return;
    }

    // Filter valid links
    const validLinks = links.filter((l) => l.url && l.url.trim().length > 0);
    if (validLinks.length === 0) {
      setErrorMessage('Please provide at least one affiliate buy link.');
      return;
    }

    // Filter valid highlights
    const validHighlights = highlights.filter((h) => h.trim().length > 0);

    const finalCategory = category === 'Other' && customCategory.trim()
      ? customCategory.trim()
      : category;

    const productId = isEditing
      ? product.id
      : generateSlug(name) + '-' + Math.random().toString(36).substring(2, 6);

    const productPayload = {
      id: productId,
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      highlights: validHighlights,
      category: finalCategory,
      images: images.length > 0 ? images : ['/products/placeholder.jpg'],
      links: validLinks,
      is_published: isPublished,
      featured,
      show_tag: showTag,
      dateAdded: product?.dateAdded || new Date().toISOString().slice(0, 10)
    };

    try {
      setIsSubmitting(true);
      const saved = await upsertProduct(productPayload);
      onSave(saved || productPayload);
    } catch (err) {
      console.error('Failed to save product:', err);
      setErrorMessage(err.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 pb-32">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
          {isEditing ? 'Editing Product' : 'New Product'}
        </span>
      </div>

      <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white mb-2">
        {isEditing ? 'Edit Product' : 'Add New Gadget'}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
        Fill in the gadget details, upload photos, and paste your affiliate links.
      </p>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Error saving</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details Card */}
        <section className="bg-white dark:bg-[#11131a] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xs">
          <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
            1. Basic Information
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 7-in-1 Multifunctional Gadget Cleaning Kit"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Short Description / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Pocket-sized cleaning multi-tool for AirPods, keyboards & phones"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {PRESET_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {cat}
                  </option>
                ))}
                <option value="Other" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  + Other / Custom Category
                </option>
              </select>
            </div>

            {category === 'Other' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Type Custom Category Name
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Gaming Gear"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation of features, design, and practical use cases..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Highlights / Features list */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Key Highlights / Bullet Points
              </label>
              <button
                type="button"
                onClick={addHighlight}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>

            <div className="space-y-2 mt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs font-bold">{idx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleHighlightChange(idx, e.target.value)}
                    placeholder="e.g. High-density soft brush for keyboard dust"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Images Card */}
        <section className="bg-white dark:bg-[#11131a] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                2. Product Images ({images.length})
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload from phone gallery or take photo. Automatically compressed for speed.
              </p>
            </div>
          </div>

          {/* Upload buttons for mobile & desktop */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-sky-500/40 hover:border-sky-500 bg-sky-500/5 hover:bg-sky-500/10 text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">Choose Photos</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Phone Gallery</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">Take Photo</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Camera</span>
            </button>

            {/* Hidden file inputs */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFiles}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageFiles}
              className="hidden"
            />
          </div>

          {/* Progress / Status banner */}
          {uploadProgress && (
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-300 text-xs font-semibold flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span>{uploadProgress}</span>
            </div>
          )}

          {/* Image Previews & Reorder List */}
          {images.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Uploaded Images (First image is the cover thumbnail):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 aspect-square flex flex-col justify-between p-1.5"
                  >
                    <img
                      src={imgUrl}
                      alt={`Product preview ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Cover badge */}
                    {idx === 0 && (
                      <span className="relative z-10 self-start px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-sky-500 text-white shadow-xs">
                        Cover Image
                      </span>
                    )}

                    {/* Overlay controls for reorder & delete */}
                    <div className="relative z-10 flex items-center justify-between mt-auto bg-black/60 backdrop-blur-md rounded-lg p-1 text-white">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveImage(idx, -1)}
                          className="p-1 hover:bg-white/20 rounded disabled:opacity-20 cursor-pointer"
                          title="Move left/up"
                        >
                          <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg] sm:rotate-0" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => moveImage(idx, 1)}
                          className="p-1 hover:bg-white/20 rounded disabled:opacity-20 cursor-pointer"
                          title="Move right/down"
                        >
                          <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg] sm:rotate-0" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1 hover:bg-rose-500/80 rounded text-rose-300 hover:text-white transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External URL option */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Or paste image URL (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={externalImageUrl}
                onChange={(e) => setExternalImageUrl(e.target.value)}
                placeholder="https://images.example.com/photo.jpg"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddExternalImage}
                className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add Link
              </button>
            </div>
          </div>
        </section>

        {/* Affiliate Links Card */}
        <section className="bg-white dark:bg-[#11131a] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                3. Affiliate Buy Links ({links.length})
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Add store links where visitors can buy this gadget.
              </p>
            </div>

            <button
              type="button"
              onClick={() => addLink('Amazon')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>

          {/* Quick presets chips */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Store Chips:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {PRESET_STORES.map((store) => (
                <button
                  key={store}
                  type="button"
                  onClick={() => addLink(store)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  + {store}
                </button>
              ))}
            </div>
          </div>

          {/* Links list */}
          <div className="space-y-3 pt-2">
            {links.map((link, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Store Link #{idx + 1}
                  </span>

                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                      title="Remove this link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      required
                      value={link.store || ''}
                      onChange={(e) => handleLinkChange(idx, 'store', e.target.value)}
                      placeholder="e.g. Amazon, Flipkart"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Affiliate URL *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="url"
                        required
                        value={link.url || ''}
                        onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                        placeholder="https://amzn.to/... or https://flipkart.com/..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Display Price (Optional)
                  </label>
                  <input
                    type="text"
                    value={link.price || ''}
                    onChange={(e) => handleLinkChange(idx, 'price', e.target.value)}
                    placeholder="e.g. 470 or 1,299 (₹ added automatically)"
                    className="w-full sm:w-1/2 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visibility & Settings Card */}
        <section className="bg-white dark:bg-[#11131a] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xs">
          <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-2">
            4. Visibility & Status
          </h2>

          <div className="space-y-4">
            {/* Published Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isPublished ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 text-slate-500'}`}>
                  {isPublished ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {isPublished ? 'Published (Live)' : 'Draft (Hidden)'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isPublished ? 'Visitors can view this product on the website immediately.' : 'Hidden from public visitors until you publish it.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublished ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isPublished ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${featured ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-200 text-slate-500'}`}>
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Featured Gadget
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Highlight with badge and top placement.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  featured ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    featured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Category Tag Visibility Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${showTag ? 'bg-indigo-500/20 text-indigo-500' : 'bg-slate-200 text-slate-500'}`}>
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Show Category Tag on Card
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {showTag ? `Category tag "${category}" is displayed above the photo on storefront.` : 'Category tag is hidden from the storefront card.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTag(!showTag)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showTag ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    showTag ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Sticky Mobile / Desktop Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#11131a]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 py-3.5 px-4 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Publish Gadget'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
