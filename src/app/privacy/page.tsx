import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - TechNKT',
  description: 'Understand how we protect your customer data and billing details at TechNKT.',
};

export default function PrivacyPage() {
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
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Last updated: August 2026
            </p>
          </div>
        </div>

        <hr className="border-zinc-200 dark:border-zinc-850" />

        <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-650 dark:text-zinc-300 space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Information Collection</h2>
            <p>
              When placing an order on TechNKT, our checkout form collects your name, WhatsApp number, email, and specific notes. This information is processed strictly to compile your order summary and is forwarded to WhatsApp for communication. We do not store these details on public databases or sell them to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Use of Information</h2>
            <p>
              Your contact info is used exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verifying orders and delivering account credentials.</li>
              <li>Providing replacement support under the active warranty duration.</li>
              <li>Informing you of system updates or renewals.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">3. Third-party Links & Services</h2>
            <p>
              Our website contains outbound links to WhatsApp and Telegram. TechNKT is not responsible for the privacy practices of external platforms. Check the respective policies of WhatsApp Inc. and Telegram FZ-LLC for further data compliance insights.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">4. Cookies & Analytics</h2>
            <p>
              Subtle browser storage and cookies may be utilized to preserve theme preferences (dark or light mode) or remember products during search navigation. No tracking tags are injected without consent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
