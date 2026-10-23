import React from "react";
import { LuZap, LuCodeXml, LuSmartphone, LuLaptop } from "react-icons/lu";

export default function HeroVisualComposition() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:max-w-none group select-none">
      {/* ── Soft Ambient Backlight Glow (Subtle Slate-Blue, Zero Neon) ── */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-75"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(41, 101, 232, 0.22) 0%, rgba(30, 40, 55, 0.15) 50%, transparent 75%)",
        }}
      />

      {/* ── Main Composition Container ── */}
      <div className="relative rounded-2xl bg-[#151D2B] border border-[#1E2837] p-3 sm:p-4 shadow-[0_24px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:-translate-y-1">
        
        {/* Desktop Browser Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2837] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="px-3 py-1 rounded-md bg-[#0B101A] border border-[#1E2837] text-[#A6B1C2] text-[11px] font-mono tracking-tight flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#2965E8]" />
            <span>technkt.in/store</span>
          </div>
          <div className="flex items-center gap-2 text-[#A6B1C2] text-[11px]">
            <LuLaptop className="size-3.5" />
            <span className="hidden sm:inline">Web Studio</span>
          </div>
        </div>

        {/* Browser Content Area: Real Web Studio Showcase Visual */}
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#0B101A] border border-white/5">
          <img
            src="/images/technkt-webdev-showcase.jpg"
            alt="TechNKT Custom Web Development & Commerce Architecture"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
            loading="eager"
          />

          {/* In-Preview Floating Badge: Web Architecture */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#0B101A]/90 border border-[#1E2837] backdrop-blur-md text-[11px] text-[#F4F6FA] flex items-center gap-1.5 shadow-md">
            <LuCodeXml className="size-3.5 text-[#2965E8]" />
            <span className="font-medium">Modern Astro & Next.js Builds</span>
          </div>
        </div>

        {/* ── Layered Floating Smartphone Mockup (Overlapping Bottom-Left) ── */}
        <div className="absolute -bottom-6 -left-3 sm:-left-6 w-44 sm:w-52 rounded-2xl bg-[#0B101A] border border-white/15 p-2 sm:p-2.5 shadow-[0_16px_36px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 z-20">
          {/* Mobile Screen Header */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#1E2837] text-[10px] text-[#A6B1C2]">
            <div className="flex items-center gap-1 text-[#F4F6FA] font-bold">
              <span className="size-1.5 rounded-full bg-[#2965E8]" />
              <span>TechNKT Store</span>
            </div>
            <LuSmartphone className="size-3" />
          </div>

          {/* Compact Product Card on Mobile */}
          <div className="rounded-lg bg-[#151D2B] border border-[#1E2837] p-1.5">
            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-[#0B101A] mb-1.5">
              <img
                src="/images/products/netflix.jpg"
                alt="Netflix Premium 4K"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[8px] font-bold text-amber-300">
                ⚡ INSTANT
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-[#F4F6FA] leading-tight">
                  Netflix 4K UHD
                </p>
                <p className="text-[11px] font-bold text-[#F4F6FA]">
                  ₹139 <span className="text-[8px] text-[#A6B1C2] font-normal">/mo</span>
                </p>
              </div>
              <span className="h-6 px-2 rounded-md bg-[#2965E8] text-white text-[10px] font-medium flex items-center justify-center">
                Buy
              </span>
            </div>
          </div>
        </div>

        {/* ── Layered Floating Product Badge (Top-Right) ── */}
        <div className="absolute -top-4 -right-2 sm:-right-4 px-3 py-2 rounded-xl bg-[#151D2B]/95 border border-[#1E2837] shadow-[0_12px_28px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center gap-2.5 transition-transform duration-500 group-hover:-translate-y-1 z-20">
          <div className="size-7 rounded-lg overflow-hidden border border-white/10 shrink-0">
            <img
              src="/images/products/2-in-1-combo.jpg"
              alt="2-in-1 Combo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-[11px] font-semibold text-[#F4F6FA]">
                2-in-1 Combo Pack
              </p>
              <LuZap className="size-3 text-amber-400" />
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
