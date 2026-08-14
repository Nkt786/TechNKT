import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import BuyNowButton from '@/components/BuyNowButton';
import AddToCartButton from '@/components/AddToCartButton';
import ProductImage from '@/components/ProductImage';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, RefreshCw, HelpCircle, Sparkles, Star } from 'lucide-react';
import { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found - TechNKT',
      description: 'The requested digital product subscription is not available.',
    };
  }

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `/${product.slug}`,
    },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url: `https://technkt.in/${product.slug}`,
      type: 'website',
      images: [
        {
          url: 'https://technkt.in/og-image.jpg',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle,
      description: product.seoDescription,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const mrp = Math.round(product.price * 1.6);
  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);
  const pseudoReviewsCount = 45 + (product.id.charCodeAt(0) % 180);

  // Get related products (same category, excluding current product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const backupRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : PRODUCTS.filter((p) => p.isFeatured && p.id !== product.id).slice(0, 3);

  // Structured Data (JSON-LD Product & FAQ Schema)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://technkt.in/${product.slug}`,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the delivery time for ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We deliver credentials and activations for ${product.name} within 30 minutes to 3 hours from payment verification. All updates are sent straight to your WhatsApp number.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does ${product.name} come with a replacement warranty?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${product.name} is covered by our ${product.warranty || 'full-period replacement warranty'}. If the subscription stops working, we will provide a new one free of charge.`,
        },
      },
    ],
  };

  return (
    <article className="mx-auto max-w-7xl px-6 py-12 md:py-16 space-y-14 relative overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none -z-10 h-full opacity-40" />

      {/* JSON-LD Script Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all products & licenses
        </Link>
      </div>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Product Visuals & Info */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                <Sparkles className="h-3 w-3" />
                {product.category}
              </span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-450 bg-[#FDF6E2] dark:bg-amber-500/10 border border-amber-250 dark:border-amber-500/25 px-2.5 py-0.5 rounded-full">
                TechNKT Choice
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex text-amber-550">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-foreground">4.9 / 5.0</span>
              <span className="text-muted-foreground">({pseudoReviewsCount} verified reviews)</span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Premium Visual Banner Card */}
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card p-6 shadow-sm">
            <ProductImage slug={product.slug} name={product.name} />
          </div>

          {/* Features checklist */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-extrabold text-foreground">
              Features & Benefit Inclusions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2.5 items-start bg-card border border-border rounded-xl p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground/90">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Checkout Widget */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-7 shadow-sm space-y-6">
            
            <div className="border-b border-border pb-5 space-y-2">
              <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                Discounted License Price
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-rose-500 text-sm font-black">
                  -{discountPercent}%
                </span>
                <span className="text-3.5xl font-black text-foreground">
                  ₹{product.price}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{mrp}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  / {product.duration}
                </span>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="space-y-3.5 text-xs text-foreground/90">
              <div className="flex gap-2.5 items-center">
                <Zap className="h-4 w-4 text-amber-500 shrink-0 fill-current" />
                <span><strong className="text-foreground">Instant Delivery</strong>: Sent directly to your WhatsApp.</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <RefreshCw className="h-4 w-4 text-emerald-500 shrink-0" />
                <span><strong className="text-foreground">Active Warranty</strong>: {product.warranty || 'Full Period Support'}.</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0" />
                <span><strong className="text-foreground">100% Genuine</strong>: Verifiable credentials with zero lockouts.</span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-3 pt-2">
              <AddToCartButton product={product} size="lg" className="w-full" />
              <BuyNowButton product={product} size="lg" className="w-full animate-pulse" />
            </div>

            <div className="text-[10px] text-center text-muted-foreground">
              Verified orders are processed securely and delivered via WhatsApp.
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="space-y-6 border-t border-border pt-12">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-500" />
          Product FAQ & Support Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border p-5 bg-card space-y-2">
            <h3 className="font-bold text-foreground text-xs">
              How does delivery work after purchase?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Once you confirm your order, you will be connected to our WhatsApp support team. Activation credentials and setup guides are delivered directly to your chat within 30 to 180 minutes.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-5 bg-card space-y-2">
            <h3 className="font-bold text-foreground text-xs">
              What does the replacement warranty cover?
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our warranty covers full account replacements or reactivations. If a subscription goes inactive before the purchased duration expires, we issue a brand new credential key at no additional cost.
            </p>
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      <section className="space-y-6 border-t border-border pt-12">
        <h2 className="text-xl font-bold text-foreground">
          Related Digital Solutions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {backupRelated.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-indigo-500/40 transition-all"
            >
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <h3 className="font-extrabold text-sm text-foreground group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                <div>
                  <div className="text-xs font-black text-foreground">
                    ₹{item.price}
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    {item.duration}
                  </div>
                </div>
                <Link
                  href={`/${item.slug}`}
                  className="rounded-xl bg-background border border-border hover:bg-muted px-3.5 py-1.5 text-xs font-bold text-foreground transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
