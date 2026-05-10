"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";

interface VideoSectionProps {
  section: any;
  slug: string;
}

export default function VideoSection({ section, slug }: VideoSectionProps) {
  const { config, style } = section;
  const sourceType = config.sourceType || 'upload';
  const videoUrl = config.videoUrl || '';
  const autoPlay = config.autoPlay !== false;
  const [isMuted, setIsMuted] = useState(true);

  // Extract TikTok ID
  const getTikTokId = (url: string) => {
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  };

  const tikTokId = sourceType === 'tiktok' ? getTikTokId(videoUrl) : null;

  return (
    <section className={`relative py-32 overflow-hidden ${style === 'full_width' ? 'px-0' : 'px-8 max-w-[1800px] mx-auto'}`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mb-20 text-center px-8">
        {config.title && (
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500"
          >
            {config.title}
          </motion.h2>
        )}
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className={`relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] ${style === 'full_width' ? 'aspect-video w-full' : 'rounded-[4rem] aspect-video'}`}
      >
        {sourceType === 'tiktok' && tikTokId ? (
          <div className="w-full h-full flex justify-center bg-black">
             <iframe
                src={`https://www.tiktok.com/embed/v2/${tikTokId}`}
                className="w-full h-full border-none"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>
          </div>
        ) : videoUrl ? (
          <div className="relative w-full h-full bg-slate-900 group">
             <video 
               src={videoUrl}
               autoPlay={autoPlay}
               muted={isMuted}
               loop
               playsInline
               className="w-full h-full object-cover"
             />
             
             {/* Glassmorphic Controls Overlay */}
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                  <Play size={48} className="text-white fill-current ml-2" />
                </div>
             </div>

             <button 
               onClick={() => setIsMuted(!isMuted)}
               className="absolute bottom-12 right-12 z-10 w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all pointer-events-auto shadow-xl"
             >
               {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
             </button>

             <div className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] pointer-events-none">
               Premium Experience
             </div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-300 p-8 text-center border-4 border-dashed border-slate-200">
             <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mb-8 rotate-3">
                <Play size={48} className="opacity-20 text-blue-600" />
             </div>
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Video Spotlight</h3>
             <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Ready for your cinematic content</p>
          </div>
        )}
      </motion.div>

      {style === 'tiktok_style' && sourceType === 'tiktok' && (
        <div className="mt-16 flex justify-center">
           <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-slate-900/20"
           >
             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 5.35.13 10.71-.14 16.06-1.55 1.55-3.87 2.22-5.99 1.64-2.84-.64-4.87-3.52-4.38-6.37.28-2.2 1.93-4.08 4.09-4.5 1.02-.23 2.1-.11 3.03.3v-4.06c-2.45-.44-5.01-.22-7.3 1.01-1.74.96-3.13 2.5-3.83 4.36-1.34 3.73-.24 8.35 3.03 10.93 3.05 2.51 7.9 2.5 11 0 2.24-1.8 3.53-4.7 3.42-7.61V0c-1.33 0-2.67.01-4 0-.11 1.01-.64 1.97-1.47 2.58-.83.61-1.88.85-2.89.8V.02z"/></svg>
             Discover on TikTok
           </motion.a>
        </div>
      )}
    </section>
  );
}
