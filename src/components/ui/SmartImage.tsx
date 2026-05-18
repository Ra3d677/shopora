"use client";

import React, { useState } from "react";

interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

// Intercepts and optimizes image URLs to use optimal formats, compression, and sizing
function getOptimizedUrl(url: string | null | undefined, width?: number, height?: number) {
  if (!url) return "";
  
  // If it's base64 data, return as-is
  if (url.startsWith('data:')) return url;

  // Cloudinary URL Auto-Transformations
  if (url.includes('cloudinary.com')) {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = url.slice(0, uploadIndex + 8); // includes '/upload/'
      const suffix = url.slice(uploadIndex + 8);
      
      // Inject q_auto (auto quality) and f_auto (auto format like WebP/AVIF)
      let transform = 'q_auto,f_auto';
      
      // Inject dimensions for thumbnail resizing
      if (width) {
        transform += `,w_${width}`;
      }
      if (height) {
        transform += `,h_${height}`;
      }
      
      // Ensure we don't duplicate transformations
      if (suffix.startsWith('q_auto') || suffix.includes('/q_auto')) {
        return url;
      }
      
      return `${prefix}${transform}/${suffix}`;
    }
  }

  // Unsplash URL Auto-Transformations
  if (url.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set('auto', 'format');
      urlObj.searchParams.set('q', '80');
      if (width) urlObj.searchParams.set('w', width.toString());
      if (height) urlObj.searchParams.set('h', height.toString());
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  return url;
}

export default function SmartImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80",
  width,
  height,
  loading: customLoading, // avoid conflict with loading prop
  ...props 
}: SmartImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (imgRef.current?.complete) {
      setLoading(false);
    }
    
    // Safety fallback: ensure loading spinner is removed eventually
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [src]);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const optimizedSrc = getOptimizedUrl((error || !src) ? fallbackSrc : src, width, height);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-400 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy" // Native browser lazy loading so images only load when they appear in the viewport
        {...props}
      />
    </div>
  );
}
