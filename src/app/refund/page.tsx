import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy - TechNKT',
  description: 'Learn about refund terms, warranty details, and key replacements at TechNKT.',
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <RefreshCw className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Refund & Replacement Policy
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Last updated: August 2026
            </p>
          </div>
        </div>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-650 dark:text-zinc-300 space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Core Replacement Warranty</h2>
            <p>
              We provide a **100% active-period replacement warranty** on all subscriptions and API keys. If your subscription stops working before its listed expiration date (e.g. during a 3M or 1YR duration), contact our WhatsApp support desk for a free replacement/restock.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Eligible Refunds</h2>
            <p>
              Refunds are processed solely if:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>We fail to deliver your ordered credentials within 24 hours of verification.</li>
              <li>A replacement cannot be provided for an account that went inactive during the warranty period.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">3. Non-refundable Circumstances</h2>
            <p>
              We do not issue refunds for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Change of mind by the customer after credentials delivery.</li>
              <li>Incorrect inputs provided during ordering (e.g., inputting an incorrect email address).</li>
              <li>Altering login details, profile configurations, or PINs on shared account profiles.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">4. Development & Creative Services</h2>
            <p>
              For Website Development and Instagram Services:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Website builds are completed in milestone stages; once a phase is approved, it is non-refundable.</li>
              <li>Instagram Views, Likes, and Followers boosters include a 30-day drop refill policy, but no cash refunds once delivery begins.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
