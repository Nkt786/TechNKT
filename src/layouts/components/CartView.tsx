import React, { useState, useEffect } from "react";
import { LuTrash2, LuShoppingBag, LuShieldCheck, LuZap, LuArrowRight } from "react-icons/lu";

interface CartItem {
  id: string;
  name: string;
  price: string;
  period?: string;
  quantity: number;
}

export default function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    try {
      const raw = localStorage.getItem("technkt_cart") || localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("storage", loadCart);
    window.addEventListener("cart-updated", loadCart);
    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cart-updated", loadCart);
    };
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setItems(updated);
    localStorage.setItem("technkt_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("technkt_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const parsePrice = (priceStr: string) => {
    const num = Number(priceStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + parsePrice(item.price) * (item.quantity || 1),
    0
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-[#DAD4DE]">
        <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center">
        <div className="size-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-6 text-[#937AFF] text-3xl shadow-[0_0_30px_rgba(147,122,255,0.2)]">
          <LuShoppingBag />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-[#DAD4DE]/70 mb-8 max-w-md mx-auto">
          Looks like you haven't added any subscriptions or digital services to your cart yet.
        </p>
        <a
          href="/shop"
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <span>Explore Digital Store</span>
          <LuArrowRight className="text-base" />
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
      {/* Items List */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl p-5 bg-[#0B0C17]/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#937AFF]/20 border border-[#937AFF]/40 text-[#C4B5FD] font-semibold">
                  Instant Auto-Delivery
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <p className="text-sm font-semibold text-[#A78BFA] mt-0.5">
                {item.price} {item.period || ""}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5">
              <div className="flex items-center rounded-full bg-white/[0.05] border border-white/10 px-2 py-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, -1)}
                  className="size-7 rounded-full text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm font-bold transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold text-white">
                  {item.quantity || 1}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, 1)}
                  className="size-7 rounded-full text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>

              <span className="text-lg font-bold text-white min-w-16 text-right">
                ₹{(parsePrice(item.price) * (item.quantity || 1)).toLocaleString()}
              </span>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="size-9 rounded-full text-[#DAD4DE]/60 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                title="Remove item"
              >
                <LuTrash2 className="text-base" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="lg:col-span-1">
        <div className="rounded-2xl p-6 sm:p-7 bg-light border border-border relative">
          <h3 className="text-xl font-bold text-white mb-5 pb-3 border-b border-border">
            Order Summary
          </h3>

          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-text">
              <span>Items Total ({items.reduce((t, i) => t + (i.quantity || 1), 0)})</span>
              <span className="font-semibold text-white">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text">
              <span>Delivery Fee</span>
              <span className="text-emerald-400 font-semibold">FREE (Instant)</span>
            </div>
            <div className="flex justify-between text-text">
              <span>Replacement Warranty</span>
              <span className="text-primary font-semibold">100% Included</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-baseline">
              <span className="text-base font-bold text-white">Total Amount</span>
              <span className="text-2xl font-extrabold text-white">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          <a
            href="https://wa.me/?text=Hello%20TechNKT,%20I%20want%20to%20complete%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn btn-primary py-3 rounded-xl text-center font-bold text-white inline-flex items-center justify-center gap-2 mb-4"
          >
            <span>Proceed to Checkout</span>
            <LuArrowRight className="text-base" />
          </a>

          <div className="space-y-2 text-xs text-text-dark pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <LuZap className="text-primary shrink-0" />
              <span>Instant credential auto-delivery via email & dashboard.</span>
            </div>
            <div className="flex items-center gap-2">
              <LuShieldCheck className="text-primary shrink-0" />
              <span>Backed by 24×7 customer support & warranty.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
