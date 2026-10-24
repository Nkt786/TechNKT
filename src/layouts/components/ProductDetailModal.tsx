import React, { useState } from "react";
import {
  LuX,
  LuShieldCheck,
  LuZap,
  LuClock,
  LuCheck,
  LuShoppingCart,
  LuPhone,
  LuTruck,
  LuKey,
  LuInfo,
} from "react-icons/lu";

export interface VariantData {
  id: string;
  variant_name: string;
  duration_value: number;
  duration_unit: string;
  validity_description: string | null;
  price_amount: number;
  comparison_price_amount: number;
  warranty_description: string | null;
  delivery_description: string | null;
  activation_description: string | null;
  availability: string;
}

export interface DetailedProduct {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  image_url: string;
  short_description: string | null;
  description: string | null;
  badge: string | null;
  instant: number;
  variants?: VariantData[];
}

interface ProductDetailModalProps {
  product: DetailedProduct;
  onClose: () => void;
  onAddToCart: (product: any, variant: VariantData, quantity: number, redirect?: boolean) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const variants = product.variants && product.variants.length > 0 ? product.variants : [];
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const currentVariant = variants[selectedVariantIndex] || {
    id: "default",
    variant_name: "Standard",
    duration_value: 1,
    duration_unit: "month",
    validity_description: "30 Days",
    price_amount: 99,
    comparison_price_amount: 199,
    warranty_description: "Replacement Warranty for full validity",
    delivery_description: "Instant Auto-Delivery via WhatsApp / Email",
    activation_description: "Direct Activation with Dedicated Credentials",
    availability: "in_stock",
  };

  const handleAddToCart = (redirect = false) => {
    onAddToCart(product, currentVariant, quantity, redirect);
    if (!redirect) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleWhatsAppOrder = () => {
    const waText = `*TechNKT Order Enquiry*
Hello TechNKT Team,

I would like to order:
*Product:* ${product.name}
*Plan:* ${currentVariant.variant_name}
*Price:* ₹${currentVariant.price_amount}/-
*Quantity:* ${quantity}
*Total:* ₹${currentVariant.price_amount * quantity}/-

Please confirm availability and the next steps. Thank you!`;

    const waUrl = `https://wa.me/919822587641?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#151D2B] border border-[#1E2837] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E2837] flex items-center justify-between bg-[#111724]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              {product.category_id}
            </span>
            {product.badge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                {product.badge}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A6B1C2] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <LuX className="size-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Section: Image & Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-start">
            {/* Artwork */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#0B101A] border border-[#1E2837] flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.instant && (
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-300 tracking-wider flex items-center gap-1 shadow-md">
                  <LuZap className="text-xs text-amber-400" />
                  <span>INSTANT</span>
                </div>
              )}
            </div>

            {/* Title, Pricing & Variant Selection */}
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-secondary text-[#F4F6FA] mb-1.5">
                  {product.name}
                </h2>
                {product.short_description && (
                  <p className="text-xs sm:text-sm text-[#A6B1C2] leading-relaxed">
                    {product.short_description}
                  </p>
                )}
              </div>

              {/* Dynamic Price Display */}
              <div className="flex items-baseline gap-2.5">
                {currentVariant.price_amount > 0 ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#F4F6FA]">
                      ₹{currentVariant.price_amount}
                    </span>
                    {currentVariant.comparison_price_amount > currentVariant.price_amount && (
                      <span className="text-sm text-[#A6B1C2]/60 line-through">
                        ₹{currentVariant.comparison_price_amount}
                      </span>
                    )}
                    {currentVariant.comparison_price_amount > currentVariant.price_amount && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Save ₹{currentVariant.comparison_price_amount - currentVariant.price_amount}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                    Ask for Price / Contact Us
                  </span>
                )}
              </div>

              {/* Variant Selector */}
              {variants.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-2">
                    Select Plan / Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {variants.map((v, idx) => {
                      const isSelected = selectedVariantIndex === idx;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#2965E8]/20 border-[#2965E8] text-white shadow-sm"
                              : "bg-[#0B101A] border-[#1E2837] text-[#A6B1C2] hover:text-white"
                          }`}
                        >
                          <div className="font-semibold text-xs">{v.variant_name}</div>
                          <div className="text-xs font-bold text-white mt-0.5">₹{v.price_amount}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-[#A6B1C2]">Quantity:</label>
                <div className="flex items-center rounded-lg bg-[#0B101A] border border-[#1E2837] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="size-6 rounded text-white/80 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="size-6 rounded text-white/80 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {currentVariant.price_amount > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(false)}
                        className={`flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                          justAdded
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "clay-btn-dark"
                        }`}
                      >
                        {justAdded ? <LuCheck className="text-sm" /> : <LuShoppingCart className="text-sm" />}
                        <span>{justAdded ? "Added to Cart!" : "Add to Cart"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(true)}
                        className="flex-1 h-10 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 clay-btn-emerald"
                      >
                        <LuZap className="size-4" />
                        <span>Buy Now</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleWhatsAppOrder}
                      className="w-full h-10 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] transition-all cursor-pointer"
                    >
                      <LuPhone className="size-3.5" />
                      <span>Order on WhatsApp (+91 9822587641)</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 clay-btn-emerald transition-all cursor-pointer"
                  >
                    <LuPhone className="size-4" />
                    <span>Ask for Price / Inquire via WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Structured Specifications Grid */}
          <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-[#A6B1C2] flex items-center gap-1">
                <LuClock className="size-3 text-[#2965E8]" />
                <span>Validity</span>
              </span>
              <span className="font-semibold text-white block">
                {currentVariant.validity_description || `${currentVariant.duration_value} ${currentVariant.duration_unit}`}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#A6B1C2] flex items-center gap-1">
                <LuShieldCheck className="size-3 text-emerald-400" />
                <span>Warranty</span>
              </span>
              <span className="font-semibold text-white block">
                {currentVariant.warranty_description || "Standard TechNKT Replacement"}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#A6B1C2] flex items-center gap-1">
                <LuTruck className="size-3 text-purple-400" />
                <span>Delivery Method</span>
              </span>
              <span className="font-semibold text-white block">
                {currentVariant.delivery_description || "WhatsApp / Email Delivery"}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[#A6B1C2] flex items-center gap-1">
                <LuKey className="size-3 text-amber-400" />
                <span>Activation</span>
              </span>
              <span className="font-semibold text-white block">
                {currentVariant.activation_description || "Instant Auto-Delivery"}
              </span>
            </div>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <LuInfo className="size-3.5 text-[#2965E8]" />
                <span>Product Description & Terms</span>
              </h4>
              <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-[#A6B1C2] leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

          {/* Important Customer Notice */}
          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[#A6B1C2] space-y-1">
            <span className="font-semibold text-white block">⚡ No login or OTP required</span>
            <p>
              Your digital product credentials will be delivered directly through your chosen contact method (WhatsApp, Email or Telegram) once placed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
