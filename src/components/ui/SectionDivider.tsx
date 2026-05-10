"use client";

import React from "react";

interface SectionDividerProps {
  style: string;
  color?: string;
}

export default function SectionDivider({ style, color = "currentColor" }: SectionDividerProps) {
  switch (style) {
    case "wave":
      return (
        <div className="w-full overflow-hidden leading-none rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ color }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "curve":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ color }}>
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "triangle":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ color }}>
            <path d="M1200 0L0 0 598.97 114.72 1200 0z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "zigzag":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]" style={{ color }}>
            <path d="M0 0L60 120L120 0L180 120L240 0L300 120L360 0L420 120L480 0L540 120L600 0L660 120L720 0L780 120L840 0L900 120L960 0L1020 120L1080 0L1140 120L1200 0V120H0V0Z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "geometric":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ color }}>
             <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,0V120H0Z" opacity=".25" fill="currentColor"></path>
             <path d="M0,0V15.81c13,36.92,27.64,56.86,47.69,72.05,37.52,28.48,96.2,33.41,143,12,49.23-22.51,74.17-70.15,124.09-80.71,59.15-12.52,114.42,48,174.51,59.06,70.77,13,147.43-16.72,218.4-38.56,80.35-24.71,164.67-42.33,249.86-27.33,36,6.33,73.7,19.33,104.45,29.34C1127,25,1193,0,1200,0V120H0Z" opacity=".5" fill="currentColor"></path>
             <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "arabic_pattern":
      return (
        <div className="w-full flex justify-center py-8 opacity-20 pointer-events-none overflow-hidden" style={{ color }}>
           <div className="flex gap-4">
              {[...Array(20)].map((_, i) => (
                <svg key={i} className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                   <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
                   <circle cx="12" cy="12" r="4" />
                </svg>
              ))}
           </div>
        </div>
      );
    case "minimal_dots":
      return (
        <div className="w-full flex justify-center py-12 gap-8" style={{ color }}>
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-2 h-2 rounded-full bg-current opacity-20" />
           ))}
        </div>
      );
    case "slash":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ color }}>
            <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "fan":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[100px]" style={{ color }}>
            <path d="M600 120C268.63 120 0 72.75 0 14.46V0H1200V14.46C1200 72.75 931.37 120 600 120Z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "drops":
      return (
        <div className="w-full flex justify-center py-12 gap-12" style={{ color }}>
           {[...Array(4)].map((_, i) => (
             <div key={i} className="w-3 h-3 rounded-full bg-current opacity-10 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
           ))}
        </div>
      );
    case "mountains":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ color }}>
            <path d="M1200 0L0 0 292.15 114.21 600 0 907.85 114.21 1200 0z" fill="currentColor" opacity=".3"></path>
            <path d="M1200 0L0 0 598.97 114.72 1200 0z" fill="currentColor"></path>
          </svg>
        </div>
      );
    case "steps":
      return (
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]" style={{ color }}>
             <path d="M0 0H200V40H400V80H600V120H1200V0H0Z" fill="currentColor" opacity=".1" />
             <path d="M0 0H100V20H200V40H300V60H400V80H500V100H600V120H1200V0H0Z" fill="currentColor" opacity=".2" />
          </svg>
        </div>
      );
    default:
      return <div className="h-24 w-full" />;
  }
}
