'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function StickyFooterCta() {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && !dismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-24 z-40 max-w-sm"
        >
          <div className="glass shadow-2xl rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 relative pr-10">
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 p-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-850 dark:hover:text-zinc-200 cursor-pointer transition-all"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                  Looking for custom credits or tools?
                </h4>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  We supply 100+ premium keys, custom API weights, OTT bundles, and cloud credit vouchers on demand.
                </p>
                <div className="pt-1.5">
                  <Link
                    href="https://wa.me/919822587641"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary dark:text-blue-400 hover:underline"
                  >
                    Chat with support
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
