'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/data/products';

interface CheckoutContextType {
  isOpen: boolean;
  product: Product | null;
  openCheckout: (product: Product) => void;
  closeCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openCheckout = (prod: Product) => {
    setProduct(prod);
    setIsOpen(true);
  };

  const closeCheckout = () => {
    setIsOpen(false);
    setProduct(null);
  };

  return (
    <CheckoutContext.Provider value={{ isOpen, product, openCheckout, closeCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
