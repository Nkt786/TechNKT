import React, { useState } from "react";
import { PRODUCTS, type Product } from "@/data/products";
import { LuShoppingCart, LuCheck, LuZap } from "react-icons/lu";

export default function ProductCards() {
  const [addedId, setAddedId] = useState<string | null>(null);

  // Show top featured picks
  const featuredProducts = PRODUCTS.filter((p) => p.featured);

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
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 mb-9">
      {featuredProducts.map((prod) => {
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
                {prod.instant && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-amber-400/40 text-[9px] sm:text-[10px] font-bold text-amber-300 tracking-wider flex items-center gap-0.5 shadow-sm">
                    <LuZap className="text-[10px] text-amber-400" />
                    <span>INSTANT</span>
                  </div>
                )}
              </div>

              {/* Product Name */}
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

            {/* Action Buttons: Cart Icon + Buy Now Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 pt-1 border-t border-white/[0.04]">
              {/* Add to Cart button */}
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

              {/* Buy Now button */}
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
  );
}
