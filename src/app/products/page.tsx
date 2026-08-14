import React from 'react';
import Catalog from '@/components/Catalog';
import { PRODUCTS } from '@/data/products';
import { Zap, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Digital Marketplace & Subscriptions - TechNKT",
  description: "Explore 100+ verified software licenses, OTT entertainment slots, AI API credits, and developer tools with Amazon-style filtering, instant delivery, and 100% warranty.",
};

export default function ProductsPage() {
  return (
    <div className="relative overflow-hidden w-full space-y-12 pb-24 pt-8">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none -z-10 h-full opacity-60" />

      {/* Ambient Glows */}
      <div className="absolute top-[8%] left-[-8%] w-[650px] h-[650px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[35%] right-[-8%] w-[650px] h-[650px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none -z-10 animate-pulse" />

      {/* Header */}
      <div className="mx-auto max-w-5xl px-6 space-y-4 text-center">
        <div className="inline-flex items-center gap-3 rounded-full bg-card border border-border px-4 py-1.5 text-xs font-bold text-foreground/80 shadow-sm">
          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Zap className="h-3.5 w-3.5 fill-current" /> Instant Delivery
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% Replacement Warranty
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          Digital Subscriptions & <br />
          <span className="text-indigo-600 dark:text-indigo-400">
            Software Marketplace
          </span>
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Filter by price, category, customer ratings, and delivery speeds. All licenses are verified and delivered directly to your WhatsApp.
        </p>
      </div>

      {/* Catalog Component */}
      <Catalog products={PRODUCTS} />
    </div>
  );
}
