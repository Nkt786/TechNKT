export interface CustomerReview {
  id: string;
  customerDisplayName: string;
  avatarUrl?: string;
  productOrService?: string;
  rating?: number; // 1 to 5
  reviewText: string;
  date?: string;
  verifiedPurchase?: boolean;
}

/**
 * Genuine TechNKT Customer Reviews Data Store.
 *
 * In accordance with TechNKT brand integrity standards:
 * - Only verified real customer reviews are added here.
 * - No fake reviews, fabricated testimonials, or placeholder star ratings are published.
 * - When 1 or 2 reviews are present, they are shown in an adapted focused layout.
 * - When 3 or more reviews are present, the animated 3-card carousel activates automatically.
 * - When empty ([]), a tasteful invitation card is displayed inviting verified buyers to share their feedback.
 */
export const customerReviews: CustomerReview[] = [
  // Leave empty until genuine customer reviews are received, or add real verified reviews here.
  // When 1-2 reviews are added, they will be displayed in an elegant focused layout.
  // When 3+ reviews are added, the animated 3-card carousel will automatically activate.
];
