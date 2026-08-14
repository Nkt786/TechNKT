'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product, CATEGORIES } from '@/data/products';
import { useCheckout } from './CheckoutContext';
import { useCart } from './CartContext';
import { 
  Search, AlertCircle, ShoppingCart, Star, Zap, ShieldCheck, 
  X, SlidersHorizontal, ChevronDown, LayoutGrid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductImage from './ProductImage';

interface CatalogProps {
  products: Product[];
}

export default function Catalog({ products }: CatalogProps) {
  const { openCheckout } = useCheckout();
  const { addToCart } = useCart();
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState<string>('all');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [customPriceRange, setCustomPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [minRating, setMinRating] = useState<number | null>(null);
  const [onlyInstantDelivery, setOnlyInstantDelivery] = useState(false);
  const [onlyFullWarranty, setOnlyFullWarranty] = useState(false);
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);
  
  // View mode for Desktop: 'grid' or 'list'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sorting & Pagination States
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');
  const [visibleCount, setVisibleCount] = useState(12);

  // Mobile filters drawer toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Calculate live category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    CATEGORIES.forEach(cat => {
      counts[cat] = products.filter(p => p.category === cat).length;
    });
    return counts;
  }, [products]);

  // Handle custom price apply
  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minPriceInput ? parseFloat(minPriceInput) : null;
    const max = maxPriceInput ? parseFloat(maxPriceInput) : null;
    setCustomPriceRange({ min, max });
    setSelectedPriceBracket('custom');
    setVisibleCount(12);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPriceBracket('all');
    setMinPriceInput('');
    setMaxPriceInput('');
    setCustomPriceRange({ min: null, max: null });
    setMinRating(null);
    setOnlyInstantDelivery(false);
    setOnlyFullWarranty(false);
    setOnlyBestSellers(false);
    setSortBy('featured');
    setVisibleCount(12);
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches = 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // 2. Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Price Bracket
      if (selectedPriceBracket === 'under500' && product.price >= 500) return false;
      if (selectedPriceBracket === '500-1500' && (product.price < 500 || product.price > 1500)) return false;
      if (selectedPriceBracket === '1500-5000' && (product.price < 1500 || product.price > 5000)) return false;
      if (selectedPriceBracket === '5000plus' && product.price < 5000) return false;
      if (selectedPriceBracket === 'custom') {
        if (customPriceRange.min !== null && product.price < customPriceRange.min) return false;
        if (customPriceRange.max !== null && product.price > customPriceRange.max) return false;
      }

      // 4. Star Rating
      const pseudoRating = 4.5 + ((product.id.charCodeAt(0) % 5) * 0.1);
      if (minRating !== null && pseudoRating < minRating) return false;

      // 5. Delivery & Warranty Flags
      if (onlyInstantDelivery && product.price > 8000) return false;
      if (onlyFullWarranty && product.warranty && !product.warranty.toLowerCase().includes('warranty')) return false;
      if (onlyBestSellers && !product.isPopular && !product.slug.includes('netflix')) return false;

      return true;
    });
  }, [
    products, searchQuery, selectedCategory, selectedPriceBracket, 
    customPriceRange, minRating, onlyInstantDelivery, onlyFullWarranty, onlyBestSellers
  ]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
    if (sortBy === 'discount') {
      return list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const displayedProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount);
  }, [sortedProducts, visibleCount]);

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    selectedPriceBracket !== 'all' || 
    searchQuery.trim() !== '' || 
    minRating !== null ||
    onlyInstantDelivery ||
    onlyFullWarranty ||
    onlyBestSellers;

  return (
    <div id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      
      {/* =========================================================================
          TOP SEARCH & HORIZONTALLY SCROLLABLE PILL BAR
      ========================================================================= */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm space-y-3.5">
        
        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(12); }}
              placeholder="Search: Netflix, Claude Pro, Canva, Developer keys..."
              className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-10 text-xs md:text-sm outline-none transition-all text-foreground placeholder-muted-foreground focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Desktop & Mobile Toolbar */}
          <div className="flex items-center gap-2.5 shrink-0 justify-between md:justify-end">
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-foreground shadow-sm cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />
              <span>Filters</span>
              {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
            </button>

            {/* Desktop View Mode Toggle: Grid vs List */}
            <div className="hidden sm:flex items-center border border-border rounded-xl bg-background p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-indigo-500/10 text-indigo-500' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-indigo-500/10 text-indigo-500' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-bold text-foreground outline-none focus:border-indigo-500 cursor-pointer pr-7 appearance-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Avg. Rating</option>
                <option value="discount">Discount %</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            onClick={() => setSelectedPriceBracket(selectedPriceBracket === 'under500' ? 'all' : 'under500')}
            className={`shrink-0 rounded-full px-3.5 py-1 text-[11px] font-bold transition-all border cursor-pointer ${
              selectedPriceBracket === 'under500'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/45 hover:text-foreground'
            }`}
          >
            Under ₹500
          </button>

          <button
            onClick={() => setSelectedPriceBracket(selectedPriceBracket === '500-1500' ? 'all' : '500-1500')}
            className={`shrink-0 rounded-full px-3.5 py-1 text-[11px] font-bold transition-all border cursor-pointer ${
              selectedPriceBracket === '500-1500'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/45 hover:text-foreground'
            }`}
          >
            ₹500 - ₹1,500
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'AI Assistant Tools' ? 'All' : 'AI Assistant Tools')}
            className={`shrink-0 rounded-full px-3.5 py-1 text-[11px] font-bold transition-all border cursor-pointer ${
              selectedCategory === 'AI Assistant Tools'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/45 hover:text-foreground'
            }`}
          >
            ⚡ AI Tools
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'OTT Video Entertainment' ? 'All' : 'OTT Video Entertainment')}
            className={`shrink-0 rounded-full px-3.5 py-1 text-[11px] font-bold transition-all border cursor-pointer ${
              selectedCategory === 'OTT Video Entertainment'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/45 hover:text-foreground'
            }`}
          >
            🎬 OTT Subscriptions
          </button>

          <button
            onClick={() => setOnlyBestSellers(!onlyBestSellers)}
            className={`shrink-0 rounded-full px-3.5 py-1 text-[11px] font-bold transition-all border cursor-pointer ${
              onlyBestSellers
                ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/45 hover:text-foreground'
            }`}
          >
            🔥 Best Sellers
          </button>

          <button
            onClick={() => setOnlyInstantDelivery(!onlyInstantDelivery)}
            className={`shrink-0 rounded-full px-3.5 py-1 text-[11px] font-bold transition-all border cursor-pointer ${
              onlyInstantDelivery
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/45 hover:text-foreground'
            }`}
          >
            ⚡ Instant Delivery
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="shrink-0 text-[11px] font-bold text-rose-500 hover:text-rose-600 underline cursor-pointer px-2"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Results summary string */}
        <div className="text-xs text-muted-foreground pt-1 border-t border-border flex justify-between items-center">
          <div>
            Showing <span className="font-bold text-foreground">1–{Math.min(displayedProducts.length, sortedProducts.length)}</span> of <span className="font-bold text-foreground">{sortedProducts.length}</span> digital products
          </div>
          <span className="text-[11px] text-muted-foreground/80 hidden sm:inline">
            Click product title to view full features & specs
          </span>
        </div>

      </div>

      {/* =========================================================================
          2-COLUMN LAYOUT: FILTER SIDEBAR & PRODUCTS CONTAINER
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* --- LEFT FILTER SIDEBAR (3 cols on desktop) --- */}
        <aside className={`lg:col-span-3 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-6 shadow-sm sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-500" />
                Department Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] font-bold text-muted-foreground hover:text-rose-500 uppercase transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-foreground/90 uppercase tracking-wider">
                Category
              </h4>
              <div className="space-y-1 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                <button
                  onClick={() => { setSelectedCategory('All'); setVisibleCount(12); }}
                  className={`flex items-center justify-between w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-black'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] font-mono text-muted-foreground/80">({categoryCounts['All']})</span>
                </button>

                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setVisibleCount(12); }}
                      className={`flex items-center justify-between w-full py-1.5 px-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-black'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0">({categoryCounts[cat] || 0})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Brackets */}
            <div className="space-y-3 pt-3 border-t border-border">
              <h4 className="text-[11px] font-black text-foreground/90 uppercase tracking-wider">
                Price
              </h4>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under500', label: 'Under ₹500' },
                  { id: '500-1500', label: '₹500 to ₹1,500' },
                  { id: '1500-5000', label: '₹1,500 to ₹5,000' },
                  { id: '5000plus', label: '₹5,000 & Above' },
                ].map((bracket) => (
                  <label 
                    key={bracket.id}
                    onClick={() => { setSelectedPriceBracket(bracket.id); setVisibleCount(12); }}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-foreground py-1 select-none"
                  >
                    <input
                      type="radio"
                      name="priceBracket"
                      checked={selectedPriceBracket === bracket.id}
                      onChange={() => {}}
                      className="accent-indigo-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className={selectedPriceBracket === bracket.id ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}>
                      {bracket.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Custom Min / Max Input Form */}
              <form onSubmit={handleApplyCustomPrice} className="pt-2 flex items-center gap-2">
                <input
                  type="number"
                  placeholder="₹ Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-1/2 rounded-lg border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="₹ Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-1/2 rounded-lg border border-border bg-background p-2 text-xs text-foreground outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-muted hover:bg-muted/80 border border-border text-xs font-bold text-foreground px-3 py-2 transition-all cursor-pointer"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Customer Reviews */}
            <div className="space-y-2.5 pt-3 border-t border-border">
              <h4 className="text-[11px] font-black text-foreground/90 uppercase tracking-wider">
                Customer Reviews
              </h4>
              <div className="space-y-1.5">
                {[4, 3].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => { setMinRating(minRating === stars ? null : stars); setVisibleCount(12); }}
                    className={`flex items-center gap-2 w-full py-1 text-xs text-left cursor-pointer transition-colors ${
                      minRating === stars ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < stars ? 'fill-current' : 'text-zinc-350 dark:text-zinc-700'}`} />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Trust Flags */}
            <div className="space-y-2.5 pt-3 border-t border-border">
              <h4 className="text-[11px] font-black text-foreground/90 uppercase tracking-wider">
                Delivery & Trust
              </h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <label className="flex items-center gap-2.5 cursor-pointer hover:text-foreground select-none">
                  <input
                    type="checkbox"
                    checked={onlyInstantDelivery}
                    onChange={(e) => { setOnlyInstantDelivery(e.target.checked); setVisibleCount(12); }}
                    className="accent-indigo-500 rounded h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500 fill-current" />
                    Instant Delivery
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer hover:text-foreground select-none">
                  <input
                    type="checkbox"
                    checked={onlyFullWarranty}
                    onChange={(e) => { setOnlyFullWarranty(e.target.checked); setVisibleCount(12); }}
                    className="accent-indigo-500 rounded h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    100% Warranty
                  </span>
                </label>
              </div>
            </div>

          </div>
        </aside>

        {/* --- RIGHT COLUMN: PRODUCT CARDS DISPLAY --- */}
        <section className="lg:col-span-9 space-y-6">
          
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border rounded-3xl p-12 text-center space-y-4 shadow-sm"
              >
                <AlertCircle className="h-12 w-12 text-indigo-500 mx-auto" />
                <h3 className="font-extrabold text-foreground text-lg">No products found matching your filters</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Try clearing your search terms or relaxing your price/category filters to view available licenses.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white px-5 py-2.5 transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                }
              >
                {displayedProducts.map((product, idx) => {
                  const mrp = Math.round(product.price * 1.6);
                  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);
                  const pseudoReviewsCount = 45 + (product.id.charCodeAt(0) % 180);
                  const isChoice = product.isPopular || idx === 0;

                  return (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm hover:border-indigo-500/40 hover:shadow-indigo-500/5 transition-all duration-300 ${
                        viewMode === 'list' 
                          ? 'flex flex-col sm:flex-row gap-5 items-center' 
                          : 'flex flex-col justify-between'
                      }`}
                    >
                      {/* =========================================================================
                          MOBILE VIEW: EXACT AMAZON HORIZONTAL CARD LAYOUT
                      ========================================================================= */}
                      <div className="flex md:hidden gap-3.5 items-start w-full">
                        
                        {/* Left Side: Thumbnail */}
                        <Link 
                          href={`/${product.slug}`}
                          className="w-28 h-28 shrink-0 rounded-xl overflow-hidden border border-border block relative bg-muted"
                        >
                          <ProductImage slug={product.slug} name={product.name} />
                          {isChoice && (
                            <span className="absolute top-1 left-1 bg-[#FDF6E2] dark:bg-[#232F3E] text-amber-700 dark:text-amber-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm border border-amber-250 dark:border-none">
                              Choice
                            </span>
                          )}
                        </Link>

                        {/* Right Side: Details & Actions */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          
                          {/* Title */}
                          <Link href={`/${product.slug}`} className="block group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                            <h3 className="font-extrabold text-xs text-foreground line-clamp-2 leading-snug">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 text-xs">
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground">4.9 ({pseudoReviewsCount})</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-foreground">₹{product.price}</span>
                            <span className="text-[10px] text-rose-500 font-bold">-{discountPercent}%</span>
                            <span className="text-[9px] text-muted-foreground line-through">₹{mrp}</span>
                          </div>

                          {/* Delivery tag */}
                          <div className="text-[9px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                            <Zap className="h-2.5 w-2.5 fill-current" /> Instant Delivery
                          </div>

                          {/* Buttons */}
                          <div className="pt-1.5 grid grid-cols-2 gap-2">
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full flex items-center justify-center gap-1 rounded-lg border border-border bg-background hover:bg-muted text-[10px] font-extrabold text-foreground py-1.5 cursor-pointer shadow-sm transition-all"
                            >
                              <ShoppingCart className="h-3 w-3 text-indigo-500" />
                              Add
                            </button>
                            <button
                              onClick={() => openCheckout(product)}
                              className="w-full flex items-center justify-center gap-1 rounded-lg bg-primary hover:bg-primary/95 text-[10px] font-extrabold text-white py-1.5 cursor-pointer shadow-md transition-all"
                            >
                              Buy
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* =========================================================================
                          DESKTOP VIEW: ELEGANT GRID / LIST CARD DISPLAY
                      ========================================================================= */}
                      <div className="hidden md:flex flex-col justify-between w-full h-full">
                        
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            {isChoice ? (
                              <span className="bg-[#FDF6E2] dark:bg-[#232F3E] border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm">
                                TechNKT Choice
                              </span>
                            ) : (
                              <span className="bg-muted border border-border text-muted-foreground text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                {product.duration} Plan
                              </span>
                            )}

                            {product.warranty && (
                              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                                {product.warranty.replace('Warranty', 'Wty')}
                              </span>
                            )}
                          </div>

                          {/* Banner Image */}
                          <Link href={`/${product.slug}`} className="block mb-3 border border-border/80 rounded-xl overflow-hidden bg-muted">
                            <ProductImage slug={product.slug} name={product.name} />
                          </Link>

                          {/* Details */}
                          <div className="space-y-1.5">
                            <Link href={`/${product.slug}`} className="block group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                              <h3 className="font-extrabold text-sm text-foreground line-clamp-2 leading-snug">
                                {product.name}
                              </h3>
                            </Link>

                            <div className="flex items-center gap-1.5 text-xs">
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                                ))}
                              </div>
                              <span className="text-[11px] font-bold text-foreground">4.9</span>
                              <span className="text-[10px] text-muted-foreground">({pseudoReviewsCount} reviews)</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Actions Bottom Box */}
                        <div className="pt-4 mt-4 border-t border-border space-y-3">
                          <div className="flex items-baseline justify-between">
                            <div className="space-y-0.5">
                              <div className="flex items-baseline gap-2">
                                <span className="text-rose-500 text-xs font-black">-{discountPercent}%</span>
                                <span className="text-xl font-black text-foreground">₹{product.price}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                M.R.P.: <span className="line-through">₹{mrp}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 justify-end">
                                <Zap className="h-3 w-3 fill-current" /> Instant
                              </span>
                              <span className="text-[9px] text-muted-foreground">WhatsApp Delivery</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-bold text-foreground py-2.5 shadow-sm transition-all cursor-pointer"
                            >
                              <ShoppingCart className="h-3.5 w-3.5 text-indigo-500" />
                              Add to Cart
                            </button>

                            <button
                              onClick={() => openCheckout(product)}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/95 text-xs font-extrabold text-white py-2.5 shadow-sm transition-all cursor-pointer"
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>

                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Load More Pagination */}
          {sortedProducts.length > visibleCount && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="rounded-xl border border-border bg-card hover:bg-muted px-8 py-3 text-xs font-extrabold text-foreground transition-all cursor-pointer shadow-sm"
              >
                Load Next 9 Products ({sortedProducts.length - visibleCount} Remaining)
              </button>
            </div>
          )}

        </section>

      </div>

    </div>
  );
}
