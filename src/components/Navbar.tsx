'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Menu, X, ArrowRight, MessageSquareCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', href: '#products', hasDropdown: true },
    { name: 'Web Services', href: '#services' },
    { name: 'Instagram Services', href: '#instagram-services' },
    { name: 'Why Us', href: '#why-choose-us' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'FAQs', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#05050A]/95 border-b border-zinc-900/80 shadow-md backdrop-blur-md'
          : 'bg-[#05050A]/40 border-b border-transparent backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 text-white shadow-md">
            <svg className="w-5 h-5 fill-white stroke-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div className="text-xl font-black tracking-tight text-white flex items-center font-sans">
            <span>Tech</span>
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">NKT</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              {link.name}
              {link.hasDropdown && (
                <svg className="w-2.5 h-2.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        {/* Utilities */}
        <div className="hidden md:flex items-center gap-4">
          {/* Login / Register */}
          <button className="border border-zinc-800 bg-[#0C0D14] hover:bg-zinc-900 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all">
            Login / Register
          </button>

          {/* WhatsApp CTA */}
          <Link
            href="https://wa.me/919822587641"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4.5 py-2 text-xs font-black text-white shadow-md hover:shadow-lg transition-all"
          >
            WhatsApp Business
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          {/* Hamburger Menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-zinc-200 bg-white/95 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
              <Link
                href="https://wa.me/919822587641"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-center text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all"
              >
                Chat on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
