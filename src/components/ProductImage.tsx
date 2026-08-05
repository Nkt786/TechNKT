'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProductImageProps {
  slug: string;
  name: string;
}

export default function ProductImage({ slug, name }: ProductImageProps) {
  const s = slug.toLowerCase();

  // Render high-fidelity, colorful vector brand banners
  const renderBanner = () => {
    if (s.includes('netflix')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-zinc-950 flex flex-col items-center justify-center overflow-hidden">
          {/* Ambient red glow */}
          <div className="absolute bottom-[-50px] w-[140px] h-[140px] rounded-full bg-red-600/30 blur-[30px]" />
          <svg className="w-16 h-20 fill-red-600 drop-shadow-[0_8px_16px_rgba(220,38,38,0.5)] z-10" viewBox="0 0 100 150">
            <path d="M15 10v130h22V75l26 65h22V10H63v65L37 10H15z" />
          </svg>
        </div>
      );
    }

    if (s.includes('prime') || s.includes('amazon')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#00A8E1]/20 flex flex-col items-center justify-center text-white p-4">
          <div className="text-2xl font-black italic tracking-tight text-white flex flex-col items-center">
            <span>prime video</span>
            <svg className="w-16 h-5 fill-[#00A8E1] -mt-1.5 drop-shadow-[0_2px_8px_rgba(0,168,225,0.4)]" viewBox="0 0 48 16">
              <path d="M4 8c12 5 24 5 36 0" stroke="#00A8E1" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <polygon points="40,8 37,5 38,11" fill="#00A8E1" />
            </svg>
          </div>
        </div>
      );
    }

    if (s.includes('hotstar')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#0B132B] to-[#1C2541] flex flex-col items-center justify-center text-white">
          <div className="relative flex flex-col items-center">
            {/* Hotstar Star Logo */}
            <svg className="w-14 h-14 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 mt-2">Disney+ Hotstar</span>
          </div>
        </div>
      );
    }

    if (s.includes('spotify')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-[#1DB954]/20 flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center gap-2">
            <svg className="w-14 h-14 fill-[#1DB954] drop-shadow-[0_6px_12px_rgba(29,185,84,0.5)]" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 4.1-1 7.6-.5 10.4 1.2.3.2.4.6.2.8zm1.5-3.3c-.3.4-.8.5-1.2.3-2.8-1.7-7.2-2.2-10.6-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.9-1.2 8.7-.6 11.9 1.3.4.2.5.8.3 1.2zm.1-3.4C15.5 8.4 9.6 8.2 6.2 9.2c-.5.2-1.1-.1-1.3-.7-.2-.5.1-1.1.7-1.3C9.2 6 15.8 6.2 20 8.7c.5.3.6.9.3 1.4-.3.5-1 .6-1.5.3z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1DB954]">Spotify Premium</span>
          </div>
        </div>
      );
    }

    if (s.includes('apple-music') || s.includes('apple-tv') || s.includes('apple')) {
      const isMusic = s.includes('music');
      return (
        <div className={`absolute inset-0 bg-gradient-to-br ${isMusic ? 'from-rose-500 via-pink-600 to-rose-700' : 'from-zinc-900 to-black'} flex flex-col items-center justify-center text-white`}>
          <div className="text-center">
            <span className="text-5xl drop-shadow-md"></span>
            <div className="text-xs font-black tracking-wider uppercase mt-1">
              {isMusic ? 'Music' : 'tv+'}
            </div>
          </div>
        </div>
      );
    }

    if (s.includes('youtube')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-red-600/10 flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-red-600 px-5 py-2.5 rounded-2xl flex items-center justify-center shadow-lg shadow-red-650/40">
              <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-[10px] font-black tracking-widest uppercase text-red-500">YouTube Premium</span>
          </div>
        </div>
      );
    }

    if (s.includes('canva')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00C4CC] via-[#7D2AE8] to-[#FF4E7E] flex flex-col items-center justify-center text-white">
          <span className="text-3xl font-black italic tracking-tighter drop-shadow-md">Canva</span>
          <span className="text-[8px] font-bold tracking-widest uppercase mt-1 bg-white/20 px-2 py-0.5 rounded-full">Pro Enterprise</span>
        </div>
      );
    }

    if (s.includes('adobe')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 flex flex-col items-center justify-center text-white">
          <span className="text-5xl font-black tracking-tighter drop-shadow-lg">A</span>
          <span className="text-[9px] font-bold tracking-wider mt-2 bg-black/20 px-2 py-0.5 rounded">Adobe Suite</span>
        </div>
      );
    }

    if (s.includes('claude')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0D4C3] to-[#C8BCA6] flex flex-col items-center justify-center text-[#191919] p-4">
          <span className="text-4xl font-serif font-black tracking-tight">Claude</span>
          <span className="text-[9px] font-black uppercase tracking-wider text-[#D97706] mt-1 bg-white/50 px-2 py-0.5 rounded">Pro Access</span>
        </div>
      );
    }

    if (s.includes('gemini')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-indigo-700 to-cyan-500 flex flex-col items-center justify-center text-white">
          <span className="text-4xl animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">✦</span>
          <span className="text-[10px] font-black tracking-widest uppercase mt-2">Gemini Ultra</span>
        </div>
      );
    }

    if (s.includes('copilot') || s.includes('github')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-indigo-900/30 flex flex-col items-center justify-center text-white">
          <span className="text-4xl drop-shadow-md">🤖</span>
          <span className="text-[9px] font-black text-zinc-400 tracking-wider mt-2 bg-white/5 px-2 py-0.5 rounded border border-white/10">GitHub Copilot</span>
        </div>
      );
    }

    if (s.includes('cursor')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D17] to-zinc-950 flex flex-col items-center justify-center text-blue-400 border-t-2 border-blue-500">
          <span className="text-4xl drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">⚡</span>
          <span className="text-[9px] font-black text-white tracking-widest mt-2 uppercase">Cursor Pro</span>
        </div>
      );
    }

    if (s.includes('linkedin')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#004182] via-[#0A66C2] to-[#3B82F6] flex flex-col items-center justify-center text-white">
          <span className="text-5xl font-black tracking-tighter drop-shadow-md">in</span>
          <span className="text-[9px] font-bold tracking-widest mt-2 bg-white/15 px-2.5 py-0.5 rounded-full">Premium Business</span>
        </div>
      );
    }

    if (s.includes('jio')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2EA4] to-blue-700 flex flex-col items-center justify-center text-white">
          <span className="text-4xl font-black italic tracking-widest drop-shadow-md">Jio</span>
          <span className="text-[9px] font-bold mt-1 bg-white/20 px-2 py-0.5 rounded">Prime Plan</span>
        </div>
      );
    }

    if (s.includes('vpn') || s.includes('surfshark') || s.includes('nordvpn')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#1E3A8A] to-[#0EA5E9]/30 flex flex-col items-center justify-center text-white">
          <span className="text-4xl drop-shadow-md">🛡️</span>
          <span className="text-[9px] font-black tracking-wider mt-2 uppercase text-cyan-400">Secure VPN</span>
        </div>
      );
    }

    if (s.includes('instagram') || s.includes('views') || s.includes('followers')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCB045] flex flex-col items-center justify-center text-white">
          <span className="text-4xl drop-shadow-md">📸</span>
          <span className="text-[9px] font-black tracking-widest mt-2 uppercase bg-white/25 px-2 py-0.5 rounded-full">Booster Pack</span>
        </div>
      );
    }

    // Default Fallback Gradient based on Category Name
    return (
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center text-white p-4 text-center">
        <span className="text-xl font-black uppercase tracking-wider line-clamp-1">{name}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest mt-1.5 bg-white/20 px-2 py-0.5 rounded-full">Premium Service</span>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[175px] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shadow-sm">
      <motion.div
        className="w-full h-full relative cursor-pointer"
        whileHover={{ 
          scale: 1.05,
          rotate: 1.5,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        {renderBanner()}
      </motion.div>
    </div>
  );
}
