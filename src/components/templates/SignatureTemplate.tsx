"use client";
import React from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";

// Safe Error Boundary
class SectionErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { 
    if (this.state.hasError) return <div className="p-10 text-center text-sm font-bold text-slate-400">Section temporarily unavailable.</div>; 
    return this.props.children; 
  }
}

export default function SignatureTemplate({ slug, settings, products }: any) {
  return (
    <div className="relative w-full font-sans overflow-hidden bg-white">
      {/* Header */}
      <section className="py-20 px-8 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tighter">{settings.storeName || "Store"}</h1>
      </section>

      {/* Products Section */}
      <SectionErrorBoundary>
        <section className="py-16 px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 uppercase">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products?.map((product: any) => (
              <Link href={`/store/${slug}/product/${product.id}`} key={product.id} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-slate-100">
                   <SmartImage src={product.images?.[0] || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
                </div>
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-slate-500">${product.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </SectionErrorBoundary>
    </div>
  );
}