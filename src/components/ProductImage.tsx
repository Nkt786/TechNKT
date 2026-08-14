'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProductImageProps {
  slug?: string;
  name?: string;
}

export default function ProductImage({ slug = "", name = "" }: ProductImageProps) {
  const s = (slug || "").toLowerCase();

  // Render ultra-premium, dark glassmorphic vector brand artwork
  const renderBanner = () => {
    if (s.includes('netflix')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#18080A] via-[#0D0507] to-black flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-red-800/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <span className="text-4xl font-black tracking-tighter text-red-600 drop-shadow-[0_4px_16px_rgba(220,38,38,0.6)] font-sans">
              NETFLIX
            </span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded-full">
              4K Ultra HD • Private
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('prime') || s.includes('amazon')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#07131F] via-[#090E17] to-black flex flex-col items-center justify-center text-white p-4 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#00A8E1]/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1">
            <span className="text-2xl font-black italic tracking-tight text-white flex items-center gap-1">
              prime <span className="text-[#00A8E1]">video</span>
            </span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded-full">
              Official License
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('spotify')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#06180C] via-[#08100A] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#1DB954]/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 fill-[#1DB954] drop-shadow-[0_2px_10px_rgba(29,185,84,0.5)]" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 4.1-1 7.6-.5 10.4 1.2.3.2.4.6.2.8zm1.5-3.3c-.3.4-.8.5-1.2.3-2.8-1.7-7.2-2.2-10.6-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.9-1.2 8.7-.6 11.9 1.3.4.2.5.8.3 1.2zm.1-3.4C15.5 8.4 9.6 8.2 6.2 9.2c-.5.2-1.1-.1-1.3-.7-.2-.5.1-1.1.7-1.3C9.2 6 15.8 6.2 20 8.7c.5.3.6.9.3 1.4-.3.5-1 .6-1.5.3z" />
              </svg>
              <span className="text-lg font-black tracking-tight text-white">Spotify</span>
            </div>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/25 px-2 py-0.5 rounded-full">
              Individual Premium
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('canva')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#120722] via-[#0E061A] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#7D2AE8]/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <span className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-[#00C4CC] via-[#7D2AE8] to-[#FF4E7E] bg-clip-text text-transparent drop-shadow-md">
              Canva
            </span>
            <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-purple-300 bg-purple-500/10 border border-purple-500/25 px-2 py-0.5 rounded-full">
              Pro Education & Team
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('claude')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C140C] via-[#120D08] to-black flex flex-col items-center justify-center text-white p-4 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-600/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500 text-lg font-bold">✦</span>
              <span className="text-2xl font-serif font-black tracking-tight text-[#E8DCC8]">Claude</span>
            </div>
            <span className="text-[8px] font-mono font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
              Sonnet 3.7 & Opus Pro
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('gemini') || s.includes('google')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1026] via-[#070814] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-indigo-400">✦</span> Gemini Advanced
            </span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-full">
              Google Workspace AI
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('chatgpt') || s.includes('openai') || s.includes('gpt')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#061814] via-[#070F0D] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-emerald-400">⚡</span> ChatGPT Plus
            </span>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
              GPT-4o & Canvas Access
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('linkedin')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#081526] via-[#060D17] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-blue-600/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#0A66C2] flex items-center justify-center font-bold text-lg text-white shadow-md">
                in
              </div>
              <span className="text-lg font-black tracking-tight text-white">LinkedIn</span>
            </div>
            <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded-full">
              Premium Business & Career
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('cursor') || s.includes('copilot') || s.includes('github') || s.includes('code')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B101E] via-[#070912] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="text-xl font-black tracking-tight text-white font-mono">Dev Pro</span>
            </div>
            <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-full">
              AI Code Assistant
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('youtube')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#180808] via-[#0F0505] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-red-600/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-8 rounded bg-red-600 flex items-center justify-center shadow-md">
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">YouTube</span>
            </div>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded-full">
              Premium • Background Play
            </span>
          </div>
        </div>
      );
    }

    if (s.includes('vpn') || s.includes('surfshark') || s.includes('nordvpn')) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#06151E] via-[#050D14] to-black flex flex-col items-center justify-center text-white overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 text-lg">🛡️</span>
              <span className="text-lg font-black tracking-tight text-white">Secure VPN</span>
            </div>
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-full">
              Encrypted Private Nodes
            </span>
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#121420] via-[#0A0B12] to-black flex flex-col items-center justify-center text-white p-4 text-center overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-purple-600/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="text-base font-black tracking-tight line-clamp-1 text-white">
            {name}
          </span>
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded-full">
            Verified Digital Key
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[155px] overflow-hidden rounded-2xl bg-card border border-border shadow-inner">
      {/* Specular gloss top reflection */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none z-20" />
      <motion.div
        className="w-full h-full relative cursor-pointer"
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      >
        {renderBanner()}
      </motion.div>
    </div>
  );
}
