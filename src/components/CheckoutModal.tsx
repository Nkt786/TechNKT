'use client';

import React, { useState, useEffect } from 'react';
import { useCheckout } from './CheckoutContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Clipboard, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';

export default function CheckoutModal() {
  const { isOpen, product, closeCheckout } = useCheckout();
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setFullName('');
      setWhatsappNumber('');
      setEmail('');
      setQuantity(1);
      setNotes('');
      setErrors({});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(whatsappNumber.replace(/\s+/g, ''))) {
      newErrors.whatsappNumber = 'Please enter a valid phone number (10+ digits)';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const totalPrice = product.price * quantity;
    const orderMessage = `Hello TechNKT,

I want to purchase:

Product: ${product.name}
Duration: ${product.duration}
Price: ₹${totalPrice}
Quantity: ${quantity}

Customer Name: ${fullName}
WhatsApp Number: ${whatsappNumber}
Email: ${email}

Additional Notes: ${notes.trim() || 'None'}

Please confirm my order.`;

    const encodedText = encodeURIComponent(orderMessage);
    const whatsappUrl = `https://wa.me/919822587641?text=${encodedText}`;
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    closeCheckout();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCheckout}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 z-10"
        >
          {/* Header */}
          <div className="relative border-b border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-900 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Secure Order Checkout
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Confirm details to send order via WhatsApp
            </p>
            <button
              onClick={closeCheckout}
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Product Summary Card */}
            <div className="rounded-xl border border-zinc-100 bg-primary/5 p-4 dark:border-primary/10 dark:bg-primary/5 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mt-1">
                    {product.name}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary dark:text-blue-400">
                    ₹{product.price}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {product.duration}
                  </div>
                </div>
              </div>

              {product.warranty && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 pt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Warranty: {product.warranty}
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full rounded-lg border bg-transparent py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/10 ${
                      errors.fullName ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. +91 9822587641"
                    className={`w-full rounded-lg border bg-transparent py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/10 ${
                      errors.whatsappNumber ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  />
                </div>
                {errors.whatsappNumber && <p className="text-[11px] text-red-500 mt-1">{errors.whatsappNumber}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full rounded-lg border bg-transparent py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/10 ${
                      errors.email ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-lg hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-9 w-14 rounded-lg border border-zinc-200 text-center text-sm outline-none bg-transparent dark:border-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-lg hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors"
                  >
                    +
                  </button>

                  <div className="ml-auto flex items-center gap-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Total: <span className="text-primary text-base font-bold">₹{product.price * quantity}</span>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Additional Notes (Optional)
                </label>
                <div className="relative">
                  <Clipboard className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify credentials details or custom instructions..."
                    rows={2}
                    className="w-full rounded-lg border border-zinc-200 bg-transparent py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:focus:ring-primary/10"
                  />
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 rounded-lg bg-zinc-50 py-2.5 text-[11px] text-zinc-500 dark:bg-zinc-900/30 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-900/50">
              <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
              <span>Secure connection. No payment is processed on the website.</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary/95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all dark:bg-primary"
            >
              Confirm Order & Redirect
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
