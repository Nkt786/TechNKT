import React, { useState, useEffect } from "react";
import { LuUserRound, LuShoppingCart, LuSearch } from "react-icons/lu";

export default function HeaderAccountCart() {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const readCart = () => {
      try {
        const raw =
          localStorage.getItem("technkt_cart") ||
          localStorage.getItem("cart");
        if (!raw) {
          setCartCount(0);
          return;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const count = parsed.reduce(
            (total: number, item: any) => total + (item.quantity || 1),
            0
          );
          setCartCount(count);
        } else if (typeof parsed === "number") {
          setCartCount(parsed);
        } else if (parsed && typeof parsed.count === "number") {
          setCartCount(parsed.count);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };

    readCart();
    window.addEventListener("storage", readCart);
    window.addEventListener("cart-updated", readCart);

    return () => {
      window.removeEventListener("storage", readCart);
      window.removeEventListener("cart-updated", readCart);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
      {/* Search Button (Accessible on both mobile and desktop, min 44x44px tap target) */}
      <a
        href="/shop"
        className="group relative flex items-center justify-center size-11 sm:size-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[#A6B1C2] hover:text-white transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0"
        aria-label="Search Products & Services"
        title="Search Products & Services"
      >
        <LuSearch className="size-5 transition-transform duration-200 group-hover:scale-110" />
      </a>

      {/* Account Button (Desktop: visible in top bar; Mobile: available in bottom nav & menu) */}
      <a
        href="/account"
        className="hidden lg:inline-flex group relative items-center justify-center gap-2 h-10 px-4 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-white text-xs font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0"
        aria-label="Account & Orders"
      >
        <LuUserRound className="size-4 text-emerald-400 transition-transform group-hover:scale-105" />
        <span>Account</span>
      </a>

      {/* Cart Button (Accessible on all screens, min 44x44px tap target) */}
      <a
        href="/cart"
        className="group relative flex items-center justify-center gap-2 h-11 min-w-[44px] px-3 sm:h-10 sm:px-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-xs font-medium transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0"
        aria-label={`Cart with ${cartCount} items`}
      >
        <LuShoppingCart className="size-5 text-[#F4F6FA] group-hover:text-emerald-400 transition-colors" />
        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-500 text-black text-[11px] font-extrabold shadow-sm">
          {cartCount}
        </span>
      </a>
    </div>
  );
}
