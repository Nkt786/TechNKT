'use client';

import React from 'react';

export default function ScrollToTopButton() {
  return (
    <div className="pt-6 border-t border-zinc-900/60 relative z-10 flex justify-center">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-[10px] font-bold text-zinc-550 hover:text-purple-400 transition-colors uppercase tracking-widest cursor-pointer select-none"
      >
        Sh*t I've gone too far, send me back up 👆
      </button>
    </div>
  );
}
