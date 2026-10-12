# ✨ Doraemon Gadgets — Instagram Affiliate Showcase

A modern, visually stunning React web application showcasing viral, genius, and aesthetic gadgets featured on [@doraemon_gadgets7](https://www.instagram.com/doraemon_gadgets7) Instagram reels.

Built with a fast, zero-database architecture: all products live in a single JavaScript file (`src/data/products.js`), with instant deep linking, mobile bottom-sheet drawers, branded store buttons, dark/light mode, and affiliate tracking.

---

## ⚡ Tech Stack

- **React 19 + Vite 8** — Ultra-fast frontend tooling and bundle speeds
- **Tailwind CSS** — Modern glassmorphism UI with custom animations and cohesive palette
- **Framer Motion** — 60fps micro-interactions, scroll reveals, shared element transitions, and touch-drag gestures
- **Lucide Icons** — Lightweight modern iconography
- **Pure Client Architecture** — No backend or database required; easily deployable to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages)

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Steps
1. Open your terminal in the project directory:
   ```bash
   cd "C:\Users\Mohd Husham\Desktop\Ecom AFF"
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173/
   ```

5. To create an optimized production build:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🛍️ How to Add a New Product (Step-by-Step)

Adding a product requires **editing only ONE file** (`src/data/products.js`) and placing images in `public/products/`. No component or layout changes are needed!

### Step 1: Save Images
Save 1 to 3 photos of the product into the `public/products/` folder with clean kebab-case names:
```
public/products/smart-air-purifier-1.jpg
public/products/smart-air-purifier-2.jpg
```

### Step 2: Add Entry in `src/data/products.js`
Open `src/data/products.js` and add a new object at the **top** of the `products` array:

```javascript
{
  id: "smart-air-purifier", // Unique URL slug (e.g. opens /product/smart-air-purifier)
  name: "Desktop Smart Ion Air Purifier",
  tagline: "Pocket-sized HEPA air cleaner with ambient night light & USB-C",
  description: "Breathe crisp, ultra-clean air anywhere. Uses true HEPA-13 filtration to capture 99.97% of smoke, dust, pollen, and pet dander quietly right by your desk.",
  highlights: [
    "True HEPA-13 filtration with active carbon layer",
    "Whisper-silent 24dB night mode for peaceful sleep",
    "Dual-speed touch control with soft LED ring glow",
    "USB-C powered — run from laptop or power bank"
  ],
  category: "Smart Living", // Auto-creates category pill if new!
  images: [
    "/products/smart-air-purifier-1.jpg",
    "/products/smart-air-purifier-2.jpg"
  ],
  dateAdded: "2026-10-12", // Format: YYYY-MM-DD (shows NEW badge for 14 days)
  links: [
    { store: "Amazon", url: "https://www.amazon.in/dp/...?tag=youraffid-21", price: "₹1,499" },
    { store: "Flipkart", url: "https://www.flipkart.com/...&affid=youraffid", price: "₹1,599" },
    { store: "Meesho", url: "https://www.meesho.com/...", price: "₹1,349" }
  ]
}
```

### Automatic Features Handled for You:
- **Category Filter**: New categories appear automatically in the category pill bar.
- **"NEW" Badge**: Automatically glows on any product added within the last 14 days based on `dateAdded`.
- **Lowest Price Summary**: The card dynamically identifies the lowest price among available stores.
- **Store Badging**: Stores like `Amazon`, `Flipkart`, `Meesho`, `Myntra`, `Tata CLiQ`, `Ajio`, and `Croma` automatically get authentic brand icons and styling. Unknown stores receive a neutral theme.
- **Deep-linking**: Each product is immediately accessible via `/product/smart-air-purifier` or `?product=smart-air-purifier`.

---

## 🌐 How to Deploy for Free

Both Vercel and Netlify configurations (`vercel.json` and `public/_redirects`) are already included in this repository to support single-page application (SPA) routing.

### Option A: Deploy with Vercel (Recommended)
1. Install Vercel CLI (or push your repository to GitHub / GitLab):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Or connect through [Vercel Dashboard](https://vercel.com/):
   - Click **Add New Project** → Import your repository
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Click **Deploy**

### Option B: Deploy with Netlify
1. Log in to [Netlify](https://app.netlify.com/):
   - Click **Add new site** → **Import an existing project**
   - Connect your GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click **Deploy**
2. Netlify will automatically detect `public/_redirects` so deep product links like `/product/levitating-moon-lamp` work without 404 errors.

---

## 📊 Analytics & Click Tracking

Affiliate link clicks trigger the lightweight `useAffiliateTracker` hook:
- Logs structured events to the developer console (`console.log('[Affiliate Click Tracker]', ...)`)
- Emits a custom DOM event (`window.addEventListener('doraemon_affiliate_click', ...)`)
- Ready to plug into Google Analytics 4 (`gtag`), Google Tag Manager (`dataLayer.push`), or Meta Pixel.

---

## ⚖️ Affiliate Disclosure
*As an affiliate, I may earn a commission from qualifying purchases at no extra cost to you.*
