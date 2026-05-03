"use client";

import React, { useState } from "react";

interface SmartImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export default function SmartImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80",
  ...props 
}: SmartImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (imgRef.current?.complete) {
      setLoading(false);
    }
    
    // Safety fallback: ensure image is always shown even if events fail
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [src]);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-slate-200 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-400 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={(error || !src) ? fallbackSrc : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
}
