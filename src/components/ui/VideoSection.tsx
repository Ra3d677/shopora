"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, ExternalLink, X } from "lucide-react";

interface VideoSectionProps {
  section: any;
  slug: string;
}

export default function VideoSection({ section, slug }: VideoSectionProps) {
  const { config, style } = section;
  const videos = Array.isArray(config.videos) ? config.videos : (config.videoUrl ? [{ url: config.videoUrl, sourceType: config.sourceType || 'upload' }] : []);
  
  return (
    <section className={`relative py-32 overflow-hidden ${style === 'full_width' ? 'px-0' : 'px-8 max-w-[1800px] mx-auto'}`}>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mb-20 text-center px-8">
        {config.title && (
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6"
          >
            {config.title}
          </motion.h2>
        )}
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
      </div>

      <div className={`grid gap-8 ${videos.length === 1 ? 'grid-cols-1' : videos.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {videos.map((video: any, idx: number) => (
          <VideoCard key={idx} video={video} style={style} />
        ))}
        
        {videos.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200">
             <Play size={48} className="mx-auto mb-4 text-slate-300" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Add videos to this gallery</p>
          </div>
        )}
      </div>
    </section>
  );
}

function VideoCard({ video, style }: { video: any, style: string }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const getEmbedInfo = (url: string) => {
    if (!url) return null;

    // TikTok
    const tiktokMatch = url.match(/\/video\/(\d+)/);
    if (tiktokMatch) return { type: 'tiktok', id: tiktokMatch[1], embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` };

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (ytMatch) return { type: 'youtube', id: ytMatch[1], embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };

    // Default: Direct Video
    return { type: 'upload', url };
  };

  const info = getEmbedInfo(video.url);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`relative group overflow-hidden bg-slate-900 shadow-2xl rounded-[2.5rem] aspect-[9/16] md:aspect-video ${style === 'full_width' ? 'rounded-none' : ''}`}
    >
      {info?.type === 'tiktok' || info?.type === 'youtube' ? (
        <iframe
          src={info.embedUrl}
          className="w-full h-full border-none"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : video.url ? (
        <>
          <video 
            src={video.url}
            autoPlay={true}
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <button 
             onClick={() => setIsMuted(!isMuted)}
             className="absolute bottom-6 right-6 z-10 w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all shadow-xl"
           >
             {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
           </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-50">
           <Play size={40} className="mb-4 opacity-20" />
           <p className="text-xs font-black uppercase tracking-widest">Video Missing</p>
        </div>
      )}

      {/* Info Overlay */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
         {info?.type === 'youtube' && (
           <div className="bg-red-600 text-white p-1.5 rounded-lg shadow-lg">
             <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
               <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
             </svg>
           </div>
         )}
         {info?.type === 'tiktok' && <div className="bg-black text-white p-1.5 rounded-lg shadow-lg"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 5.35.13 10.71-.14 16.06-1.55 1.55-3.87 2.22-5.99 1.64-2.84-.64-4.87-3.52-4.38-6.37.28-2.2 1.93-4.08 4.09-4.5 1.02-.23 2.1-.11 3.03.3v-4.06c-2.45-.44-5.01-.22-7.3 1.01-1.74.96-3.13 2.5-3.83 4.36-1.34 3.73-.24 8.35 3.03 10.93 3.05 2.51 7.9 2.5 11 0 2.24-1.8 3.53-4.7 3.42-7.61V0c-1.33 0-2.67.01-4 0-.11 1.01-.64 1.97-1.47 2.58-.83.61-1.88.85-2.89.8V.02z"/></svg></div>}
         {info?.type === 'upload' && <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-lg"><Play size={14} /></div>}
      </div>
    </motion.div>
  );
}
