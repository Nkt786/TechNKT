import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions - TechNKT',
  description: 'Review the terms and conditions for purchasing subscriptions and digital services from TechNKT.',
};

export default function TermsPage() {
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
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Terms & Conditions
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Last updated: August 2026
            </p>
          </div>
        </div>

        <hr className="border-zinc-200 dark:border-zinc-800" />

        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-650 dark:text-zinc-300 space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Agreement to Terms</h2>
            <p>
              By accessing our website at <Link href="/" className="text-primary hover:underline">technkt.in</Link> or initiating purchase requests, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Nature of Services</h2>
            <p>
              TechNKT is a digital marketplace that facilitates the procurement of premium subscription upgrades, API keys, developer tool accesses, cloud credits, and customized website development solutions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">3. Ordering & Fulfillment</h2>
            <p>
              All purchases on TechNKT are fulfilled by redirecting users to WhatsApp, where coordinates are processed directly by our billing team. The average processing time for credentials delivery is 30 minutes to 3 hours from verification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">4. Account Responsibilities</h2>
            <p>
              For products requiring shared slots or logins (e.g. Netflix UHD screens), users must adhere strictly to the usage constraints (e.g. 1 screen configuration with profile PIN). Sharing or altering credentials without authorization will terminate active warranties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">5. Limit of Liability</h2>
            <p>
              TechNKT is not liable for data losses or outages caused by primary software publishers (e.g. OpenAI, Microsoft, Google, Anthropic). We guarantee replacement/restocks under the active warranty duration for which you have subscribed.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
