'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartContext';
import { Sun, Moon, Menu, X, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact & Support', href: '/contact' }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 border-b border-border/80 shadow-md backdrop-blur-md'
          : 'bg-background/40 border-b border-transparent backdrop-blur-sm'
      }`}
    >
      {showAlert && (
        <div className="bg-[#FBBF24] text-neutral-950 text-center py-2 px-6 text-[10px] sm:text-[11px] font-black flex justify-center items-center gap-2 relative z-50 transition-all border-b border-amber-500/20">
          <span className="flex items-center gap-1">⚡ Instant key delivery & 100% replacement warranty.</span>
          <Link href="/products" className="underline hover:opacity-80 font-black">Shop Now</Link>
          <button 
            onClick={() => setShowAlert(false)} 
            className="absolute right-4 p-1 hover:opacity-70 cursor-pointer"
            aria-label="Dismiss Alert"
          >
            ✕
          </button>
        </div>
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-650 via-indigo-600 to-amber-500 text-white shadow-md">
            <svg className="w-5 h-5 fill-white stroke-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div className="text-xl font-black tracking-tight text-foreground flex items-center font-sans">
            <span>Tech</span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-550 bg-clip-text text-transparent">NKT</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Utilities */}
        <div className="hidden md:flex items-center gap-3">
          


          {/* Cart Trigger Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 border border-border bg-card hover:bg-muted text-foreground rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer group"
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span>Cart</span>
            {mounted && cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-black text-white shadow-sm"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* WhatsApp CTA */}
          <Link
            href="https://wa.me/919822587641"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/95 px-4 py-2.5 text-xs font-black text-white shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-white stroke-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm5.835-2.181c1.541.917 3.01 1.393 4.885 1.396 5.562 0 10.108-4.5 10.111-10.061.002-2.693-1.047-5.224-2.96-7.138C16.013 4.1 13.486 3.05 10.8 3.05c-5.565 0-10.112 4.502-10.115 10.065-.001 1.91.506 3.407 1.4 4.92l-.988 3.598 3.795-.964z" />
            </svg>
            WhatsApp Business
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2.5">
          


          {/* Mobile Cart Trigger */}
          <button
            onClick={openCart}
            className="relative rounded-xl border border-border bg-card p-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5 text-indigo-500" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[9px] font-black text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl border border-border bg-card p-2 text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
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
            className="border-b border-border bg-card/98 backdrop-blur-xl md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-bold text-foreground hover:text-indigo-550 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border my-1" />
              <Link
                href="https://wa.me/919822587641"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/95 py-3 text-center text-xs font-black text-white shadow-md transition-all"
              >
                <svg className="w-4 h-4 fill-white stroke-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm5.835-2.181c1.541.917 3.01 1.393 4.885 1.396 5.562 0 10.108-4.5 10.111-10.061.002-2.693-1.047-5.224-2.96-7.138C16.013 4.1 13.486 3.05 10.8 3.05c-5.565 0-10.112 4.502-10.115 10.065-.001 1.91.506 3.407 1.4 4.92l-.988 3.598 3.795-.964z" />
                </svg>
                Chat on WhatsApp
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
