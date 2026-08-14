import React from 'react';
import ContactClient from './ContactClient';

export const metadata = {
  title: "Contact & Helpdesk Support - TechNKT",
  description: "Get in touch with TechNKT solution architects, request project quotes, or check our compiled frequently asked questions about warranties, deliveries, and software keys.",
};

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden w-full space-y-16 pb-20 pt-10">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none -z-10 h-full" />

      {/* Glow Effects */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/15 blur-[130px] pointer-events-none -z-10" />

      <ContactClient />
    </div>
  );
}
