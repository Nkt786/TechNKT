import React, { useState } from "react";
import { PRODUCTS, PRODUCT_CATEGORIES, type Product } from "@/data/products";
import {
  LuShoppingCart,
  LuCheck,
  LuZap,
  LuArrowRight,
  LuShieldCheck,
  LuMessageCircle,
} from "react-icons/lu";

export default function HomeStoreShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addedId, setAddedId] = useState<string | null>(null);

  const displayedProducts =
    selectedCategory === "all"
      ? PRODUCTS.slice(0, 8)
      : PRODUCTS.filter((p) => p.category === selectedCategory);

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

  return (
    <div>
      {/* Category Filter Pills (Subtle claymorphic pill styling) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
                isActive ? "clay-pill-active" : "clay-pill-inactive"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid with Subtle Claymorphism: 2 cols on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {displayedProducts.map((prod) => {
          const isJustAdded = addedId === prod.id;
          const hasPrice = prod.price && prod.price > 0;

          return (
            <div
              key={prod.id}
              className="clay-card-interactive group relative flex flex-col justify-between p-2.5 sm:p-3.5"
            >
              <div>
                {/* Product Artwork Container */}
                <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-2.5 bg-[#0B101A] border border-white/5 flex items-center justify-center">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {prod.badge && (
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-semibold text-emerald-400">
                      {prod.badge}
                    </span>
                  )}
                  {prod.instant && (
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md border border-amber-400/40 text-[9px] sm:text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                      <LuZap className="size-2.5 text-amber-400" />
                      <span>INSTANT</span>
                    </div>
                  )}
                </div>

                {/* Title & Description (Only actual provided info, never placeholder) */}
                <h3 className="text-xs sm:text-sm font-semibold text-[#F4F6FA] mb-1 line-clamp-1 leading-snug group-hover:text-emerald-400 transition-colors">
                  {prod.name}
                </h3>
                {prod.description && prod.description.trim() ? (
                  <p className="text-[11px] sm:text-xs text-[#A6B1C2] line-clamp-2 leading-relaxed mb-2.5">
                    {prod.description}
                  </p>
                ) : null}

                {/* Price & Duration Row */}
                <div className="flex items-baseline gap-1.5 mb-3 flex-wrap">
                  {hasPrice ? (
                    <>
                      <span className="text-sm sm:text-base font-extrabold text-white">
                        {prod.formattedPrice}
                      </span>
                      {prod.period ? (
                        <span className="text-[10px] sm:text-[11px] text-[#A6B1C2]">
                          {prod.period}
                        </span>
                      ) : null}
                      {prod.originalPrice > prod.price && (
                        <span className="text-[10px] sm:text-xs text-[#A6B1C2]/60 line-through ml-auto">
                          {prod.formattedOriginalPrice}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400">
                      Ask for Price
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Dimensional Clay Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-white/[0.04]">
                {hasPrice ? (
                  <>
                    {/* Add to Cart button */}
                    <button
                      type="button"
                      onClick={() => addToCart(prod, false)}
                      className={`clay-btn-dark size-8 sm:size-9 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 ${
                        isJustAdded ? "border-emerald-500/50 text-emerald-400" : ""
                      }`}
                      aria-label={`Add ${prod.name} to cart`}
                      title={isJustAdded ? "Added to Cart!" : "Add to Cart"}
                    >
                      {isJustAdded ? (
                        <LuCheck className="size-4 text-emerald-400" />
                      ) : (
                        <LuShoppingCart className="size-4" />
                      )}
                    </button>

                    {/* Buy Now button */}
                    <button
                      type="button"
                      onClick={() => addToCart(prod, true)}
                      className="clay-btn-emerald flex-1 h-8 sm:h-9 rounded-lg text-xs flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
                    >
                      <LuZap className="size-3" />
                      <span>Buy now</span>
                    </button>
                  </>
                ) : (
                  <a
                    href={`https://wa.me/919822587641?text=${encodeURIComponent(
                      `Hello TechNKT, I would like to inquire about price and availability for: ${prod.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn-dark flex-1 h-8 sm:h-9 rounded-lg text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <LuMessageCircle className="size-3.5" />
                    <span>Contact Us</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions & Trust Footnote */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#A6B1C2]">
          <span className="inline-flex items-center gap-1.5">
            <LuZap className="size-3.5 text-amber-400" />
            <span>Fast Digital Delivery</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LuShieldCheck className="size-3.5 text-emerald-400" />
            <span>Full Term Replacement Warranty</span>
          </span>
        </div>

        <a
          href="/shop"
          className="clay-btn-dark text-xs sm:text-sm px-6 py-2.5 inline-flex items-center gap-2 group w-full sm:w-auto justify-center rounded-xl font-semibold"
        >
          <span>View All Products in Store</span>
          <LuArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
