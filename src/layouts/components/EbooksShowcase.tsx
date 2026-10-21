import React, { useState } from "react";
import {
  LuBookOpen,
  LuArrowRight,
  LuShoppingCart,
  LuCheck,
  LuSparkles,
  LuDownload,
} from "react-icons/lu";

interface EbookItem {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  coverImage: string;
  badge: string;
}

const FEATURED_EBOOKS: EbookItem[] = [
  {
    id: "ebook-business-blueprint",
    title: "The Digital Business Blueprint",
    category: "Business & Startup",
    price: "₹199",
    originalPrice: "₹499",
    coverImage: "/images/ebooks/digital-business-blueprint.jpg",
    badge: "Bestseller",
  },
  {
    id: "ebook-ai-mastery",
    title: "AI & Automation Mastery",
    category: "Technology & AI",
    price: "₹149",
    originalPrice: "₹399",
    coverImage: "/images/ebooks/ai-automation-mastery.jpg",
    badge: "Trending",
  },
];

export default function EbooksShowcase() {
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (ebook: EbookItem, redirect = false) => {
    try {
      const raw = localStorage.getItem("technkt_cart");
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((i: any) => i.id === ebook.id);

      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id: ebook.id,
          name: ebook.title,
          price: ebook.price,
          period: "Lifetime",
          quantity: 1,
        });
      }

      localStorage.setItem("technkt_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));

      if (redirect) {
        window.location.href = "/cart";
      } else {
        setAddedId(ebook.id);
        setTimeout(() => setAddedId(null), 1800);
      }
    } catch (e) {
      console.error(e);
      if (redirect) window.location.href = "/cart";
    }
  };

  return (
    <section className="section my-0 pt-0 pb-12">
      <div className="container">
        {/* Main Rounded Box matching screenshot */}
        <div className="relative overflow-hidden rounded-4xl bg-light py-12 px-6 sm:px-10 lg:px-14 xl:py-16 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] isolate">
          
          {/* Subtle Radial Violet Glow (Right Side) */}
          <div
            className="absolute bottom-0 right-0 size-100 sm:size-140 xl:size-220 blur-3xl translate-x-1/4 translate-y-1/3 -z-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 65%, white) 0%, var(--color-primary) 12%, transparent 65%)",
            }}
          />

          {/* Star Spores Canvas */}
          <div className="absolute inset-0 size-full overflow-hidden pointer-events-none -z-10 opacity-60">
            <canvas className="heroSporeCanvas w-full h-full" suppressHydrationWarning />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Column (45%): Copy, Badges & Primary CTA */}
            <div className="w-full lg:w-[46%] flex flex-col items-center lg:items-start text-center lg:text-left z-10">
              
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-border mb-5 text-xs font-semibold text-text-light backdrop-blur-md">
                <LuSparkles className="size-3.5 text-primary" />
                <span>TechNKT Digital Bookshelf</span>
              </div>

              {/* Main Headline - Solid Colors, Zero AI Gradient Text */}
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.15] mb-4">
                Big Ideas. Small Prices.
                <span className="block mt-1 text-primary">
                  Curated Knowledge for Builders.
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-text-dark leading-relaxed max-w-lg mb-8 font-normal">
                Actionable digital business blueprints and automation workflows to level up your operations.
              </p>

              {/* Action Buttons & Features */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                <a
                  href="/ebook"
                  className="btn btn-primary"
                >
                  <LuBookOpen className="size-4 mr-2" />
                  <span>Explore Ebooks</span>
                  <LuArrowRight className="size-4 ml-1.5" />
                </a>

                <div className="flex items-center gap-4 text-xs text-text-dark font-medium px-2">
                  <span className="inline-flex items-center gap-1.5">
                    <LuDownload className="size-3.5 text-primary" />
                    <span>Instant PDF</span>
                  </span>
                  <span>•</span>
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>

            {/* Right Column (55%): 3D Floating Books with Page-Turn Animation */}
            <div className="w-full lg:w-[54%] flex items-center justify-center py-4 lg:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6 lg:gap-8 items-center justify-center w-full max-w-xl">
                
                {/* ── Book 1: The Digital Business Blueprint (Periodic Page Flip) ── */}
                <div className="flex flex-col items-center">
                  <div className="perspective-container relative w-[205px] h-[280px] sm:w-[215px] sm:h-[295px] flex items-center justify-center">
                    
                    {/* Shadow underneath */}
                    <div className="absolute -bottom-6 w-36 h-6 rounded-full bg-radial from-[#937AFF]/40 via-black/60 to-transparent blur-md transition-all duration-700 book-shadow-1 pointer-events-none" />

                    {/* 3D Book Object */}
                    <div className="book-3d book-1 relative w-full h-full rounded-[4px_10px_10px_4px]">
                      
                      {/* Spine (Left side) */}
                      <div className="book-spine absolute left-0 top-0 bottom-0 w-[20px] bg-gradient-to-r from-[#20103A] to-[#391E69] text-[9px] text-white/50 tracking-widest uppercase flex items-center justify-center overflow-hidden [transform-origin:left_center] [transform:rotateY(-90deg)_translateX(-10px)]" />

                      {/* Paper edge on right */}
                      <div className="book-pages-edge absolute right-0 top-1 bottom-1 w-[16px] bg-[#E5E5EB] [transform-origin:right_center] [transform:rotateY(90deg)_translateX(8px)] shadow-inner" />

                      {/* Back Cover */}
                      <div className="absolute inset-0 bg-[#160B2B] rounded-[4px_10px_10px_4px] shadow-2xl" />

                      {/* Inner Page 2 (Flipping layer 2) */}
                      <div className="book-inner-page-2 absolute inset-[3px_5px_3px_8px] bg-gradient-to-r from-[#EDEBF5] to-[#FAF9FF] rounded-[2px_7px_7px_2px] [transform-origin:left_center] shadow-sm p-4 flex flex-col justify-between">
                        <div className="space-y-2 opacity-30">
                          <div className="h-2 w-3/4 bg-purple-900 rounded" />
                          <div className="h-1.5 w-full bg-purple-800 rounded" />
                          <div className="h-1.5 w-5/6 bg-purple-800 rounded" />
                        </div>
                        <div className="text-[8px] text-purple-900/40 text-center font-mono">
                          TechNKT Blueprint • Page 14
                        </div>
                      </div>

                      {/* Inner Page 1 (Flipping layer 1) */}
                      <div className="book-inner-page-1 absolute inset-[3px_5px_3px_8px] bg-gradient-to-r from-[#F4F3F8] to-[#FFFFFF] rounded-[2px_7px_7px_2px] [transform-origin:left_center] shadow-sm p-4 flex flex-col justify-between">
                        <div className="space-y-2 opacity-40">
                          <div className="h-2.5 w-2/3 bg-purple-900 rounded" />
                          <div className="h-1.5 w-full bg-purple-800 rounded" />
                          <div className="h-1.5 w-4/5 bg-purple-800 rounded" />
                        </div>
                        <div className="text-[8px] text-purple-900/40 text-center font-mono">
                          TechNKT Blueprint • Page 15
                        </div>
                      </div>

                      {/* Front Cover (Animated Flip) */}
                      <div className="book-front-cover-1 absolute inset-0 rounded-[4px_10px_10px_4px] overflow-hidden [transform-origin:left_center] shadow-[inset_4px_0_8px_rgba(0,0,0,0.6),0_15px_35px_rgba(0,0,0,0.5)] border-l border-white/20">
                        <img
                          src={FEATURED_EBOOKS[0].coverImage}
                          alt={FEATURED_EBOOKS[0].title}
                          className="w-full h-full object-cover"
                        />
                        {/* Cover Gloss sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Book 1 Meta Card & CTA */}
                  <div className="mt-5 text-center flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-[#C4B5FD] bg-[#937AFF]/15 border border-[#937AFF]/30 px-2.5 py-0.5 rounded-full mb-1.5">
                      {FEATURED_EBOOKS[0].category}
                    </span>
                    <h4 className="text-sm font-bold text-white max-w-[200px] leading-snug">
                      {FEATURED_EBOOKS[0].title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 mb-3">
                      <span className="text-base font-extrabold text-white">
                        {FEATURED_EBOOKS[0].price}
                      </span>
                      <span className="text-xs text-[#DAD4DE]/60 line-through">
                        {FEATURED_EBOOKS[0].originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(FEATURED_EBOOKS[0], true)}
                        className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light active:scale-95 transition-all duration-200"
                      >
                        Buy Now
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(FEATURED_EBOOKS[0], false)}
                        aria-label="Add to cart"
                        className="size-8 rounded-lg border border-border bg-white/5 hover:bg-primary/20 hover:border-primary/50 flex items-center justify-center text-white transition-all duration-200"
                      >
                        {addedId === FEATURED_EBOOKS[0].id ? (
                          <LuCheck className="size-4 text-emerald-400" />
                        ) : (
                          <LuShoppingCart className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Book 2: AI & Automation Mastery (Interactive Hover Tilt) ── */}
                <div className="flex flex-col items-center">
                  <div className="perspective-container relative w-[205px] h-[280px] sm:w-[215px] sm:h-[295px] flex items-center justify-center">
                    
                    {/* Shadow underneath */}
                    <div className="absolute -bottom-6 w-36 h-6 rounded-full bg-radial from-[#937AFF]/40 via-black/60 to-transparent blur-md transition-all duration-700 book-shadow-2 pointer-events-none" />

                    {/* 3D Book Object */}
                    <div className="book-3d book-2 relative w-full h-full rounded-[4px_10px_10px_4px] cursor-pointer group/book">
                      
                      {/* Spine (Left side) */}
                      <div className="book-spine absolute left-0 top-0 bottom-0 w-[20px] bg-gradient-to-r from-[#170E30] to-[#2E1856] text-[9px] text-white/50 tracking-widest uppercase flex items-center justify-center overflow-hidden [transform-origin:left_center] [transform:rotateY(-90deg)_translateX(-10px)]" />

                      {/* Paper edge on right */}
                      <div className="book-pages-edge absolute right-0 top-1 bottom-1 w-[16px] bg-[#E5E5EB] [transform-origin:right_center] [transform:rotateY(90deg)_translateX(8px)] shadow-inner" />

                      {/* Back Cover */}
                      <div className="absolute inset-0 bg-[#120824] rounded-[4px_10px_10px_4px] shadow-2xl" />

                      {/* Inner Page (Revealed on hover) */}
                      <div className="book-2-inner-page absolute inset-[3px_5px_3px_8px] bg-gradient-to-r from-[#F1EFF7] to-[#FFFFFF] rounded-[2px_7px_7px_2px] [transform-origin:left_center] shadow-sm p-4 flex flex-col justify-between transition-transform duration-500 group-hover/book:[transform:rotateY(-24deg)]">
                        <div className="space-y-2 opacity-40">
                          <div className="h-2.5 w-3/4 bg-violet-900 rounded" />
                          <div className="h-1.5 w-full bg-violet-800 rounded" />
                          <div className="h-1.5 w-4/5 bg-violet-800 rounded" />
                          <div className="h-1.5 w-full bg-violet-800 rounded" />
                        </div>
                        <div className="text-[8px] text-violet-900/40 text-center font-mono">
                          AI Mastery • Prompt Systems
                        </div>
                      </div>

                      {/* Front Cover */}
                      <div className="book-2-front-cover absolute inset-0 rounded-[4px_10px_10px_4px] overflow-hidden [transform-origin:left_center] shadow-[inset_4px_0_8px_rgba(0,0,0,0.6),0_15px_35px_rgba(0,0,0,0.5)] border-l border-white/20 transition-transform duration-500 group-hover/book:[transform:rotateY(-35deg)]">
                        <img
                          src={FEATURED_EBOOKS[1].coverImage}
                          alt={FEATURED_EBOOKS[1].title}
                          className="w-full h-full object-cover"
                        />
                        {/* Cover Gloss sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Book 2 Meta Card & CTA */}
                  <div className="mt-5 text-center flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-[#C4B5FD] bg-[#937AFF]/15 border border-[#937AFF]/30 px-2.5 py-0.5 rounded-full mb-1.5">
                      {FEATURED_EBOOKS[1].category}
                    </span>
                    <h4 className="text-sm font-bold text-white max-w-[200px] leading-snug">
                      {FEATURED_EBOOKS[1].title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 mb-3">
                      <span className="text-base font-extrabold text-white">
                        {FEATURED_EBOOKS[1].price}
                      </span>
                      <span className="text-xs text-[#DAD4DE]/60 line-through">
                        {FEATURED_EBOOKS[1].originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(FEATURED_EBOOKS[1], true)}
                        className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light active:scale-95 transition-all duration-200"
                      >
                        Buy Now
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(FEATURED_EBOOKS[1], false)}
                        aria-label="Add to cart"
                        className="size-8 rounded-lg border border-border bg-white/5 hover:bg-primary/20 hover:border-primary/50 flex items-center justify-center text-white transition-all duration-200"
                      >
                        {addedId === FEATURED_EBOOKS[1].id ? (
                          <LuCheck className="size-4 text-emerald-400" />
                        ) : (
                          <LuShoppingCart className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded CSS for realistic 3D transforms & page-flipping */}
      <style>{`
        .perspective-container {
          perspective: 1200px;
        }

        .book-3d {
          transform-style: preserve-3d;
        }

        /* Book 1 Floating Animation */
        .book-1 {
          animation: floatBook1 6s ease-in-out infinite alternate;
        }

        @keyframes floatBook1 {
          0% {
            transform: translateY(0px) rotateY(-18deg) rotateX(7deg) rotateZ(-3deg);
          }
          100% {
            transform: translateY(-16px) rotateY(-12deg) rotateX(11deg) rotateZ(-1deg);
          }
        }

        .book-shadow-1 {
          animation: shadowPulse1 6s ease-in-out infinite alternate;
        }

        @keyframes shadowPulse1 {
          0% {
            transform: scale(1) translateY(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.85) translateY(4px);
            opacity: 0.3;
          }
        }

        /* Periodic Page-Flipping on Book 1 */
        .book-front-cover-1 {
          animation: book1CoverFlip 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-style: preserve-3d;
        }

        @keyframes book1CoverFlip {
          0%, 65%, 100% {
            transform: rotateY(0deg);
          }
          72% {
            transform: rotateY(-46deg);
          }
          82% {
            transform: rotateY(-38deg);
          }
          89% {
            transform: rotateY(0deg);
          }
        }

        .book-inner-page-1 {
          animation: book1Page1Flip 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-style: preserve-3d;
        }

        @keyframes book1Page1Flip {
          0%, 67%, 100% {
            transform: rotateY(0deg);
          }
          75% {
            transform: rotateY(-36deg);
          }
          83% {
            transform: rotateY(-28deg);
          }
          90% {
            transform: rotateY(0deg);
          }
        }

        .book-inner-page-2 {
          animation: book1Page2Flip 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-style: preserve-3d;
        }

        @keyframes book1Page2Flip {
          0%, 69%, 100% {
            transform: rotateY(0deg);
          }
          77% {
            transform: rotateY(-24deg);
          }
          84% {
            transform: rotateY(-18deg);
          }
          91% {
            transform: rotateY(0deg);
          }
        }

        /* Book 2 Floating Animation */
        .book-2 {
          animation: floatBook2 7s ease-in-out infinite alternate;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .book-2:hover {
          animation-play-state: paused;
          transform: translateY(-16px) rotateY(6deg) rotateX(4deg) scale(1.05) !important;
        }

        @keyframes floatBook2 {
          0% {
            transform: translateY(-6px) rotateY(16deg) rotateX(9deg) rotateZ(3deg);
          }
          100% {
            transform: translateY(10px) rotateY(20deg) rotateX(5deg) rotateZ(5deg);
          }
        }

        .book-shadow-2 {
          animation: shadowPulse2 7s ease-in-out infinite alternate;
        }

        @keyframes shadowPulse2 {
          0% {
            transform: scale(0.9) translateY(0);
            opacity: 0.35;
          }
          100% {
            transform: scale(1.1) translateY(4px);
            opacity: 0.55;
          }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .book-1,
          .book-2,
          .book-front-cover-1,
          .book-inner-page-1,
          .book-inner-page-2,
          .book-shadow-1,
          .book-shadow-2 {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
