'use client';

import React, { useState, useMemo } from 'react';
import { Product, CATEGORIES } from '@/data/products';
import { useCheckout } from './CheckoutContext';
import Link from 'next/link';
import { 
  Search, AlertCircle, ShoppingBag, Eye, RefreshCw, Star, 
  Zap, User, Code, Palette, Tv, Layers, Shield, Phone, 
  Globe, Camera, Heart, ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductImage from './ProductImage';

interface CatalogProps {
  products: Product[];
}

export default function Catalog({ products }: CatalogProps) {
  const { openCheckout } = useCheckout();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePill, setActivePill] = useState('All'); // All, Popular, New, Best Seller
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset pagination on filter change
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(12);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12);
  };

  // Map category names to shorter display labels and icons
  const categoryDetails = (cat: string) => {
    switch (cat) {
      case 'AI Assistant Tools': 
        return { label: 'AI Tools', icon: <Zap className="h-3.5 w-3.5" />, badge: 'NEW' };
      case 'LinkedIn Premium Services': 
        return { label: 'LinkedIn', icon: <User className="h-3.5 w-3.5" /> };
      case 'Developer & VPS Software': 
        return { label: 'Developer Tools', icon: <Code className="h-3.5 w-3.5" /> };
      case 'Creative Cloud Software': 
        return { label: 'Creative Software', icon: <Palette className="h-3.5 w-3.5" /> };
      case 'OTT Video Entertainment': 
        return { label: 'OTT Subscriptions', icon: <Tv className="h-3.5 w-3.5" /> };
      case 'Music Premium Slots': 
        return { label: 'Music Premium', icon: <Layers className="h-3.5 w-3.5" /> };
      case 'VPN & Security Services': 
        return { label: 'VPN Services', icon: <Shield className="h-3.5 w-3.5" /> };
      case 'Telecom Recharges': 
        return { label: 'Telecom Recharges', icon: <Phone className="h-3.5 w-3.5" /> };
      case 'E-commerce & Web': 
        return { label: 'E-commerce & Web', icon: <Globe className="h-3.5 w-3.5" /> };
      case 'Social Media Boosters': 
        return { label: 'Social Media', icon: <Camera className="h-3.5 w-3.5" /> };
      case 'Health & Diagnostic Services': 
        return { label: 'Health & Diagnostic', icon: <Heart className="h-3.5 w-3.5" /> };
      default: 
        return { label: cat, icon: <Layers className="h-3.5 w-3.5" /> };
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .filter((product) => {
        // Filter pills logic
        if (activePill === 'Popular') return product.isPopular;
        if (activePill === 'Best Seller') return product.slug.includes('netflix') || product.slug.includes('premium') || product.isPopular;
        if (activePill === 'New Arrivals') return product.slug.includes('claude') || product.slug.includes('cursor') || product.slug.includes('copilot');
        if (activePill === 'On Sale') return product.price < 500;
        return true; // 'All'
      });
  }, [products, searchQuery, selectedCategory, activePill]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  return (
    <div id="products" className="scroll-mt-24 max-w-7xl mx-auto px-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Categories Sidebar (3 cols on desktop) */}
        <aside className="lg:col-span-3 space-y-4 sticky top-24">
          <div className="bg-[#0C0D14]/80 border border-zinc-900 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
              <Layers className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Categories</h3>
            </div>
            
            <div className="flex flex-col gap-1">
              {/* All Categories Trigger */}
              <button
                onClick={() => handleCategorySelect('All')}
                className={`flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-xs font-bold transition-all text-left cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-purple-650/10 text-purple-400 border border-purple-500/20'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4" />
                  <span>All Categories</span>
                </div>
              </button>

              {/* Loop Category List */}
              {CATEGORIES.map((cat) => {
                const details = categoryDetails(cat);
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`flex items-center justify-between w-full rounded-xl px-3 py-2.5 text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-purple-650/10 text-purple-400 border border-purple-500/20'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-purple-400' : 'text-zinc-500'}>
                        {details.icon}
                      </span>
                      <span className="truncate">{details.label}</span>
                    </div>
                    {details.badge && (
                      <span className="text-[8px] font-black tracking-widest text-purple-400 bg-purple-650/15 border border-purple-650/30 px-1.5 py-0.5 rounded leading-none">
                        {details.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* View All Categories Button */}
            <button
              onClick={() => handleCategorySelect('All')}
              className="w-full text-center rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] py-2.5 text-xs font-black text-white shadow-md transition-all cursor-pointer"
            >
              View All Categories
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Search, Tabs & Products Panel (9 cols on desktop) */}
        <section className="lg:col-span-9 space-y-6">
          
          {/* Dashboard Wide Search Bar */}
          <div className="relative shadow-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products, tools, subscriptions..."
              className="w-full rounded-xl border border-zinc-900 bg-[#0C0D14] py-3.5 pl-4 pr-10 text-sm outline-none transition-all text-white placeholder-zinc-400 focus:border-zinc-800"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>

          {/* Filters Pills Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-3">
            <div className="flex flex-wrap gap-2">
              {['All', 'Popular', 'New Arrivals', 'Best Seller', 'On Sale'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setActivePill(pill)}
                  className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    activePill === pill
                      ? 'bg-[#7C3AED] text-white shadow-md'
                      : 'bg-[#0C0D14] border border-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => {
                setActivePill('All');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              View All Products
            </button>
          </div>

          {/* Cards Grid */}
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center space-y-3"
              >
                <AlertCircle className="h-10 w-10 text-zinc-650" />
                <h3 className="font-extrabold text-white text-base">No products found</h3>
                <p className="text-xs text-zinc-500 max-w-sm">
                  We couldn't find any products matching your search criteria. Try checking your keyword spelling or reset all filters.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {displayedProducts.map((product) => {
                  const hasTag = product.isPopular || product.price < 300 || product.slug.includes('netflix');
                  const tagText = product.isPopular ? 'Popular' : product.slug.includes('netflix') ? 'Best Seller' : 'Hot Deal';
                  
                  // Branded outline borders matching card accent
                  const getCardBorder = (slug: string) => {
                    if (slug.includes('canva')) return 'border-purple-600/30 hover:border-purple-500/70 shadow-purple-500/5';
                    if (slug.includes('netflix')) return 'border-red-600/30 hover:border-red-500/70 shadow-red-500/5';
                    if (slug.includes('claude')) return 'border-amber-600/30 hover:border-amber-500/70 shadow-amber-500/5';
                    if (slug.includes('spotify')) return 'border-emerald-600/30 hover:border-emerald-500/70 shadow-emerald-500/5';
                    if (slug.includes('vpn') || slug.includes('jio')) return 'border-blue-600/30 hover:border-blue-500/70 shadow-blue-500/5';
                    return 'border-zinc-900 hover:border-purple-600/40 shadow-purple-600/5';
                  };

                  // Internal ambient card glowing spots (Canva/Claude style)
                  const getGlowColor = (slug: string) => {
                    if (slug.includes('canva')) return 'from-purple-600/10 via-blue-600/5 to-transparent';
                    if (slug.includes('netflix')) return 'from-red-600/10 via-purple-600/5 to-transparent';
                    if (slug.includes('claude')) return 'from-amber-650/10 via-orange-600/5 to-transparent';
                    if (slug.includes('spotify')) return 'from-emerald-500/10 via-teal-500/5 to-transparent';
                    if (slug.includes('vpn') || slug.includes('jio')) return 'from-blue-600/10 via-indigo-600/5 to-transparent';
                    return 'from-purple-600/8 via-transparent to-transparent';
                  };

                  const borderClass = getCardBorder(product.slug);
                  const glowGradient = getGlowColor(product.slug);
                  
                  const tagColor = product.isPopular 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-550/20' 
                    : product.slug.includes('netflix') 
                      ? 'bg-red-500/10 text-red-550 border-red-550/20' 
                      : 'bg-purple-500/10 text-purple-400 border-purple-550/20';

                  return (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -6, scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-[#0C0D14]/90 p-6 shadow-2xl transition-all duration-300 ${borderClass}`}
                    >
                      {/* Ambient card background glow spot */}
                      <div className={`absolute bottom-[-10%] right-[-10%] w-36 h-36 rounded-full bg-gradient-to-br ${glowGradient} opacity-40 blur-2xl group-hover:opacity-80 transition-opacity pointer-events-none`} />

                      <div className="space-y-4 relative z-10">
                        {/* Center Product Illustration / Cover */}
                        <div className="relative">
                          <ProductImage slug={product.slug} name={product.name} />
                          {hasTag && (
                            <span className={`absolute top-2.5 right-2.5 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagColor} z-10 backdrop-blur-md`}>
                              {tagText}
                            </span>
                          )}
                        </div>

                        {/* Title and duration info */}
                        <div>
                          <h3 className="font-extrabold text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-[10px] text-purple-400 mt-0.5 font-bold uppercase tracking-wider">
                            {product.duration} Access
                          </p>
                        </div>

                        {/* Key Features lists */}
                        <div className="space-y-1.5 pt-0.5">
                          {product.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex gap-2 items-center text-[10px] text-zinc-300">
                              <span className="h-1 w-1 rounded-full bg-purple-500 shrink-0" />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer: pricing and action CTA */}
                      <div className="space-y-3.5 pt-4 mt-4 border-t border-zinc-900/60 relative z-10">
                        <div className="flex justify-between items-baseline">
                          <div className="text-zinc-400 text-[10px] font-black uppercase tracking-wider">
                            Price
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-sm font-black text-white">₹{product.price}</span>
                              <span className="text-[10px] text-zinc-500 line-through">₹{Math.round(product.price * 1.5)}</span>
                            </div>
                          </div>
                          {product.warranty && (
                            <span className="text-[9px] font-bold uppercase bg-emerald-500/10 border border-emerald-550/20 text-emerald-450 px-2 py-0.5 rounded-full">
                              {product.warranty.replace('Warranty', 'Wty')}
                            </span>
                          )}
                        </div>

                        {/* Primary Order Action Button */}
                        <button
                          onClick={() => openCheckout(product)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-bold text-white py-3 cursor-pointer shadow-md hover:shadow-lg shadow-purple-600/10 transition-all"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Order Now
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination load more */}
          {filteredProducts.length > visibleCount && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="rounded-xl border border-zinc-900 bg-[#0C0D14] hover:bg-zinc-900 px-6 py-2.5 text-xs font-bold text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                Show More Products
              </button>
            </div>
          )}

        </section>

      </div>

    </div>
  );
}
