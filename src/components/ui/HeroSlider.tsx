"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Banner } from "@/lib/types";
import SmartImage from "./SmartImage";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSliderProps {
  banners: Banner[];
  slug: string;
  settings?: {
    autoPlay?: boolean;
    interval?: number;
    transition?: 'slide' | 'fade';
    showArrows?: boolean;
    showDots?: boolean;
  };
}

export default function HeroSlider({ banners = [], slug, settings }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    if (!banners || banners.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  }, [banners?.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (settings?.autoPlay && banners.length > 1) {
      const timer = setInterval(nextSlide, settings.interval || 5000);
      return () => clearInterval(timer);
    }
  }, [settings?.autoPlay, settings?.interval, nextSlide, banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden group min-h-[500px] md:h-[600px] lg:h-[700px] bg-white dark:bg-black">
      <AnimatePresence initial={false} mode="wait">
        {banners.map((banner, index) => (
          index === currentIndex && (
            <motion.div
              key={banner.id}
              initial={settings?.transition === 'fade' ? { opacity: 0 } : { x: '100%' }}
              animate={settings?.transition === 'fade' ? { opacity: 1 } : { x: 0 }}
              exit={settings?.transition === 'fade' ? { opacity: 0 } : { x: '-100%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 z-0">
                {/* Desktop Image */}
                <SmartImage
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="hidden md:block w-full h-full object-cover"
                />
                {/* Mobile Image (Fallback to Desktop if no mobile image provided) */}
                <SmartImage
                  src={banner.mobileImageUrl || banner.imageUrl}
                  alt={banner.title}
                  className="md:hidden w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="max-w-4xl"
                >
                  <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 italic leading-none">
                    {banner.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                    {banner.subtitle}
                  </p>
                  
                  {/* Button is rendered here if position is center (default flow) */}
                  {banner.showButton !== false && banner.buttonText && (!banner.buttonPosition || banner.buttonPosition === 'center') && (
                    <Link
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className={`inline-flex items-center gap-4 px-12 py-5 text-xs font-black uppercase tracking-widest transition-all shadow-2xl ${
                        banner.buttonShape === 'square' ? 'rounded-none' : banner.buttonShape === 'rounded' ? 'rounded-xl' : 'rounded-full'
                      } ${
                        banner.buttonColor === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                        banner.buttonColor === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' :
                        banner.buttonColor === 'black' ? 'bg-black text-white hover:bg-neutral-900' :
                        banner.buttonColor === 'transparent' ? 'bg-transparent text-white border-2 border-white hover:bg-white/10' :
                        'bg-white text-black hover:bg-slate-100'
                      }`}
                    >
                      {banner.buttonText} <ArrowRight size={18} />
                    </Link>
                  )}
                </motion.div>
                
                {/* Button is rendered here with absolute positioning if it's not center */}
                {banner.showButton !== false && banner.buttonText && banner.buttonPosition && banner.buttonPosition !== 'center' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className={`absolute z-20 ${
                      banner.buttonPosition === 'top' ? 'top-8 left-1/2 -translate-x-1/2' :
                      banner.buttonPosition === 'bottom' ? 'bottom-20 left-1/2 -translate-x-1/2' :
                      banner.buttonPosition === 'left' ? 'left-8 top-1/2 -translate-y-1/2' :
                      banner.buttonPosition === 'right' ? 'right-8 top-1/2 -translate-y-1/2' :
                      banner.buttonPosition === 'bottom-left' ? 'bottom-20 left-8' :
                      banner.buttonPosition === 'bottom-right' ? 'bottom-20 right-8' : ''
                    }`}
                  >
                    <Link
                      href={banner.buttonLink || `/store/${slug}/products`}
                      className={`inline-flex items-center gap-4 px-12 py-5 text-xs font-black uppercase tracking-widest transition-all shadow-2xl ${
                        banner.buttonShape === 'square' ? 'rounded-none' : banner.buttonShape === 'rounded' ? 'rounded-xl' : 'rounded-full'
                      } ${
                        banner.buttonColor === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                        banner.buttonColor === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' :
                        banner.buttonColor === 'black' ? 'bg-black text-white hover:bg-neutral-900' :
                        banner.buttonColor === 'transparent' ? 'bg-transparent text-white border-2 border-white hover:bg-white/10' :
                        'bg-white text-black hover:bg-slate-100'
                      }`}
                    >
                      {banner.buttonText} <ArrowRight size={18} />
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Navigation Arrows */}
      {settings?.showArrows && banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-8 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-8 -translate-y-1/2 z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {settings?.showDots && banners.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-white w-12' : 'bg-white/30 w-6 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
