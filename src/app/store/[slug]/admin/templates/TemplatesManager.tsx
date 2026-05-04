"use client";

import { useState, useTransition } from "react";
import { updateActiveTemplateAction } from "../actions";
import { Check, LayoutTemplate, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AVAILABLE_TEMPLATES = [
  {
    id: "minimal",
    name: "Pure Minimal",
    description: "Stripped back to the essentials. High contrast, mono-tonal, and bold typography for high-end brands.",
    preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
  },
  {
    id: "apple",
    name: "Premium Tech",
    description: "Sleek, product-focused design with vast whitespace, clean sans-serif typography, and polished aesthetic.",
    preview: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80"
  },
  {
    id: "hybrid",
    name: "Hybrid Dark",
    description: "A perfect blend of luxury branding and high-conversion e-commerce elements.",
    preview: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
  },
  {
    id: "zenith",
    name: "Zenith Luxury",
    description: "The pinnacle of minimalist luxury. Features cinematic transitions, elegant serif typography, and a sophisticated cream palette.",
    preview: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
  },
  {
    id: "obsidian",
    name: "Obsidian Brutalist",
    description: "High-impact, modern brutalist design. Features asymmetrical layouts, dark mode aesthetics, and bold typography for boundary-pushing brands.",
    preview: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80"
  },
  {
    id: "signature",
    name: "Signature Brand",
    description: "A high-end, typography-focused template for luxury brands and signature collections.",
    preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
  },
  {
    id: "senno",
    name: "Senno Multipurpose",
    description: "A high-end, minimalist ecommerce template with a peach-pink aesthetic, serif typography, and interactive hotspots. Perfect for beauty and boutique brands.",
    preview: "https://images.unsplash.com/photo-1596462502278-27bfac4033c8?w=800&q=80"
  }
];

export default function TemplatesManager({ slug, initialTemplate }: { slug: string, initialTemplate: string }) {
  const [activeTemplate, setActiveTemplateState] = useState(initialTemplate);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSelectTemplate = (templateId: string) => {
    if (templateId === activeTemplate) return;
    
    startTransition(async () => {
      await updateActiveTemplateAction(slug, templateId);
      setActiveTemplateState(templateId);
      router.refresh();
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
          <LayoutTemplate className="w-8 h-8" /> Store Templates
        </h1>
        <p className="text-muted-foreground mt-1">Select the look and feel of your storefront.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {AVAILABLE_TEMPLATES.map((template) => {
          const isActive = activeTemplate === template.id;
          return (
            <div 
              key={template.id} 
              className={`relative bg-card rounded-2xl border-2 overflow-hidden transition-all duration-300 ${isActive ? 'border-primary shadow-xl ring-4 ring-primary/10' : 'border-border/50 shadow-sm hover:border-slate-300'}`}
            >
              {isActive && (
                <div className="absolute top-4 right-4 z-10 bg-primary text-white p-1.5 rounded-full shadow-lg">
                  <Check className="w-5 h-5" />
                </div>
              )}
              
              <div className="relative aspect-video w-full bg-slate-100">
                <Image 
                  src={template.preview} 
                  alt={template.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-primary">{template.name}</h3>
                  {isActive ? (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">ACTIVE</span>
                  ) : (
                    <button 
                      onClick={() => handleSelectTemplate(template.id)}
                      disabled={isPending}
                      className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Template'}
                    </button>
                  )}
                </div>
                <p className="text-muted-foreground">{template.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
