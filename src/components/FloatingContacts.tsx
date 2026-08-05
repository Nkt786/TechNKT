'use client';

import React from 'react';
import { MessageSquare, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingContacts() {
  const whatsappUrl = 'https://wa.me/919822587641';
  const telegramUrl = 'https://t.me/TechNKT'; // Standard Telegram tag or link; we can make it point to their brand.

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Telegram Floating Button */}
      <motion.a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition-colors cursor-pointer"
        aria-label="Contact on Telegram"
      >
        <Send className="h-5 w-5 fill-white" />
        {/* Tooltip */}
        <span className="absolute right-14 top-1/2 -translate-y-1/2 scale-0 rounded bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white shadow-md transition-all group-hover:scale-100 whitespace-nowrap dark:bg-zinc-800">
          Telegram Support
        </span>
      </motion.a>

      {/* WhatsApp Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 transition-colors cursor-pointer"
        aria-label="Contact on WhatsApp"
      >
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white dark:border-zinc-950"></span>
        </span>
        <MessageCircle className="h-7 w-7 fill-white" />
        {/* Tooltip */}
        <span className="absolute right-16 top-1/2 -translate-y-1/2 scale-0 rounded bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white shadow-md transition-all group-hover:scale-100 whitespace-nowrap dark:bg-zinc-800">
          Chat on WhatsApp
        </span>
      </motion.a>
    </div>
  );
}
