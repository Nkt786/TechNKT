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
  LuEye,
} from "react-icons/lu";
import ProductDetailModal, { type DetailedProduct, type VariantData } from "./ProductDetailModal";

export default function StoreCatalog() {
  const [categories, setCategories] = useState(PRODUCT_CATEGORIES);
  const [productsList, setProductsList] = useState<any[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<DetailedProduct | null>(null);

  // Fetch real database products on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products && data.products.length > 0) {
          // Map database products to UI format
          const mapped = data.products.map((p: any) => {
            const primaryVar = p.variants?.[0] || {};
            const minPrice = p.variants?.length
              ? Math.min(...p.variants.map((v: any) => v.price_amount))
              : p.price_amount || 0;
            const hasValidPrice = minPrice > 0;
            const compPrice = primaryVar.comparison_price_amount || 0;

            return {
              id: p.id,
              name: p.name,
              category: p.category_id,
              image: p.image_url,
              image_url: p.image_url,
              price: minPrice,
              hasValidPrice,
              originalPrice: compPrice,
              formattedPrice: hasValidPrice ? `₹${minPrice}` : "Ask for Price",
              formattedOriginalPrice: (hasValidPrice && compPrice > minPrice) ? `₹${compPrice}` : "",
              period: primaryVar.duration_unit ? `/${primaryVar.duration_unit}` : "",
              instant: Boolean(p.instant),
              badge: p.badge,
              description: p.description || p.short_description || "",
              short_description: p.short_description || "",
              featured: Boolean(p.featured),
              variants: p.variants || [],
            };
          });
          setProductsList(mapped);
        }
        if (data.success && data.categories && data.categories.length > 0) {
          const allCat = { id: "all", name: "All", icon: "/images/categories/category-all.svg" };
          const rest = data.categories.map((c: any) => ({
            id: c.id,
            name: c.name,
            icon: c.icon || "/images/categories/category-subscriptions.svg",
          }));
          setCategories([allCat, ...rest]);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch dynamic products, using fallback:", err);
      });
  }, []);

  // Check URL search params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      if (cat) {
        setSelectedCategory(cat);
      }
      const q = params.get("search") || params.get("q");
      if (q) {
        setSearchQuery(q);
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
    let result = [...productsList];

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
          p.category.toLowerCase().includes(query)
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
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  const addToCart = (product: any, variant?: VariantData, qty = 1, redirect = false) => {
    try {
      const raw = localStorage.getItem("technkt_cart");
      const cart = raw ? JSON.parse(raw) : [];

      const targetVariant = variant || product.variants?.[0] || {
        id: `var_${product.id}_def`,
        variant_name: "Standard",
        price_amount: product.price,
      };

      const cartItemKey = `${product.id}__${targetVariant.id}`;
      const existing = cart.find((i: any) => i.cartKey === cartItemKey || (i.id === product.id && i.variant_id === targetVariant.id));

      if (existing) {
        existing.quantity = (existing.quantity || 1) + qty;
      } else {
        cart.push({
          cartKey: cartItemKey,
          id: product.id,
          variant_id: targetVariant.id,
          name: product.name,
          variant_name: targetVariant.variant_name,
          price: `₹${targetVariant.price_amount}`,
          priceAmount: targetVariant.price_amount,
          period: product.period || "/mo",
          quantity: qty,
          image: product.image,
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

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const headingText =
    selectedCategory === "all"
      ? "All Products"
      : activeCategoryObj?.name || "Products";

  return (
    <div className="w-full">
      {/* ── Category Navigation Chips Row ── */}
      <div className="mb-8 pt-4">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? "clay-pill-active"
                    : "clay-pill-inactive"
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

      {/* ── Product Grid: 2 Columns on Mobile, 4 on Desktop ── */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mb-16">
          {filteredAndSortedProducts.map((prod) => {
            const isJustAdded = addedId === prod.id;
            return (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 clay-card-interactive"
              >
                <div>
                  {/* Square Product Artwork - Click to open details */}
                  <div
                    onClick={() => setSelectedProductForModal(prod)}
                    className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-2.5 bg-[#0B101A] border border-white/5 flex items-center justify-center cursor-pointer"
                  >
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

                    {/* Hover Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                      <LuEye className="size-4" />
                      <span>Details</span>
                    </div>
                  </div>

                  {/* Product Title - Click to open details */}
                  <h3
                    onClick={() => setSelectedProductForModal(prod)}
                    className="text-xs sm:text-sm font-semibold text-[#F4F6FA] mb-1.5 line-clamp-2 leading-snug cursor-pointer hover:text-emerald-400 transition-colors"
                  >
                    {prod.name}
                  </h3>

                  {/* Pricing Row */}
                  <div className="flex items-baseline gap-1.5 mb-3 flex-wrap">
                    {prod.hasValidPrice ? (
                      <>
                        <span className="text-sm sm:text-base font-extrabold text-[#F4F6FA]">
                          {prod.formattedPrice}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-[11px] sm:text-xs text-[#A6B1C2]/60 line-through">
                            {prod.formattedOriginalPrice}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-emerald-400">
                        Ask for Price
                      </span>
                    )}
                  </div>
                </div>

                {/* Compact Actions Row: Cart Icon + Buy Now Button OR Inquire Button */}
                <div className="flex items-center gap-1.5 sm:gap-2 pt-1 border-t border-white/[0.04]">
                  {prod.hasValidPrice ? (
                    <>
                      {/* Cart Button */}
                      <button
                        type="button"
                        onClick={() => addToCart(prod, undefined, 1, false)}
                        className={`size-8 sm:size-9 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 shrink-0 ${
                          isJustAdded
                            ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                            : "clay-btn-dark"
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

                      {/* Buy Now Button - Opens modal or directly checks out */}
                      <button
                        type="button"
                        onClick={() => {
                          if (prod.variants && prod.variants.length > 1) {
                            setSelectedProductForModal(prod);
                          } else {
                            addToCart(prod, undefined, 1, true);
                          }
                        }}
                        className="flex-1 h-8 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer active:scale-95 clay-btn-emerald"
                      >
                        <LuZap className="size-3.5" />
                        <span>Buy now</span>
                      </button>
                    </>
                  ) : (
                    <a
                      href={`https://wa.me/917860999000?text=${encodeURIComponent(`Hi TechNKT, I would like to inquire about pricing and availability for ${prod.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-8 sm:h-9 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer clay-btn-emerald"
                    >
                      <span>Inquire / Contact</span>
                    </a>
                  )}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#1E2837] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <LuRotateCcw className="size-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={(product, variant, qty, redirect) => {
            addToCart(product, variant, qty, redirect);
            if (!redirect) {
              setSelectedProductForModal(null);
            }
          }}
        />
      )}
    </div>
  );
}
