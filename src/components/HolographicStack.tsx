'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function HolographicStack() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[620px] lg:max-w-none pt-4 lg:pt-0">
      
      {/* Card 1: Canva Pro */}
      <motion.div 
        className="relative bg-gradient-to-tr from-blue-600/90 via-purple-600/90 to-cyan-500/90 border border-purple-500/40 rounded-3xl p-5 flex flex-col justify-between h-[285px] text-white shadow-2xl"
        whileHover={{ y: -8, scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      >
        <div className="flex justify-between items-start">
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="text-[11px] font-black italic tracking-tighter text-[#7D2AE8]">Canva</span>
          </div>
        </div>
        <div>
          <h4 className="text-base font-black">Canva Pro</h4>
          <p className="text-xs text-purple-100 mt-0.5">1 Year Access</p>
        </div>
        <div className="pt-3 border-t border-white/20 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-black">₹699</span>
            <span className="text-[10px] text-purple-200 line-through">₹1,999</span>
          </div>
          <div className="flex justify-start">
            <span className="text-[9px] font-bold uppercase bg-white/20 px-2.5 py-1 rounded-full">Popular</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2: Claude Pro */}
      <motion.div 
        className="relative bg-gradient-to-b from-zinc-900 to-[#0C0D14] border border-zinc-800 rounded-3xl p-5 flex flex-col justify-between h-[285px] text-white shadow-2xl"
        whileHover={{ y: -8, scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      >
        <div className="flex justify-between items-start">
          <div className="text-amber-550 text-xl font-bold">✦</div>
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Anthropic</span>
        </div>
        <div>
          <h4 className="text-base font-black">Claude Pro</h4>
          <p className="text-xs text-zinc-450 mt-0.5">3 Months Access</p>
        </div>
        <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-black">₹8,999</span>
            <span className="text-[10px] text-zinc-500 line-through">₹18,000</span>
          </div>
          <div className="flex justify-start">
            <span className="text-[9px] font-bold uppercase bg-amber-550/10 border border-amber-550/20 text-amber-500 px-2.5 py-1 rounded-full">Trending</span>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Netflix Premium */}
      <motion.div 
        className="relative bg-black border border-zinc-900 rounded-3xl p-5 flex flex-col justify-between h-[285px] text-white shadow-2xl"
        whileHover={{ y: -8, scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
      >
        <div className="flex justify-between items-start">
          <span className="text-red-600 font-black text-xl">N</span>
        </div>
        <div>
          <h4 className="text-base font-black">Netflix Premium</h4>
          <p className="text-xs text-zinc-455 mt-0.5">1 Month Access</p>
        </div>
        <div className="pt-3 border-t border-zinc-900 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-black">₹80</span>
            <span className="text-[10px] text-zinc-500 line-through">₹199</span>
          </div>
          <div className="flex justify-start">
            <span className="text-[9px] font-bold uppercase bg-red-650/10 border border-red-650/20 text-red-500 px-2.5 py-1 rounded-full">Best Seller</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
