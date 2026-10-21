import React, { useState, useMemo, useEffect } from "react";
import {
  PRODUCT_CATEGORIES,
  PRODUCTS,
  type Product,
} from "@/data/products";
import {
  LuShoppingCart,
  LuCheck,
  LuZap,
  LuSearch,
  LuSlidersHorizontal,
  LuRotateCcw,
} from "react-icons/lu";

export default function StoreCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [addedId, setAddedId] = useState<string | null>(null);

  // Check URL search params on mount (e.g. /shop?category=subscriptions)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat && PRODUCT_CATEGORIES.some((c) => c.id === cat)) {
        setSelectedCategory(cat);
      }
    }
  }, []);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (catId === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", catId);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const addToCart = (product: Product, redirect = false) => {
    try {
      const raw = localStorage.getItem("technkt_cart");
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((i: any) => i.id === product.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.formattedPrice,
          period: product.period,
          quantity: 1,
        });
      }
      localStorage.setItem("technkt_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));

      if (redirect) {
        window.location.href = "/cart";
      } else {
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1800);
      }
    } catch (e) {
      console.error(e);
      if (redirect) window.location.href = "/cart";
    }
  };

  const activeCategoryObj = PRODUCT_CATEGORIES.find(
    (c) => c.id === selectedCategory,
  );
  const headingText =
    selectedCategory === "all"
      ? "All Products"
      : activeCategoryObj?.name || "Products";

  return (
    <div className="w-full">
      {/* ── Category Navigation Chips Row (Screenshot 4 style) ── */}
      <div className="mb-8 pt-4">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#2965E8] text-white border-[#2965E8] shadow-md shadow-blue-500/20"
                    : "bg-[#151D2B] text-[#A6B1C2] hover:text-white border-[#1E2837] hover:border-white/20"
                }`}
              >
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="size-5 object-contain shrink-0"
                />
                <span className="whitespace-nowrap">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Heading, Counter & Filter Controls Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1E2837]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-secondary text-[#F4F6FA] flex items-baseline gap-2">
            <span>{headingText}</span>
            <span className="text-xs sm:text-sm font-normal text-[#A6B1C2]">
              · {filteredAndSortedProducts.length}{" "}
              {filteredAndSortedProducts.length === 1 ? "item" : "items"}
            </span>
          </h1>
        </div>

        {/* Controls: Search & Sort */}
        <div className="flex items-center gap-3">
          {/* Compact Search Bar */}
          <div className="relative flex-1 sm:w-60">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A6B1C2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#151D2B] border border-[#1E2837] text-xs sm:text-sm text-white placeholder-[#A6B1C2]/60 focus:outline-none focus:border-[#2965E8] transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="h-9 px-3 rounded-lg bg-[#151D2B] border border-[#1E2837] text-xs sm:text-sm text-[#F4F6FA] focus:outline-none focus:border-[#2965E8] cursor-pointer"
            >
              <option value="featured">Default sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Product Grid: 2 Columns on Mobile, 4 on Desktop (Screenshot 2 & 4) ── */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mb-16">
          {filteredAndSortedProducts.map((prod) => {
            const isJustAdded = addedId === prod.id;
            return (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 bg-[#151D2B] border border-[#1E2837] hover:border-[#2965E8]/50 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div>
                  {/* Square Product Artwork */}
                  <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-2.5 bg-[#0B101A] border border-white/5 flex items-center justify-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Instant Badge */}
                    {prod.instant && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-400/40 text-[9px] sm:text-[10px] font-bold text-amber-300 tracking-wider flex items-center gap-0.5 shadow-sm">
                        <LuZap className="text-[10px] text-amber-400" />
                        <span>INSTANT</span>
                      </div>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xs sm:text-sm font-semibold text-[#F4F6FA] mb-1.5 line-clamp-2 leading-snug">
                    {prod.name}
                  </h3>

                  {/* Pricing Row */}
                  <div className="flex items-baseline gap-1.5 mb-3 flex-wrap">
                    <span className="text-sm sm:text-base font-extrabold text-[#F4F6FA]">
                      {prod.formattedPrice}
                    </span>
                    {prod.originalPrice > prod.price && (
                      <span className="text-[11px] sm:text-xs text-[#A6B1C2]/60 line-through">
                        {prod.formattedOriginalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Compact Actions Row: Cart Icon + Buy Now Button */}
                <div className="flex items-center gap-1.5 sm:gap-2 pt-1 border-t border-white/[0.04]">
                  {/* Cart Button */}
                  <button
                    type="button"
                    onClick={() => addToCart(prod, false)}
                    className={`size-8 sm:size-9 rounded-lg border flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 shrink-0 ${
                      isJustAdded
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-white/[0.04] hover:bg-[#2965E8]/20 border-[#1E2837] hover:border-[#2965E8]/40 text-[#F4F6FA]"
                    }`}
                    aria-label={`Add ${prod.name} to cart`}
                    title={isJustAdded ? "Added to Cart!" : "Add to Cart"}
                  >
                    {isJustAdded ? (
                      <LuCheck className="text-sm" />
                    ) : (
                      <LuShoppingCart className="text-sm" />
                    )}
                  </button>

                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={() => addToCart(prod, true)}
                    className="flex-1 h-8 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer active:scale-95 bg-[#2965E8] hover:bg-[#3D75F0] border border-white/10"
                  >
                    <LuZap className="size-3.5" />
                    <span>Buy now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-[#151D2B] border border-[#1E2837] my-8 max-w-lg mx-auto">
          <LuSlidersHorizontal className="size-8 mx-auto text-[#A6B1C2] mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">
            No products match your criteria
          </h3>
          <p className="text-xs text-[#A6B1C2] mb-6">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setSortBy("featured");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#1E2837] text-xs font-medium text-white transition-colors"
          >
            <LuRotateCcw className="size-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
