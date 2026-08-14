'use client';

import React from 'react';
import { useCart } from './CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingBag, Trash2, ArrowRight, Zap, ShieldCheck, 
  Plus, Minus, MessageCircle 
} from 'lucide-react';
import ProductImage from './ProductImage';

export default function CartDrawer() {
  const { 
    isCartOpen, closeCart, cartItems, 
    updateQuantity, removeFromCart, clearCart, 
    cartCount, cartTotal 
  } = useCart();

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    let itemsList = cartItems
      .map(
        (item, index) =>
          `${index + 1}. *${item.product.name}* (${item.product.duration})\n   Qty: ${item.quantity} x ₹${item.product.price} = ₹${item.product.price * item.quantity}`
      )
      .join('\n\n');

    const totalSavings = cartItems.reduce(
      (sum, item) => sum + Math.round(item.product.price * 0.6) * item.quantity,
      0
    );

    const message = `Hello TechNKT, I would like to place an order for the following digital items from my cart:\n\n${itemsList}\n\n*Total Amount: ₹${cartTotal}*\n*Estimated Savings: ₹${totalSavings}*\n\nPlease confirm availability and payment instructions.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919822587641?text=${encoded}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-foreground">Your Shopping Cart</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                    <div className="h-16 w-16 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground text-base">Your cart is empty</h4>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Browse our marketplace and add digital licenses or subscriptions to your cart.
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="rounded-xl bg-indigo-650 hover:bg-indigo-700 text-xs font-bold text-white px-5 py-2.5 transition-all shadow-sm cursor-pointer"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => {
                    const itemTotal = item.product.price * item.quantity;
                    return (
                      <motion.div
                        layout
                        key={item.product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl border border-border bg-card p-4 flex gap-3.5 items-start shadow-sm relative group"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border bg-muted">
                          <ProductImage slug={item.product.slug} name={item.product.name} />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-bold text-xs text-foreground truncate">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-muted-foreground hover:text-rose-500 transition-colors p-1 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="inline-block text-[9px] font-mono text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded">
                            {item.product.duration} Access
                          </span>

                          <div className="flex items-center justify-between pt-1">
                            {/* Quantity buttons */}
                            <div className="flex items-center gap-1 border border-border rounded-lg bg-background p-0.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-mono font-bold text-foreground px-2">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-xs font-black text-foreground">
                                ₹{itemTotal}
                              </div>
                              <div className="text-[9px] text-muted-foreground">
                                (₹{item.product.price} / item)
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-border bg-card space-y-3.5">
                  {/* Reassurance */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 text-emerald-605">
                      <ShieldCheck className="h-3.5 w-3.5" /> 100% Active Warranty
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Zap className="h-3.5 w-3.5 fill-current" /> Instant Delivery
                    </span>
                  </div>

                  {/* Pricing Total */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-border">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Subtotal Amount
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      ₹{cartTotal}
                    </span>
                  </div>

                  {/* Checkout Actions */}
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 py-3.5 text-xs font-black text-white shadow-md shadow-emerald-500/10 transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 fill-white stroke-none" />
                    Checkout via WhatsApp
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-between text-[11px]">
                    <button
                      onClick={clearCart}
                      className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      Empty Cart
                    </button>
                    <button
                      onClick={closeCart}
                      className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors cursor-pointer"
                    >
                      Continue Shopping &rarr;
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
