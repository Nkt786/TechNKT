'use client';

import React from 'react';
import { useCheckout } from '@/components/CheckoutContext';
import { Product } from '@/data/products';
import { ShoppingBag } from 'lucide-react';

interface BuyNowButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BuyNowButton({ product, className = '', size = 'md' }: BuyNowButtonProps) {
  const { openCheckout } = useCheckout();

  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs rounded-full',
    md: 'px-6 py-2.5 text-sm rounded-lg',
    lg: 'px-8 py-3.5 text-base rounded-xl font-bold',
  };

  return (
    <button
      onClick={() => openCheckout(product)}
      className={`flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/95 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 font-semibold cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <ShoppingBag className="h-4 w-4" />
      Buy Now
    </button>
  );
}
