import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import BuyNowButton from '@/components/BuyNowButton';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, RefreshCw, HelpCircle, Sparkles } from 'lucide-react';
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
          url: 'https://technkt.in/og-image.jpg', // Standard placeholder, can update later
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

  // Get related products (same category, excluding current product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  // If no products in same category, take general featured products
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
    <article className="mx-auto max-w-7xl px-6 py-12 md:py-20 space-y-16">
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
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to marketplace
        </Link>
      </div>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Product Info & Visuals */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-blue-400 uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Premium Visual Card */}
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30 p-8 flex items-center justify-center min-h-[220px] glow-primary">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/15 opacity-50" />
            <div className="text-center space-y-3 z-10">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white text-3xl font-black shadow-lg">
                {product.name.charAt(0)}
              </div>
              <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">
                Premium License Activated
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                100% genuine keys, safe logins, & full active period support
              </p>
            </div>
          </div>

          {/* Features checklist */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Features & Benefits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-zinc-650 dark:text-zinc-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Checkout Widget */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 space-y-6">
            <div className="border-b border-zinc-100 dark:border-zinc-900 pb-4 space-y-1">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                Special Discount Price
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  ₹{product.price}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  / {product.duration}
                </span>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex gap-2.5 items-center">
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                <span>**Super Fast Delivery**: Activated within 30-180 mins.</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <RefreshCw className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>**Warranty assurance**: {product.warranty || 'Full Period Support'}.</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>**100% Secure**: Verifiable credentials, zero risk.</span>
              </div>
            </div>

            {/* CTA Buy Button */}
            <BuyNowButton product={product} size="lg" className="w-full" />

            <div className="text-[10px] text-center text-zinc-500 dark:text-zinc-400">
              Payments are verified and confirmed manually on WhatsApp.
            </div>
          </div>
        </div>
      </div>

      {/* Product FAQ Section */}
      <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-900 pt-16">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="h-5.5 w-5.5 text-primary" />
          Product FAQ & Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-zinc-150 p-5 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-white text-xs">
              How does delivery work after purchase?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Once you click &quot;Buy Now&quot; and submit the secure form, you will be redirected to WhatsApp. Our billing team will verify your request and send the activation details directly to your email or phone number.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-150 p-5 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-2">
            <h3 className="font-semibold text-zinc-900 dark:text-white text-xs">
              What does the warranty cover?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Our warranty covers full account replacements or reactivations. If a subscription goes inactive before the purchased duration expires, we issue a brand new credential key at no additional cost.
            </p>
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-900 pt-16">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Related Digital Solutions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {backupRelated.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md dark:border-zinc-900 dark:bg-zinc-950 transition-all"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-primary dark:text-blue-400 uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white mt-1.5 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-4 mt-4">
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-white">
                    ₹{item.price}
                  </div>
                  <div className="text-[9px] text-zinc-500 dark:text-zinc-400">
                    {item.duration}
                  </div>
                </div>
                <Link
                  href={`/${item.slug}`}
                  className="rounded-lg bg-zinc-50 border border-zinc-200/50 hover:bg-zinc-100 px-3 py-1.5 text-[10px] font-bold text-zinc-700 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
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
