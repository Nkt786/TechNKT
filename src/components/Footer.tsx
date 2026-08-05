'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquareCode, Mail, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'loading'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  const footerLinks = {
    Categories: [
      { name: 'AI Subscription Tools', href: '#products' },
      { name: 'LinkedIn Premium Services', href: '#products' },
      { name: 'Developer & VPS Software', href: '#products' },
      { name: 'Creative Cloud Software', href: '#products' },
      { name: 'OTT Video Entertainment', href: '#products' },
    ],
    Company: [
      { name: 'Why Choose TechNKT', href: '#why-choose-us' },
      { name: 'Customer Testimonials', href: '#reviews' },
      { name: 'Frequently Asked Questions', href: '#faq' },
      { name: 'Website Agency Services', href: '#services' },
    ],
    Legal: [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Refund Policy', href: '/refund' },
      { name: 'Privacy Policy', href: '/privacy' },
    ]
  };

  const trustBadges = [
    { icon: <Truck className="h-5 w-5 text-primary" />, title: 'Fast Delivery', desc: 'Activated within 30-180 mins' },
    { icon: <ShieldCheck className="h-5 w-5 text-primary" />, title: 'Secure Ordering', desc: 'WhatsApp verified validation' },
    { icon: <Clock className="h-5 w-5 text-primary" />, title: '24/7 Support', desc: 'WhatsApp & Telegram chat assistance' },
    { icon: <RefreshCw className="h-5 w-5 text-primary" />, title: 'Full Warranty', desc: '100% active period guarantee' }
  ];

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950/40">
      {/* Trust Badges Bar */}
      <div className="mx-auto max-w-7xl px-6 py-10 border-b border-zinc-200/50 dark:border-zinc-900/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 shadow-md">
                <svg className="w-5 h-5 fill-none stroke-[2.5]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke="url(#footer-logo-grad)" strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  <defs>
                    <linearGradient id="footer-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="text-xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center font-sans">
                <span>Tech</span>
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">NKT</span>
              </div>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Your ultimate professional marketplace for premium subscription licenses, API tokens, cloud developer credits, streaming slots, and custom web development.
            </p>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
              <div>Email: <a href="mailto:support@technkt.in" className="hover:underline text-zinc-800 dark:text-zinc-200">support@technkt.in</a></div>
              <div>Domain: <span className="text-zinc-800 dark:text-zinc-200">technkt.in</span></div>
            </div>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:col-span-5">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter / Contact form mock */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Subscribe to get alerts on subscription restocks and discount vouchers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-primary transition-all text-zinc-800 dark:text-zinc-150"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/95 transition-all cursor-pointer"
              >
                {status === 'success' ? 'Subbed!' : 'Join'}
              </button>
            </form>
            {status === 'success' && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                Success! You are now subscribed.
              </p>
            )}
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="h-px bg-zinc-200 dark:bg-zinc-900 my-10" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} TechNKT (technkt.in). All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Powered by Next.js & React</span>
            <span>Premium Digital Marketplace</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
