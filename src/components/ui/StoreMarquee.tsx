"use client";

import React from "react";

interface MarqueeItem {
  id: string;
  text: string;
}

interface StoreMarqueeProps {
  settings: {
    enabled: boolean;
    items: MarqueeItem[];
    backgroundColor: string;
    textColor: string;
    speed: number;
  };
}

export default function StoreMarquee({ settings }: StoreMarqueeProps) {
  if (!settings.enabled || settings.items.length === 0) return null;

  return (
    <div 
      className="py-3 sm:py-4 border-y flex justify-start overflow-hidden w-full"
      style={{ 
        backgroundColor: settings.backgroundColor,
        borderColor: `${settings.textColor}20` // 20% opacity of text color for border
      }}
    >
      <div 
        className="flex text-sm sm:text-base font-extrabold whitespace-nowrap hover:cursor-pointer animate-marquee"
        style={{ 
          color: settings.textColor,
          animationDuration: `${settings.speed}s`,
          width: 'max-content'
        }}
      >
        {/* Use 20 duplicates to ensure the content is always wider than any screen, making the -50% translation perfectly seamless */}
        {[...Array(20)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex gap-4 sm:gap-8 px-2 sm:px-4 items-center shrink-0">
            {settings.items.map((item) => (
              <React.Fragment key={item.id}>
                <span>{item.text}</span> 
                <span className="opacity-50">•</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
