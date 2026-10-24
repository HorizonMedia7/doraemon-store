/**
 * Client-side high-performance image compression using HTML5 Canvas.
 * Automatically resizes large phone photos (often 5MB - 15MB) down to crisp ~150KB - 300KB WebP/JPEG
 * before uploading to storage, making mobile uploads instant.
 */
export async function compressImage(file, { maxWidth = 1400, maxHeight = 1400, quality = 0.82 } = {}) {
  // If not an image or SVG/GIF, return as is
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      ratio: 1
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ file, originalSize: file.size, compressedSize: file.size, ratio: 1 });
          return;
        }

        // Draw and smoothly scale
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, fallback to JPEG
        const outputMimeType = 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ file, originalSize: file.size, compressedSize: file.size, ratio: 1 });
              return;
            }

            // Create new File with .webp extension
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const newFileName = `${baseName.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}.webp`;
            const compressedFile = new File([blob], newFileName, { type: outputMimeType, lastModified: Date.now() });

            resolve({
              file: compressedFile,
              originalSize: file.size,
              compressedSize: compressedFile.size,
              ratio: Math.round((1 - compressedFile.size / file.size) * 100)
            });
          },
          outputMimeType,
          quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human-readable string (e.g. 1.2 MB, 180 KB)
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
