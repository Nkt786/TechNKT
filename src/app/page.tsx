import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Layers, Sparkles, Terminal, ChevronRight, Star } from 'lucide-react';
import HolographicStack from '@/components/HolographicStack';
import ScrollReveal from '@/components/ScrollReveal';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { PRODUCTS } from '@/data/products';
import ProductImage from '@/components/ProductImage';

export const metadata = {
  title: "TechNKT - Premium Digital Systems & Enterprise Solutions",
  description: "A premium digital agency and product hub building custom websites, mobile apps, AI automation pipelines, and robust KPO/BPO operations for smart teams.",
};

export default function HomePage() {
  const highlightServices = [
    {
      title: "Custom Web & SaaS Development",
      icon: "🚀",
      desc: "High-concurrency, SEO-focused web apps built using React, Next.js, and TypeScript, optimized for speed and conversion.",
      bullets: ["SaaS Dashboards", "Headless E-Commerce", "Admin ERP Systems"]
    },
    {
      title: "Mobile App Architectures",
      icon: "📱",
      desc: "Cross-platform iOS and Android apps powered by Flutter and React Native with low-latency database sync.",
      bullets: ["Native Integrations", "Offline-First Sync", "UI/UX Figma Prototypes"]
    },
    {
      title: "AI Workflows & LLM Plugins",
      icon: "🤖",
      desc: "Deploy autonomous AI agents, automated WhatsApp responders, and intelligence layers using OpenAI, Claude, and Gemini APIs.",
      bullets: ["AI Chatbots", "Workflow Automation", "API Middleware"]
    }
  ];

  const caseStudies = [
    {
      title: "Headless Commerce Portal",
      slug: "headless-commerce",
      category: "E-Commerce",
      desc: "Designed and engineered a sub-second load-time storefront with customized state management, server-side caching, and secure UPI payment gateways.",
      color: "from-blue-600/30 via-indigo-600/5 to-transparent",
      tag: "Case Study 01"
    },
    {
      title: "Automated AI Intake CRM",
      slug: "ai-crm",
      category: "Artificial Intelligence",
      desc: "Built a customized client intake workflow hooked to WhatsApp API nodes, leveraging Claude 3.5 Sonnet to categorize leads and trigger calendar events.",
      color: "from-amber-600/30 via-orange-600/5 to-transparent",
      tag: "Case Study 02"
    },
    {
      title: "Zero-Downtime AWS Migration",
      slug: "cloud-migration",
      category: "Cloud & DevOps",
      desc: "Migrated a legacy database to containerized Docker nodes running behind AWS Elastic Load Balancers, securing zero-loss transaction records.",
      color: "from-emerald-600/30 via-teal-600/5 to-transparent",
      tag: "Case Study 03"
    }
  ];

  const timelineSteps = [
    { num: "01", title: "Requirement Audit", desc: "Understand your operational limits and target deliverables." },
    { num: "02", title: "Technical Proposal", desc: "Drafting staging milestones, database charts, and costs." },
    { num: "03", title: "Figma UI/UX Design", desc: "Creating light & dark visual prototypes for review." },
    { num: "04", title: "Full-Stack Dev", desc: "Writing clean, scalable code in isolated staging environments." },
    { num: "05", title: "Testing & Auditing", desc: "Running security checks, lints, and responsive view tests." },
    { num: "06", title: "Production Launch", desc: "Routing DNS, configuring CDNs, and going live on secure clouds." }
  ];

  const brandTicker = [
    "Next.js", "React", "Tailwind CSS", "Framer Motion", "TypeScript", 
    "Node.js", "PostgreSQL", "Docker", "AWS", "Claude AI", "OpenAI"
  ];

  return (
    <div className="relative overflow-hidden w-full space-y-24 pb-20">
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none -z-10 h-full opacity-60" />

      {/* Floating Lava Glow Patches */}
      <div className="absolute top-[-5%] left-[-15%] w-[850px] h-[850px] rounded-full bg-purple-650/10 dark:bg-purple-900/10 blur-[150px] pointer-events-none -z-10 animate-glow-left" />
      <div className="absolute top-[25%] right-[-15%] w-[800px] h-[800px] rounded-full bg-indigo-500/10 dark:bg-indigo-900/10 blur-[150px] pointer-events-none -z-10 animate-glow-right" />
      <div className="absolute top-[50%] left-[5%] w-[750px] h-[750px] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-900/10 blur-[150px] pointer-events-none -z-10 animate-glow-center" />
      <div className="absolute top-[75%] right-[-10%] w-[800px] h-[800px] rounded-full bg-purple-500/10 dark:bg-purple-900/10 blur-[150px] pointer-events-none -z-10 animate-glow-left" />

      {/* --- HERO SECTION --- */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 md:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3.5 py-1.5 text-xs font-bold text-foreground/80 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
            Premium Digital Products & Services
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-none">
              Everything You Need.<br />
              <span className="text-blue-650 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                One Powerful Platform.
              </span>
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground max-w-xl">
              TechNKT is a premium digital product hub and full-stack software agency. We build lightning-fast web architectures, mobile apps, custom AI workflows, and distribute high-warranty developer assets.
            </p>
          </div>

          {/* Inline trust tags */}
          <div className="flex flex-wrap gap-4 text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/80">
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-blue-500 fill-current" /> Instant Key Delivery</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> NDA Guaranteed</span>
            <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-blue-500" /> 100% SLA Support</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/95 px-7 py-3.5 text-xs font-extrabold text-white shadow-md shadow-blue-500/10 transition-all text-center cursor-pointer"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-xs font-extrabold text-foreground hover:bg-muted shadow-sm transition-all"
            >
              View Services
            </Link>
          </div>
        </div>

        {/* Right Column: Floating Product Visuals */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center pt-8 lg:pt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl -z-10" />
          <HolographicStack />
        </div>
      </section>

      {/* --- GRADIENT FEATURE MARQUEE STRIP --- */}
      <section className="w-full overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-3.5 border-y border-white/10 relative z-20">
        <div className="flex w-max select-none">
          <div className="flex gap-16 items-center animate-marquee whitespace-nowrap text-white font-extrabold text-[10px] uppercase tracking-widest px-8">
            <span>Instant Delivery</span> <span>•</span>
            <span>Verified Digital Products</span> <span>•</span>
            <span>Affordable Pricing</span> <span>•</span>
            <span>Secure Payments</span> <span>•</span>
            <span>24/7 Support</span> <span>•</span>
          </div>
          <div className="flex gap-16 items-center animate-marquee whitespace-nowrap text-white font-extrabold text-[10px] uppercase tracking-widest px-8" aria-hidden="true">
            <span>Instant Delivery</span> <span>•</span>
            <span>Verified Digital Products</span> <span>•</span>
            <span>Affordable Pricing</span> <span>•</span>
            <span>Secure Payments</span> <span>•</span>
            <span>24/7 Support</span> <span>•</span>
          </div>
        </div>
      </section>

      {/* --- BRAND TICKER (Infinite Marquee) --- */}
      <section className="border-y border-border/80 bg-card/40 py-5 overflow-hidden relative z-20">
        <div className="flex items-center gap-8 select-none">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-6 shrink-0 z-10">
            Stack Focus &mdash;
          </span>
          <div className="flex w-max overflow-hidden relative">
            <div className="flex gap-10 items-center animate-marquee whitespace-nowrap text-xs font-bold text-foreground/80 pr-10">
              {brandTicker.map((brand, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {brand}
                </span>
              ))}
            </div>
            <div className="flex gap-10 items-center animate-marquee whitespace-nowrap text-xs font-bold text-foreground/80 pr-10" aria-hidden="true">
              {brandTicker.map((brand, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="mx-auto max-w-7xl px-6 space-y-12">
        <ScrollReveal className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block">
            Browse By Focus
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Explore Premium Categories
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Directly browse our active catalogs for software, API passes, business suites, and design tools.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "AI Tools", icon: "🤖", desc: "ChatGPT, Claude, Gemini APIs", count: 8 },
            { name: "Developer Tools", icon: "💻", desc: "Copilot, Cursor, JetBrains", count: 12 },
            { name: "Creative Software", icon: "🎨", desc: "Canva, Adobe slots, Assets", count: 15 },
            { name: "OTT", icon: "🎬", desc: "Netflix, Prime, Spotify slots", count: 9 },
            { name: "Cloud Credits", icon: "☁️", desc: "AWS, GCP, DigitalOcean keys", count: 6 },
            { name: "VPN", icon: "🛡️", desc: "NordVPN, Surfshark, Express", count: 8 },
            { name: "Productivity", icon: "📅", desc: "LinkedIn, Notion, Office 365", count: 11 },
            { name: "Website Development", icon: "🚀", desc: "Landing portals, SEO, Apps", count: 9 }
          ].map((cat, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.03}
              className="group relative rounded-2xl border border-border/80 bg-card/45 backdrop-blur-xs p-5.5 hover:border-primary/45 transition-all flex flex-col justify-between h-[155px] cursor-pointer"
            >
              <div className="space-y-2.5">
                <span className="text-2xl filter drop-shadow-sm select-none">{cat.icon}</span>
                <div>
                  <h3 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-muted-foreground tracking-widest pt-2 border-t border-border/40">
                <span>{cat.count} items</span>
                <Link href="/products" className="group-hover:text-primary flex items-center gap-0.5 transition-colors">
                  Browse
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- FEATURED PRODUCT SHOWCASE --- */}
      <section className="mx-auto max-w-7xl px-6 space-y-12">
        <ScrollReveal className="space-y-3 text-left">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block">
            Verified Subscriptions
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Popular licenses & access keys
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Get instant activation, active-period replacement warranties, and complete customer assistance directly on WhatsApp.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.filter(p => p.isFeatured || p.isPopular).slice(0, 4).map(product => {
            const strikePrice = Math.round(product.price * 1.6);
            return (
              <ScrollReveal
                key={product.id}
                className="rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xs overflow-hidden min-h-[390px] sm:h-[400px] flex flex-col justify-between hover:border-primary/45 transition-all group animate-fade-up"
              >
                <Link href={`/${product.slug}`} className="h-44 w-full relative border-b border-border/60 overflow-hidden block">
                  <ProductImage slug={product.slug} name={product.name} />
                </Link>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{product.category}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-[10px] font-bold text-foreground">4.9</span>
                      </div>
                    </div>
                    <Link href={`/${product.slug}`} className="block">
                      <h3 className="text-xs font-black text-foreground hover:text-primary transition-colors leading-snug line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="pt-3.5 border-t border-border/60 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-primary">₹{product.price}</span>
                        <span className="text-[9px] text-muted-foreground line-through">₹{strikePrice}</span>
                      </div>
                      <span className="text-[8px] text-muted-foreground block">/ {product.duration}</span>
                    </div>

                    <Link
                      href={`/${product.slug}`}
                      className="px-3.5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-[10px] font-black text-white cursor-pointer transition-all"
                    >
                      Buy Slot
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-border px-6 py-3 text-xs font-black text-foreground hover:bg-muted transition-all"
          >
            <span>View All 100+ Products</span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </section>

      {/* --- SELECTED PORTFOLIO WORK --- */}
      <section className="mx-auto max-w-7xl px-6 space-y-12">
        <ScrollReveal className="space-y-3 text-left">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full inline-block">
            Engineering Showcases
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
            Selected Works &<br />
            <span className="text-indigo-600 dark:text-indigo-400">
              Staging Implementations
            </span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl">
            A small look at production systems structured and optimized by our remote developer teams.
          </p>
        </ScrollReveal>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
          {caseStudies.map((study, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.08}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xs p-7.5 shadow-sm transition-all duration-300 h-[360px] hover:border-primary/45"
            >
              {/* Internal glow */}
              <div className={`absolute bottom-[-10%] right-[-10%] w-32 h-32 rounded-full bg-gradient-to-br ${study.color} opacity-40 blur-2xl group-hover:opacity-75 transition-opacity pointer-events-none`} />

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                    {study.tag}
                  </span>
                  <span className="text-[8px] font-black tracking-wider text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
                    {study.category}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-lg text-foreground group-hover:text-indigo-600 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {study.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border relative z-10">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1 text-[10px] font-black text-foreground group-hover:text-primary uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Consult details
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- CORE SERVICES PREVIEW --- */}
      <section className="mx-auto max-w-7xl px-6 space-y-12">
        <ScrollReveal className="space-y-3 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4.5xl font-black text-foreground">
            Six disciplines, <span className="text-indigo-600 dark:text-indigo-400">one cohesive team</span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            By integrating web, mobile, custom software, AI development, and business management workflows under one hub, we eliminate lost handovers and billing redundancies.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
          {highlightServices.map((service, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.05}
              className="rounded-2xl border border-border/80 bg-card/45 backdrop-blur-xs p-6 space-y-4 hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="text-2xl filter drop-shadow-md select-none">{service.icon}</div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{service.desc}</p>
                </div>
              </div>
              
              <div className="pt-3.5 border-t border-border flex flex-wrap gap-1.5">
                {service.bullets.map((b, bI) => (
                  <span key={bI} className="text-[9px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                    {b}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-border px-6 py-3 text-xs font-black text-foreground hover:bg-muted transition-all"
          >
            <span>View all 9 services</span>
            <ChevronRight className="h-4 w-4 text-indigo-500" />
          </Link>
        </div>
      </section>

      {/* --- DEVELOPMENT TIMELINE PROCESS --- */}
      <section className="mx-auto max-w-7xl px-6 space-y-12">
        <ScrollReveal className="space-y-2 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3.5xl font-black text-foreground">
            Our Development <span className="text-indigo-650 dark:text-indigo-400">Methodology</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            From project requirement discussions to robust production server launches.
          </p>
        </ScrollReveal>

        <div className="relative border-l border-border ml-4 md:ml-0 md:border-l-0 md:grid md:grid-cols-6 gap-4 pt-4">
          {timelineSteps.map((step, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.05}
              className="relative pl-8 md:pl-0 md:text-center md:pt-6 space-y-2.5 pb-8 md:pb-0"
            >
              {/* Circle Connection Node */}
              <div className="absolute left-[-9px] top-1 md:left-1/2 md:top-[-9px] md:-translate-x-1/2 h-4.5 w-4.5 rounded-full bg-card border-2 border-primary shadow-md flex items-center justify-center z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 text-primary font-mono font-bold text-xs">
                {step.num}
              </div>
              <div>
                <h4 className="text-xs font-black text-foreground leading-tight uppercase tracking-wider">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1 md:max-w-[150px] md:mx-auto">
                  {step.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- STATISTICS BOARD --- */}
      <section className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="bg-card border border-border rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-foreground shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent blur-2xl" />
          
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">10K+</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Happy Customers</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black text-blue-650 dark:text-blue-400">500+</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Projects Completed</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black text-emerald-650 dark:text-emerald-400">24/7</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Support Active</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">5+</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Years Experience</div>
          </div>
        </ScrollReveal>
      </section>

      {/* --- HUMOROUS SCROLL TO TOP / START PROJECT CTA --- */}
      <section className="mx-auto max-w-5xl px-6">
        <ScrollReveal className="rounded-3xl border border-border bg-gradient-to-tr from-card to-background p-8 md:p-12 shadow-sm relative overflow-hidden text-center space-y-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 blur-3xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <span className="inline-block text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 border border-primary/10 px-2.5 py-0.5 rounded-full">
              Get Started
            </span>
            <h2 className="text-2xl md:text-4.5xl font-black text-foreground leading-tight">
              Let's make something<br />worth watching.
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Launch websites, custom mobile products, or automate your business support channels with our solution engineers.
            </p>
          </div>

          <div className="flex justify-center gap-4 relative z-10">
            <Link
              href="/contact"
              className="rounded-xl bg-blue-600 hover:bg-blue-750 text-xs font-black text-white px-7 py-3.5 shadow-md shadow-blue-500/10 transition-all cursor-pointer"
            >
              Start Project Inquiry
            </Link>
          </div>

          <ScrollToTopButton />
        </ScrollReveal>
      </section>

    </div>
  );
}
