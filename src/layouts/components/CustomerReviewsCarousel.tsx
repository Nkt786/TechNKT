import React, { useState, useEffect, useRef } from "react";
import type { CustomerReview } from "@/data/reviews";
import {
  LuQuote,
  LuStar,
  LuShieldCheck,
  LuChevronLeft,
  LuChevronRight,
  LuMessageSquareHeart,
  LuSend,
  LuSparkles,
} from "react-icons/lu";

interface CustomerReviewsCarouselProps {
  reviews: CustomerReview[];
}

export default function CustomerReviewsCarousel({
  reviews = [],
}: CustomerReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) =>
        setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const count = reviews.length;
  const canRotate = count >= 3;

  useEffect(() => {
    if (!canRotate || isPaused || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, 6000);
    return () => clearInterval(interval);
  }, [canRotate, isPaused, prefersReducedMotion, count]);

  const handlePrev = () => {
    if (count < 2) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  const handleNext = () => {
    if (count < 2) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Empty State: When no verified real customer reviews have been published yet
  // ─────────────────────────────────────────────────────────────────────────────
  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-light/80 backdrop-blur-md p-8 sm:p-12 text-center transition-all duration-300 hover:border-primary/40">
          {/* Top Decorative Icon */}
          <div className="size-14 mx-auto mb-5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <LuMessageSquareHeart className="size-7" />
          </div>

          {/* Heading & Subtitle */}
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Your experience could be featured here.
          </h3>
          <p className="text-sm sm:text-base text-text leading-relaxed max-w-lg mx-auto mb-2">
            Purchased a digital subscription or website service from TechNKT?
            We value your honest feedback and authentic experience.
          </p>
          <p className="text-xs sm:text-sm text-text-light font-medium mb-8">
            Pehle istemaal karein, phir vishwas karein — aur apna feedback zaroor share karein.
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium text-sm hover:brightness-110 transition-all duration-200"
            >
              <LuSend className="size-4" />
              <span>Share Your Feedback</span>
            </a>
          </div>

          {/* Trust Footnote */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-text-light">
            <LuSparkles className="size-3.5 text-primary" />
            <span>100% genuine customer reviews only. Zero fabricated testimonials.</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1 or 2 Reviews: Adapted focused layout without empty carousel gaps
  // ─────────────────────────────────────────────────────────────────────────────
  if (count < 3) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div
          className={`grid gap-6 ${
            count === 1 ? "max-w-lg mx-auto" : "sm:grid-cols-2"
          }`}
        >
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} isCenter={true} />
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3+ Reviews: Full 3-Card Carousel with smooth rotation and controls
  // ─────────────────────────────────────────────────────────────────────────────
  const leftIndex = (currentIndex - 1 + count) % count;
  const centerIndex = currentIndex;
  const rightIndex = (currentIndex + 1) % count;

  const visibleSlots = [
    { key: "left", index: leftIndex, isCenter: false, posClass: "max-lg:hidden" },
    { key: "center", index: centerIndex, isCenter: true, posClass: "col-span-1" },
    { key: "right", index: rightIndex, isCenter: false, posClass: "max-lg:hidden" },
  ];

  return (
    <div
      className="relative max-w-6xl mx-auto px-4 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      }}
      aria-label="Customer Testimonials Carousel"
    >
      {/* 3-Card Row on Desktop / 1-Card on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center min-h-[300px]">
        {visibleSlots.map((slot) => {
          const rev = reviews[slot.index];
          return (
            <div
              key={`${slot.key}-${rev.id}`}
              className={`${slot.posClass} transition-all duration-500 ease-in-out`}
            >
              <ReviewCard review={rev} isCenter={slot.isCenter} />
            </div>
          );
        })}
      </div>

      {/* Navigation Controls & Pagination Dots */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Review"
          className="size-10 rounded-xl border border-border bg-light hover:bg-white/10 hover:border-border/80 flex items-center justify-center text-white transition-all duration-200"
        >
          <LuChevronLeft className="size-5" />
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? "w-7 bg-primary"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Review"
          className="size-10 rounded-xl border border-border bg-light hover:bg-white/10 hover:border-border/80 flex items-center justify-center text-white transition-all duration-200"
        >
          <LuChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponent: Single Review Card
// ─────────────────────────────────────────────────────────────────────────────
interface ReviewCardProps {
  review: CustomerReview;
  isCenter?: boolean;
}

function ReviewCard({ review, isCenter = false }: ReviewCardProps) {
  const getInitials = (name: string) => {
    if (!name) return "TN";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      className={`relative h-full flex flex-col justify-between rounded-2xl p-7 sm:p-8 transition-all duration-300 backdrop-blur-md ${
        isCenter
          ? "bg-light border border-primary/50 shadow-lg shadow-black/40 z-10"
          : "bg-light/60 border border-border hover:border-border/80 opacity-80 hover:opacity-100"
      }`}
    >
      {/* Decorative Quote Icon Watermark */}
      <div className="absolute top-6 right-6 pointer-events-none text-white/10">
        <LuQuote className="size-7" />
      </div>

      <div>
        {/* Rating Stars (Only when genuine rating is provided) */}
        {typeof review.rating === "number" && review.rating > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <LuStar
                key={i}
                className={`size-4 ${
                  i < (review.rating ?? 5)
                    ? "text-amber-400 fill-amber-400"
                    : "text-white/20"
                }`}
              />
            ))}
          </div>
        )}

        {/* Review Text */}
        <p className="text-white/95 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
          “{review.reviewText}”
        </p>
      </div>

      {/* Customer Info Footer */}
      <div className="pt-4 border-t border-border flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-3">
          {review.avatarUrl ? (
            <img
              src={review.avatarUrl}
              alt={review.customerDisplayName}
              className="size-10 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="size-10 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center border border-primary/30 shrink-0">
              {getInitials(review.customerDisplayName)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {review.customerDisplayName}
              </span>
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <LuShieldCheck className="size-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            {review.productOrService && (
              <span className="text-xs text-text-light block mt-0.5">
                {review.productOrService}
              </span>
            )}
          </div>
        </div>

        {review.date && (
          <span className="text-[11px] text-text-light shrink-0">
            {review.date}
          </span>
        )}
      </div>
    </div>
  );
}
