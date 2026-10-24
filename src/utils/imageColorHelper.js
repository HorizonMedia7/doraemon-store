/**
 * Utility to analyze an image and detect whether its dominant background/visible tone
 * is strictly 'white', 'black', or 'grey'.
 */

const toneCache = new Map();

export async function detectImageTone(imageSrc) {
  if (!imageSrc) return 'white';
  if (toneCache.has(imageSrc)) {
    return toneCache.get(imageSrc);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    // Fast fallback timer in case of slow network/CORS hang
    const timer = setTimeout(() => {
      toneCache.set(imageSrc, 'white');
      resolve('white');
    }, 700);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          toneCache.set(imageSrc, 'white');
          return resolve('white');
        }

        const w = 48;
        const h = 48;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const { data } = ctx.getImageData(0, 0, w, h);
        let totalLum = 0;
        let borderLum = 0;
        let borderPixels = 0;
        let validPixels = 0;
        let whitePixels = 0;
        let blackPixels = 0;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // Ignore transparent / semi-transparent pixels
            if (a < 35) continue;

            validPixels++;
            // ITU-R BT.601 standard perceived luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            totalLum += lum;

            // Sample border pixels (outer 4 perimeter rows/cols where background sits)
            const isBorder = x < 4 || x >= w - 4 || y < 4 || y >= h - 4;
            if (isBorder) {
              borderLum += lum;
              borderPixels++;
            }

            if (lum >= 210) {
              whitePixels++;
            } else if (lum <= 45) {
              blackPixels++;
            }
          }
        }

        if (validPixels === 0) {
          toneCache.set(imageSrc, 'white');
          return resolve('white');
        }

        const avgBorder = borderPixels > 0 ? borderLum / borderPixels : totalLum / validPixels;
        const whiteRatio = whitePixels / validPixels;
        const blackRatio = blackPixels / validPixels;

        let tone = 'grey';

        // 1. If border is predominantly bright or white pixels dominate -> White
        if (avgBorder >= 200 || whiteRatio >= 0.45) {
          tone = 'white';
        }
        // 2. If border is predominantly dark or black pixels dominate -> Black
        else if (avgBorder <= 50 || blackRatio >= 0.45) {
          tone = 'black';
        }
        // 3. Otherwise mid-tone -> Grey
        else {
          tone = 'grey';
        }

        toneCache.set(imageSrc, tone);
        resolve(tone);
      } catch {
        // Fallback on CORS canvas error to clean white
        toneCache.set(imageSrc, 'white');
        resolve('white');
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      toneCache.set(imageSrc, 'white');
      resolve('white');
    };
  });
}
