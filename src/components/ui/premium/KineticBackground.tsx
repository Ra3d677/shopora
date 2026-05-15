"use client";
import { useEffect } from "react";

export default function KineticBackground() {
  useEffect(() => {
    // We only attach this listener once globally
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      });
    };
    
    // Initial center position just in case
    document.documentElement.style.setProperty('--mouse-x', `50vw`);
    document.documentElement.style.setProperty('--mouse-y', `50vh`);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return null;
}
