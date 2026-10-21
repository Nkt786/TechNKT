import React, { useState, useEffect } from "react";
import { LuUserRound, LuShoppingCart } from "react-icons/lu";

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
    <div className="flex items-center gap-2 sm:gap-2.5">
      {/* Account Button (Desktop Only - Account is in Mobile Bottom Nav on small screens) */}
      <a
        href="/account"
        className="hidden lg:inline-flex group relative items-center justify-center gap-2 h-9 px-4 rounded-xl bg-primary hover:bg-primary-light border border-white/10 text-white text-xs font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0"
        aria-label="Account"
      >
        <LuUserRound className="text-sm transition-transform group-hover:scale-105" />
        <span>Account</span>
      </a>

      {/* Cart Button (Clean, compact, functional on all screens) */}
      <a
        href="/cart"
        className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 px-2.5 sm:px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-border hover:border-white/20 text-white text-xs font-medium transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0"
        aria-label={`Cart with ${cartCount} items`}
      >
        <LuShoppingCart className="text-sm text-text group-hover:text-white transition-colors" />
        <span className="inline-flex items-center justify-center min-w-[19px] h-4.5 px-1 rounded-md bg-primary text-white text-[10px] font-bold">
          {cartCount}
        </span>
      </a>
    </div>
  );
}
