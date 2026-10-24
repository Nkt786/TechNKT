import React from "react";
import { LuZap, LuCodeXml, LuSmartphone, LuLaptop, LuSparkles } from "react-icons/lu";

export default function HeroVisualComposition() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:max-w-none group select-none">
      {/* ── Soft Ambient Backlight Glow (Subtle Slate/Emerald, Zero Neon) ── */}
      <div
        className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, rgba(41, 101, 232, 0.12) 40%, transparent 75%)",
        }}
      />

      {/* ── Main Web Studio Browser Composition (~60% emphasis) ── */}
      <div className="relative rounded-2xl bg-[#151D2B] border border-[#1E2837] p-2.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:-translate-y-1">
        
        {/* Desktop Browser Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#1E2837] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="px-3 py-1 rounded-md bg-[#0B101A] border border-[#1E2837] text-[#A6B1C2] text-[11px] font-mono tracking-tight flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            <span>technkt.in/web-development</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
            <LuLaptop className="size-3.5" />
            <span className="hidden sm:inline">Web Studio</span>
          </div>
        </div>

        {/* Browser Content Area: Web Studio Showcase Visual */}
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0B101A] border border-white/5">
          <img
            src="/images/technkt-webdev-showcase.jpg"
            alt="TechNKT Custom Modern Web Development Showcase"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
            loading="eager"
          />

          {/* In-Preview Floating Badge: Web Architecture */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-1 rounded-md bg-[#0B101A]/90 border border-white/10 backdrop-blur-md text-[10px] sm:text-[11px] text-[#F4F6FA] flex items-center gap-1.5 shadow-md">
            <LuCodeXml className="size-3.5 text-emerald-400" />
            <span className="font-semibold">Custom Web Architecture</span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B101A]/90 border border-white/10 backdrop-blur-md text-[10px] text-[#A6B1C2]">
            <LuSparkles className="size-3 text-amber-400" />
            <span>Fast · Responsive · Modern</span>
          </div>
        </div>

        {/* ── Layered Floating Smartphone / Digital Store Card (~40% emphasis) ── */}
        <div className="absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-4 w-44 sm:w-52 rounded-2xl bg-[#0B101A] border border-white/15 p-2 sm:p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 z-20">
          {/* Mobile Screen Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#1E2837] text-[10px] text-[#A6B1C2]">
            <div className="flex items-center gap-1 text-[#F4F6FA] font-bold">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>Digital Store</span>
            </div>
            <LuSmartphone className="size-3 text-[#A6B1C2]" />
          </div>

          {/* Compact Product Card on Mobile */}
          <div className="rounded-lg bg-[#151D2B] border border-[#1E2837] p-1.5">
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-[#0B101A] mb-1.5">
              <img
                src="/images/products/netflix.jpg"
                alt="Netflix Premium 4K UHD Pass"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/85 text-[8px] font-bold text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                <LuZap className="size-2 text-amber-300" />
                <span>INSTANT</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-[#F4F6FA] leading-tight truncate">
                  Netflix 4K UHD
                </p>
                <p className="text-[11px] font-bold text-white">
                  ₹139 <span className="text-[8px] text-[#A6B1C2] font-normal">/mo</span>
                </p>
              </div>
              <a
                href="/shop"
                className="h-6 px-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold flex items-center justify-center transition-colors"
              >
                Buy
              </a>
            </div>
          </div>
        </div>

        {/* ── Layered Floating Combo Badge (Top-Right) ── */}
        <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#151D2B]/95 border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.65)] backdrop-blur-xl flex items-center gap-2 sm:gap-2.5 transition-transform duration-300 group-hover:-translate-y-1 z-20">
          <div className="size-7 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black">
            <img
              src="/images/products/2-in-1-combo.jpg"
              alt="2-in-1 Combo Pack"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[11px] font-semibold text-[#F4F6FA]">
                2-in-1 Combo Pack
              </p>
              <LuZap className="size-3 text-amber-400 shrink-0" />
            </div>
            <p className="text-[10px] text-[#A6B1C2]">
              Netflix + Prime · <span className="text-white font-bold">₹215</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
