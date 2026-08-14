'use client';

import React from 'react';
import { useCart } from '@/components/CartContext';
import { Product } from '@/data/products';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AddToCartButton({ product, className = '', size = 'md' }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs rounded-lg',
    md: 'px-6 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-3.5 text-sm md:text-base rounded-xl font-bold',
  };

  return (
    <button
      onClick={() => addToCart(product)}
      className={`flex items-center justify-center gap-2 border border-border bg-card hover:bg-secondary text-foreground hover:text-white transition-all shadow-sm font-bold cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      <ShoppingCart className="h-4 w-4 text-primary" />
      Add to Cart
    </button>
  );
}
