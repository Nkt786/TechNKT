import React, { useState } from "react";
import {
  SiNetflix,
  SiSpotify,
  SiYoutube,
  SiOpenai,
  SiCanva,
  SiApple,
  SiCrunchyroll,
} from "react-icons/si";
import { FaAmazon } from "react-icons/fa6";
import {
  FiShoppingCart,
  FiZap,
  FiShield,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";

interface CategoryPlan {
  id: string;
  name: string;
  popular?: boolean;
  badge: string;
  price: string;
  period: string;
  delivery: string;
  features: string[];
  link: string;
}

interface Category {
  id: string;
  name: string;
  visual: string;
  description: string;
  plans: CategoryPlan[];
}

const CATEGORIES: Category[] = [
  {
    id: "subscriptions",
    name: "Subscriptions",
    visual: "/images/shop-categories/subscriptions.jpg",
    description: "Premium streaming & OTT entertainment passes with verified replacement warranty.",
    plans: [
      {
        id: "netflix-4k",
        name: "Netflix 4K UHD",
        badge: "Bestseller",
        popular: true,
        price: "₹199",
        period: "/ month",
        delivery: "Instant Auto-Delivery",
        features: [
          "Ultra HD 4K + HDR Streaming",
          "Dedicated Private Profile with PIN",
          "Works on Smart TV, Mobile & PC",
        ],
        link: "/shop?category=subscriptions&product=netflix",
      },
      {
        id: "prime-video",
        name: "Prime Video Annual",
        badge: "1 Year Access",
        price: "₹499",
        period: "/ year",
        delivery: "Instant Auto-Delivery",
        features: [
          "Full Prime Video Catalogue",
          "Ad-Free 4K Streaming",
          "12-Month Replacement Warranty",
        ],
        link: "/shop?category=subscriptions&product=prime",
      },
      {
        id: "youtube-premium",
        name: "YouTube Premium",
        badge: "Ad-Free",
        price: "₹149",
        period: "/ month",
        delivery: "Instant Auto-Delivery",
        features: [
          "Zero Video Ads Everywhere",
          "Background Play & Offline Downloads",
          "YouTube Music Premium Included",
        ],
        link: "/shop?category=subscriptions&product=youtube",
      },
    ],
  },
  {
    id: "combo-packs",
    name: "Combo Packs",
    visual: "/images/shop-categories/combo-packs.jpg",
    description: "Curated bundles giving you maximum entertainment at massive savings.",
    plans: [
      {
        id: "all-in-one-entertainment",
        name: "Ultimate OTT Trio",
        badge: "Mega Saver",
        popular: true,
        price: "₹349",
        period: "/ month",
        delivery: "Instant Auto-Delivery",
        features: [
          "Netflix 4K UHD Profile",
          "Prime Video HD Access",
          "Hotstar Super Pass",
        ],
        link: "/shop?category=combo-packs&product=ott-trio",
      },
      {
        id: "creators-suite",
        name: "Creator Suite Combo",
        badge: "Most Popular",
        price: "₹299",
        period: "/ month",
        delivery: "Instant Auto-Delivery",
        features: [
          "Canva Pro Brand Kit",
          "ChatGPT Plus Access",
          "YouTube Premium Included",
        ],
        link: "/shop?category=combo-packs&product=creator-suite",
      },
      {
        id: "music-lovers-pack",
        name: "Audiophile Duo",
        badge: "Dual Stream",
        price: "₹189",
        period: "/ 3 months",
        delivery: "Instant Auto-Delivery",
        features: [
          "Spotify Premium 3 Months",
          "Apple Music Spatial Audio",
          "Offline Sync on 5 Devices",
        ],
        link: "/shop?category=combo-packs&product=audio-duo",
      },
    ],
  },
  {
    id: "software",
    name: "Software & AI",
    visual: "/images/shop-categories/software.jpg",
    description: "State-of-the-art AI intelligence, creative suites & verified license keys.",
    plans: [
      {
        id: "chatgpt-plus",
        name: "ChatGPT Plus (GPT-4o)",
        badge: "Top AI Tool",
        popular: true,
        price: "₹399",
        period: "/ month",
        delivery: "Instant Auto-Delivery",
        features: [
          "DALL-E 3 & Custom GPTs",
          "Advanced Voice & Code Execution",
          "Priority High-Speed Server Access",
        ],
        link: "/shop?category=software&product=chatgpt",
      },
      {
        id: "canva-pro",
        name: "Canva Pro",
        badge: "Creator Essential",
        price: "₹149",
        period: "/ year",
        delivery: "Instant Auto-Delivery",
        features: [
          "100M+ Stock Media & Fonts",
          "Magic AI Studio & Background Remover",
          "Brand Kit & 1TB Cloud Storage",
        ],
        link: "/shop?category=software&product=canva",
      },
      {
        id: "windows-11-pro",
        name: "Windows 11 Pro",
        badge: "Lifetime Key",
        price: "₹699",
        period: "/ retail key",
        delivery: "Instant Auto-Delivery",
        features: [
          "100% Genuine Retail Activation",
          "Direct Microsoft Server Validation",
          "Lifetime Updates & Reinstallable",
        ],
        link: "/shop?category=software&product=windows11",
      },
    ],
  },
  {
    id: "music",
    name: "Music",
    visual: "/images/shop-categories/music.jpg",
    description: "Lossless, spatial audio & ad-free tunes across all your audio devices.",
    plans: [
      {
        id: "spotify-premium",
        name: "Spotify Premium",
        badge: "3 Months",
        popular: true,
        price: "₹129",
        period: "/ 3 months",
        delivery: "Instant Auto-Delivery",
        features: [
          "Completely Ad-Free Listening",
          "Unlimited Song Skips & Downloads",
          "Works on Existing Account",
        ],
        link: "/shop?category=music&product=spotify",
      },
      {
        id: "apple-music",
        name: "Apple Music",
        badge: "Lossless Audio",
        price: "₹149",
        period: "/ 3 months",
        delivery: "Instant Auto-Delivery",
        features: [
          "Dolby Atmos & Spatial Audio",
          "100 Million+ Song Library",
          "Compatible with iOS, Android & PC",
        ],
        link: "/shop?category=music&product=apple-music",
      },
      {
        id: "youtube-music",
        name: "YouTube Music",
        badge: "Background Play",
        price: "₹99",
        period: "/ month",
        delivery: "Instant Auto-Delivery",
        features: [
          "Screen-Off Audio Playback",
          "Offline Mixtape Downloads",
          "Live Performances & Cover Songs",
        ],
        link: "/shop?category=music&product=youtube-music",
      },
    ],
  },
  {
    id: "ebooks",
    name: "Ebooks",
    visual: "/images/ebooks/digital-business-blueprint.jpg",
    description: "Actionable digital blueprints and AI automation playbooks for modern builders.",
    plans: [
      {
        id: "ebook-business-blueprint",
        name: "Digital Business Blueprint",
        badge: "Bestseller",
        popular: true,
        price: "₹199",
        period: "Lifetime",
        delivery: "Instant PDF Download",
        features: [
          "Zero Fluff, Actionable Playbook",
          "Companion Notion Templates & Sheets",
          "Free Future Updates Included",
        ],
        link: "/ebook",
      },
      {
        id: "ebook-ai-mastery",
        name: "AI & Automation Mastery",
        badge: "Trending",
        price: "₹149",
        period: "Lifetime",
        delivery: "Instant PDF Download",
        features: [
          "Prompting Playbook & AI Workflows",
          "Tool Stacking Without High Costs",
          "Direct Download & Resource Pack",
        ],
        link: "/ebook",
      },
    ],
  },
  {
    id: "web-development",
    name: "Web Studio",
    visual: "/images/technkt-webdev-showcase.jpg",
    description: "Modern, high-converting websites and web applications built with Next.js, Astro & React.",
    plans: [
      {
        id: "landing-page-package",
        name: "High-Converting Landing Page",
        badge: "Fast Launch",
        popular: true,
        price: "Custom",
        period: "/ project",
        delivery: "3-5 Days Delivery",
        features: [
          "Responsive, Lightning-Fast Build",
          "SEO & Conversion Rate Optimized",
          "WhatsApp & Form Lead Integration",
        ],
        link: "/web-development",
      },
      {
        id: "business-website-package",
        name: "Business Website",
        badge: "Complete Brand",
        price: "Custom",
        period: "/ project",
        delivery: "7-10 Days Delivery",
        features: [
          "Multi-Page Architecture (Astro/Next.js)",
          "Google Maps, Reviews & Services",
          "Full Code Ownership & Domain Setup",
        ],
        link: "/web-development",
      },
      {
        id: "ecommerce-package",
        name: "Ecommerce Storefront",
        badge: "Sell Online",
        price: "Custom",
        period: "/ project",
        delivery: "10-14 Days Delivery",
        features: [
          "Product Grid, Filters & Cart System",
          "Stripe, UPI & Razorpay Integration",
          "Inventory & Order Management",
        ],
        link: "/web-development",
      },
    ],
  },
];

const BRANDS = [
  { name: "Netflix", icon: SiNetflix, color: "#E50914" },
  { name: "Prime Video", icon: FaAmazon, color: "#00A8E1" },
  { name: "Spotify", icon: SiSpotify, color: "#1DB954" },
  { name: "YouTube Premium", icon: SiYoutube, color: "#FF0000" },
  { name: "ChatGPT Plus", icon: SiOpenai, color: "#10A37F" },
  { name: "Canva Pro", icon: SiCanva, color: "#00C4CC" },
  { name: "Apple Music", icon: SiApple, color: "#FC3C44" },
  { name: "Crunchyroll", icon: SiCrunchyroll, color: "#F47521" },
];

export default function ShopByPlan() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("subscriptions");

  const activeCategory =
    CATEGORIES.find((cat) => cat.id === activeCategoryId) || CATEGORIES[0];

  return (
    <div className="w-full max-w-6xl mx-auto my-8 relative z-20">
      {/* 1. TOP BRAND MARQUEE */}
      <div className="relative w-full overflow-hidden mb-6 py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex items-center gap-6 sm:gap-8 flex-nowrap w-max animate-marquee">
          {BRANDS.concat(BRANDS).map((brand, idx) => {
            const Icon = brand.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-border text-xs sm:text-sm font-medium text-text-dark hover:text-white transition-colors shrink-0"
              >
                <Icon className="text-base" style={{ color: brand.color }} />
                <span>{brand.name}</span>
              </div>
            );
          })}
          <a
            href="/shop"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-medium shrink-0 transition-colors"
          >
            <span>View All Store Items</span>
            <FiArrowRight className="text-xs" />
          </a>
        </div>
      </div>

      {/* 2. VERIFIED TRUST BADGES - Clean, No Fake Metrics */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-light border border-border text-xs sm:text-sm text-text">
          <FiZap className="text-primary text-sm shrink-0" />
          <span>Instant Credential Delivery</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-light border border-border text-xs sm:text-sm text-text">
          <FiShield className="text-primary text-sm shrink-0" />
          <span>100% Replacement Warranty</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-light border border-border text-xs sm:text-sm text-text">
          <FiShoppingCart className="text-primary text-sm shrink-0" />
          <span>Direct WhatsApp &amp; UPI Support</span>
        </div>
      </div>

      {/* 3. MAIN HEADING */}
      <div className="mb-6 text-left">
        <span className="text-xs uppercase tracking-wider text-primary font-semibold block mb-1">Catalogue Navigation</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
          Shop by Category
        </h2>
      </div>

      {/* 4. CATEGORY TABS CONTAINER */}
      <div className="w-full rounded-2xl border border-border bg-light relative overflow-hidden">
        {/* Category Cards Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">
          {CATEGORIES.map((cat) => {
            const isSelected = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`relative flex flex-col items-center justify-center p-4 sm:p-5 text-center transition-colors group cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.04]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Visual Icon */}
                <div
                  className={`size-16 sm:size-18 rounded-full p-1.5 mb-2.5 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/20 border-2 border-primary scale-105"
                      : "bg-white/[0.04] border border-border group-hover:scale-105"
                  }`}
                >
                  <img
                    src={cat.visual}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>

                {/* Category Name */}
                <span
                  className={`text-xs sm:text-sm transition-colors flex items-center justify-center gap-1 ${
                    isSelected
                      ? "text-white font-bold"
                      : "text-text-dark group-hover:text-text font-medium"
                  }`}
                >
                  {cat.name}
                  {isSelected && <span className="text-xs text-primary font-bold">●</span>}
                </span>

                {/* Selected Underline */}
                {isSelected && (
                  <div className="absolute bottom-0 inset-x-3 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Category Content */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                Selected Category
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                {activeCategory.name}
              </h3>
              <p className="text-sm text-text-dark mt-1">
                {activeCategory.description}
              </p>
            </div>
            <a
              href={`/shop?category=${activeCategory.id}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:text-white font-medium transition-colors shrink-0"
            >
              <span>Explore full catalogue</span>
              <FiExternalLink className="text-xs" />
            </a>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeCategory.plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl p-6 transition-all duration-200 flex flex-col justify-between border ${
                  plan.popular
                    ? "bg-white/[0.03] border-primary/40"
                    : "bg-white/[0.01] border-border hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-md font-medium ${
                        plan.popular
                          ? "bg-primary text-white"
                          : "bg-white/10 text-text"
                      }`}
                    >
                      {plan.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-text-dark">
                      <FiClock className="text-[11px]" />
                      {plan.delivery}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{plan.name}</h4>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-text-dark">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feat, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-text"
                      >
                        <FiCheck className="text-primary mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      const raw = localStorage.getItem("technkt_cart");
                      const cart = raw ? JSON.parse(raw) : [];
                      const existing = cart.find((i: any) => i.id === plan.id);
                      if (existing) {
                        existing.quantity = (existing.quantity || 1) + 1;
                      } else {
                        cart.push({
                          id: plan.id,
                          name: plan.name,
                          price: plan.price,
                          period: plan.period,
                          quantity: 1,
                        });
                      }
                      localStorage.setItem("technkt_cart", JSON.stringify(cart));
                      window.dispatchEvent(new Event("cart-updated"));
                      window.location.href = "/cart";
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    plan.popular
                      ? "btn btn-primary"
                      : "btn btn-outline"
                  }`}
                >
                  <span>Select Plan</span>
                  <FiArrowRight className="text-xs ml-1" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Trust Note */}
          <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-dark">
            <span className="inline-flex items-center gap-1.5">
              <FiShield className="text-primary shrink-0" />
              <span>All purchases protected by 100% Replacement Warranty &amp; instant delivery.</span>
            </span>
            <a
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Questions? Chat with us on WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
