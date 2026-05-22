import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Banner } from "@/lib/types";

interface BannerButtonProps {
  banner: any; // We use any because the templates map over any[] currently
  slug: string;
}

export default function BannerButton({ banner, slug }: BannerButtonProps) {
  if (banner.showButton === false || !banner.buttonText) {
    return null;
  }

  const baseClasses = "inline-flex items-center gap-4 px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all shadow-xl";
  
  const shapeClasses = 
    banner.buttonShape === 'square' ? 'rounded-none' : 
    banner.buttonShape === 'rounded' ? 'rounded-xl' : 
    'rounded-full';

  const colorClasses = 
    banner.buttonColor === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
    banner.buttonColor === 'secondary' ? 'bg-slate-800 text-white hover:bg-slate-900' :
    banner.buttonColor === 'black' ? 'bg-black text-white hover:bg-neutral-900' :
    banner.buttonColor === 'transparent' ? 'bg-transparent text-white border-2 border-white hover:bg-white/10' :
    'bg-white text-black hover:bg-slate-100';

  const btnContent = (
    <Link
      href={banner.buttonLink || `/store/${slug}/products`}
      className={`${baseClasses} ${shapeClasses} ${colorClasses}`}
    >
      {banner.buttonText} <ArrowRight size={16} />
    </Link>
  );

  if (!banner.buttonPosition || banner.buttonPosition === 'center') {
    return <div className="mt-6 bg-white dark:bg-black">{btnContent}</div>;
  }

  const positionClasses = 
    banner.buttonPosition === 'top' ? 'top-8 left-1/2 -translate-x-1/2' :
    banner.buttonPosition === 'bottom' ? 'bottom-8 left-1/2 -translate-x-1/2' :
    banner.buttonPosition === 'left' ? 'left-8 top-1/2 -translate-y-1/2' :
    banner.buttonPosition === 'right' ? 'right-8 top-1/2 -translate-y-1/2' :
    banner.buttonPosition === 'bottom-left' ? 'bottom-8 left-8' :
    banner.buttonPosition === 'bottom-right' ? 'bottom-8 right-8' : '';

  return (
    <div className={`absolute z-20 ${positionClasses}`}>
      {btnContent}
    </div>
  );
}
