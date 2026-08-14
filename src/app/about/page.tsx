import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { ShieldCheck, Heart, UserCheck, Code, Globe } from 'lucide-react';

export const metadata = {
  title: "About Our Agency - TechNKT",
  description: "Learn more about TechNKT, our senior development teams, client-oriented operations, non-disclosure agreement protection, and global cloud infrastructure.",
};

export default function AboutPage() {
  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "100+", label: "Premium Products" },
    { value: "500+", label: "Projects Delivered" },
    { value: "24/7", label: "Active Support" }
  ];

  const values = [
    {
      title: "Senior Technical Team",
      desc: "Our architects and full-stack engineers have years of hands-on experience building web portals, API middleware, and automated databases.",
      icon: <Code className="h-5 w-5 text-purple-500" />
    },
    {
      title: "NDAs & IP Protection",
      desc: "We prioritize confidentiality. Every custom software, web app, and AI workflow is protected by rigid bilateral Non-Disclosure Agreements.",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />
    },
    {
      title: "Dedicated Management",
      desc: "No lost handovers. Enjoy a single, direct point of contact on Slack or WhatsApp for real-time development tracking and reports.",
      icon: <UserCheck className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Scalable Infrastructure",
      desc: "We configure robust CDN load-balancers, high-capacity databases, and server containers capable of managing millions of active sessions.",
      icon: <Globe className="h-5 w-5 text-pink-500" />
    }
  ];

  return (
    <div className="relative overflow-hidden w-full space-y-20 pb-20 pt-10">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none -z-10 h-full opacity-60" />

      {/* Glow Effects */}
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-650/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Header Info */}
      <div className="mx-auto max-w-4xl px-6 space-y-6 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3.5 py-1.5 text-xs font-bold text-foreground/80 shadow-sm">
          <Heart className="h-3.5 w-3.5 text-indigo-500" />
          Who We Are
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
          Pioneering Digital <span className="text-indigo-600 dark:text-indigo-400">Solutions & Scale</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          TechNKT serves as a multidisciplinary hub combining a fast-delivery marketplace for premium subscriptions with elite, enterprise-level digital engineering services.
        </p>
      </div>

      {/* Narrative Section */}
      <section className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="bg-card border border-border rounded-3xl p-8 md:p-12 space-y-6 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent blur-3xl pointer-events-none" />
          
          <h2 className="text-xl md:text-2xl font-black text-foreground">Our Mission</h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            TechNKT was established to bridge the gap between high development expenses and technical complexity. By integrating certified cloud subscription assets and high-end software keys with end-to-end custom engineering (ranging from CRM systems and API plugins to full BPO client workflows), we help developers and businesses operate smarter and optimize budgets.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            We are dedicated to building long-term relationships through transparent project delivery schedules, rigorous NDA protection systems, active period licensing warranties, and 24/7 client helpdesks.
          </p>
        </ScrollReveal>
      </section>

      {/* Stats Board */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={index}
              delay={index * 0.05}
              className="bg-card border border-border rounded-2xl p-6 text-center space-y-1 shadow-sm"
            >
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Core Values / Strengths Grid */}
      <section className="mx-auto max-w-5xl px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-foreground">Our Key Pillars</h2>
          <p className="text-xs text-muted-foreground">Why top-tier digital architects and enterprise operators trust TechNKT.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((val, index) => (
            <ScrollReveal
              key={index}
              delay={index * 0.08}
              className="rounded-2xl border border-border bg-card p-6 flex gap-4.5 items-start hover:border-border/80 transition-all shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 shadow-inner">
                {val.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-xs text-foreground uppercase tracking-wider">{val.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
