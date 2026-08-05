import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import Catalog from '@/components/Catalog';
import BuyNowButton from '@/components/BuyNowButton';
import { 
  ArrowRight, ShieldCheck, Zap, RefreshCw, MessageCircle, Code2, 
  Layers, Settings, Sparkles, ChevronDown, Check, UserCheck, Heart, 
  HelpCircle, Send, Globe, Layout, Laptop, MessageSquare, Flame, Mail,
  ShoppingBag, Star, Phone
} from 'lucide-react';
import HolographicStack from '@/components/HolographicStack';
import Instagram from '@/components/icons/Instagram';
import ProductImage from '@/components/ProductImage';

export default function HomePage() {
  const agencyServices = [
    {
      title: "Website Development",
      icon: "🚀",
      desc: "Custom-built, high-converting, lightning-fast web applications and e-commerce portals engineered for enterprise scale.",
      bullets: [
        "Business Websites", "Corporate Websites", "E-Commerce Websites", "Portfolio Websites",
        "Landing Pages", "Booking Websites", "Real Estate Websites", "Hospital Websites",
        "Restaurant Websites", "School & College Websites", "News Portals", "Custom Web Applications",
        "SaaS Platforms", "CRM Development", "ERP Development", "Admin Dashboards"
      ],
      accent: "from-blue-600 to-indigo-655",
      border: "border-blue-900/40 hover:border-blue-500/70 shadow-blue-500/5 hover:shadow-blue-500/10"
    },
    {
      title: "Mobile App Development",
      icon: "📱",
      desc: "Native and cross-platform mobile apps built with top-tier UI/UX designs and high-performance backend syncing.",
      bullets: [
        "Android Apps", "iOS Apps", "Flutter Apps", "React Native Apps", "Progressive Web Apps"
      ],
      accent: "from-purple-600 to-pink-650",
      border: "border-purple-900/40 hover:border-purple-500/70 shadow-purple-500/5 hover:shadow-purple-500/10"
    },
    {
      title: "Software Development",
      icon: "💻",
      desc: "Automate manual business workflows with secure, offline-compatible enterprise desktop and cloud software applications.",
      bullets: [
        "Custom Software", "Billing Software", "Inventory Management", "HRMS", "POS Systems",
        "School Management", "Hospital Management", "Logistics Software", "Business Automation"
      ],
      accent: "from-emerald-600 to-teal-655",
      border: "border-emerald-900/40 hover:border-emerald-500/70 shadow-emerald-500/5 hover:shadow-emerald-500/10"
    },
    {
      title: "AI Development",
      icon: "🤖",
      desc: "Harness next-generation LLMs to automate tasks, integrate intelligence, and build custom AI autonomous workflows.",
      bullets: [
        "AI Chatbots", "WhatsApp AI Bots", "OpenAI Integration", "Claude Integration",
        "Gemini Integration", "AI Automation", "Workflow Automation"
      ],
      accent: "from-amber-600 to-yellow-650",
      border: "border-amber-900/40 hover:border-amber-500/70 shadow-amber-500/5 hover:shadow-amber-550/10"
    },
    {
      title: "Cloud & DevOps",
      icon: "☁",
      desc: "Architect secure cloud infrastructure, automate deployment pipelines, and optimize database architectures for speed.",
      bullets: [
        "AWS", "Azure", "Google Cloud", "VPS Setup", "Linux Server", "Docker",
        "CI/CD", "Database Management", "Website Migration", "Performance Optimization"
      ],
      accent: "from-cyan-600 to-blue-650",
      border: "border-cyan-900/40 hover:border-cyan-500/70 shadow-cyan-500/5 hover:shadow-cyan-550/10"
    },
    {
      title: "BPO Services",
      icon: "📞",
      desc: "Inbound and outbound calling resources, front-desk helpdesks, and customer support processes managed 24/7.",
      bullets: [
        "Inbound Calling", "Outbound Calling", "Customer Support", "Technical Support", "Email Support",
        "Live Chat Support", "WhatsApp Support", "Sales Process", "Telecalling", "Lead Generation",
        "Appointment Booking", "Customer Verification", "Help Desk", "Complaint Resolution", "Order Support"
      ],
      accent: "from-rose-600 to-orange-650",
      border: "border-rose-900/40 hover:border-rose-500/70 shadow-rose-500/5 hover:shadow-rose-550/10"
    },
    {
      title: "KPO Services",
      icon: "📊",
      desc: "Outsource research, complex data analytics, spreadsheet management, and back-office financial tasks to verified professionals.",
      bullets: [
        "Data Entry", "Data Processing", "Data Research", "Market Research", "Financial Research",
        "Business Research", "Virtual Assistant", "MIS Reports", "Excel Processing", "Content Moderation",
        "Data Annotation", "Healthcare Back Office", "Legal Process Support", "Accounting Support"
      ],
      accent: "from-teal-600 to-indigo-650",
      border: "border-teal-900/40 hover:border-teal-500/70 shadow-teal-500/5 hover:shadow-teal-550/10"
    },
    {
      title: "Digital Marketing",
      icon: "📈",
      desc: "Grow your online search visibility, run ads campaigns, and manage social channels to maximize conversion rate.",
      bullets: [
        "SEO", "Local SEO", "Google Ads", "Meta Ads", "Instagram Marketing",
        "Facebook Marketing", "LinkedIn Marketing", "Email Marketing", "Content Marketing", "Branding"
      ],
      accent: "from-fuchsia-600 to-purple-655",
      border: "border-fuchsia-900/40 hover:border-fuchsia-500/70 shadow-fuchsia-500/5 hover:shadow-fuchsia-550/10"
    },
    {
      title: "Lead Generation",
      icon: "🎯",
      desc: "Target qualified B2B/B2C leads and warm them up through targeted email, call, and message outreach workflows.",
      bullets: [
        "B2B Leads", "B2C Leads", "Cold Calling", "Email Outreach",
        "WhatsApp Marketing", "CRM Management", "Sales Campaigns"
      ],
      accent: "from-red-600 to-rose-650",
      border: "border-red-900/40 hover:border-red-500/70 shadow-red-500/5 hover:shadow-red-550/10"
    }
  ];

  const timelineSteps = [
    { num: "1️⃣", title: "Requirement Discussion", desc: "Understand your business goals and specific technical needs." },
    { num: "2️⃣", title: "Planning & Proposal", desc: "Drafting timelines, cost parameters, and modular deliverables." },
    { num: "3️⃣", title: "UI/UX Design", desc: "Creating high-fidelity Figma visual prototypes and user flows." },
    { num: "4️⃣", title: "Development", desc: "Writing clean, modular Next.js/React code and database architecture." },
    { num: "5️⃣", title: "Testing & QA", desc: "Unit testing, responsiveness validation, and security auditing." },
    { num: "6️⃣", title: "Deployment", desc: "Setting up fast CDN cloud servers and DNS routing rules." },
    { num: "7️⃣", title: "Support & Maintenance", desc: "24/7 technical monitoring and monthly feature enhancements." }
  ];

  const whyChooseUsFeatures = [
    { title: "Experienced Team", desc: "Senior full-stack developers and marketing specialists with years of expertise." },
    { title: "Affordable Pricing", desc: "Highly competitive developer rates and cost-effective subscription licenses." },
    { title: "Fast Delivery", desc: "We deploy basic mockups in days and process standard purchases in minutes." },
    { title: "NDA Available", desc: "We protect your proprietary data and IP with strict Non-Disclosure Agreements." },
    { title: "Dedicated Project Manager", desc: "Single point of contact on Slack/WhatsApp for real-time progress updates." },
    { title: "Scalable Solutions", desc: "Cloud infrastructures configured to handle millions of active page views." },
    { title: "Latest Technologies", desc: "We build using Next.js, Flutter, Docker, AWS, and cutting-edge LLM APIs." },
    { title: "Long-Term Support", desc: "Full replacement warranty and post-deployment system upgrades." },
    { title: "Transparent Communication", desc: "Regular staging access and honest progress reports." },
    { title: "Enterprise Security", desc: "Database encryption, secure SSL sockets, and strict authorization gates." }
  ];

  const faqs = [
    { q: "How are subscriptions and software keys delivered?", a: "All subscription account credentials, software keys, and invitation links are delivered to your WhatsApp number and Email within 30 to 180 minutes of purchase validation." },
    { q: "Is an NDA (Non-Disclosure Agreement) available for custom projects?", a: "Absolutely! Before starting any custom website, mobile app, or AI automation project, we sign a standard NDA to protect your proprietary logic, assets, and IP." },
    { q: "What is your support and replacement warranty policy?", a: "We offer a 100% full active-period warranty. If any premium credentials or software slot go inactive, drop a message to our WhatsApp support team and we will issue a fresh replacement slot." },
    { q: "How do I request a quote for custom software or app development?", a: "Simply click the 'Get Quote' or 'Talk to Expert' buttons in our Services section, or send a brief description of your requirements via the launch form on WhatsApp. Our solution architects will return a proposal within 24 hours." },
    { q: "Do you provide post-deployment support for mobile apps and websites?", a: "Yes, we provide 30 to 90 days of free post-deployment bug fixing and minor text changes. Long-term support is also available via retainer SLAs." },
    { q: "What technologies do you use for SaaS and E-commerce websites?", a: "We primarily work with Next.js, React, TailwindCSS, TypeScript, Node.js, PostgreSQL, Docker, and AWS. For E-commerce, we build custom headless stores or Shopify architectures depending on scale." },
    { q: "What is your BPO and KPO support team structure?", a: "We operate a hybrid contact center with trained support agents, telecallers, and research analysts. We support inbound/outbound calls, email, and live chat desks with custom dashboards." },
    { q: "Can you help migrate our existing website or database to a new server?", a: "Yes! We specialize in zero-downtime website and database migrations. We will move your system to secure Linux VPS, AWS, or GCP nodes without losing traffic or data." },
    { q: "How does payment work for custom business software?", a: "For custom developments, we work on a milestone-based payment structure (typically 30% advance, 40% after design/first demo, 30% after completion and QA)." },
    { q: "What payment methods are supported on your platform?", a: "We accept all major UPI nodes (Google Pay, PhonePe, Paytm), Netbanking, and Bank Transfers. International payments are handled securely on demand." },
    { q: "Do you provide digital marketing and local SEO growth guarantees?", a: "While search algorithms constantly update, we guarantee data-driven execution. We optimize pages to load in under 1 second, index semantic metadata, and setup target Google/Meta Ads campaigns." },
    { q: "How can I contact the dedicated support team for help?", a: "You can open a support chat on WhatsApp (+91 9822587641), join our Telegram support group (@TechNKT), or shoot an email to support@technkt.in." }
  ];

  const brandTicker = [
    { name: 'Netflix', color: 'text-red-650' },
    { name: 'Prime Video', color: 'text-sky-500' },
    { name: 'Spotify', color: 'text-emerald-500' },
    { name: 'YouTube Premium', color: 'text-rose-600' },
    { name: 'ChatGPT Plus', color: 'text-teal-600' },
    { name: 'Canva Pro', color: 'text-purple-600' },
    { name: 'Apple Music', color: 'text-pink-500' },
    { name: 'Crunchyroll', color: 'text-orange-500' }
  ];

  return (
    <div className="relative overflow-hidden w-full space-y-20 pb-20">
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none -z-10 h-full" />

      {/* Dynamic animated light glows (6 floating lava-lamp style glow patches) */}
      <div className="absolute top-[-5%] left-[-15%] w-[900px] h-[900px] rounded-full bg-purple-600/30 blur-[160px] pointer-events-none -z-10 animate-glow-left" />
      <div className="absolute top-[18%] right-[-15%] w-[800px] h-[800px] rounded-full bg-indigo-500/25 blur-[150px] pointer-events-none -z-10 animate-glow-right" />
      <div className="absolute top-[35%] left-[5%] w-[750px] h-[750px] rounded-full bg-fuchsia-500/20 blur-[160px] pointer-events-none -z-10 animate-glow-center" />
      <div className="absolute top-[52%] right-[-10%] w-[850px] h-[850px] rounded-full bg-purple-500/25 blur-[170px] pointer-events-none -z-10 animate-glow-left" />
      <div className="absolute top-[70%] left-[-10%] w-[800px] h-[800px] rounded-full bg-indigo-500/22 blur-[160px] pointer-events-none -z-10 animate-glow-right" />
      <div className="absolute top-[88%] right-[5%] w-[750px] h-[750px] rounded-full bg-pink-500/18 blur-[150px] pointer-events-none -z-10 animate-glow-center" />

      {/* --- HERO SECTION --- */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 md:pt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 text-xs font-bold text-zinc-300">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            100+ Premium Digital Services
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-black tracking-tight text-white leading-tight">
              Premium Digital<br />
              Solutions for<br />
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Smart People
              </span>
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-zinc-300">
              AI Tools, Softwares, Subscriptions, OTT, Cloud Credits, Web Development & more – all in one place.
            </p>
          </div>

          {/* Inline trust items */}
          <div className="flex flex-wrap gap-4 text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-purple-400" /> Instant Delivery</span>
            <span className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5 text-blue-400" /> 24/7 Support</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Secure & Reliable</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#products"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] px-7 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-purple-600/20 transition-all cursor-pointer text-center"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="https://wa.me/919822587641"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-[#0C0D14] px-7 py-3.5 text-xs font-extrabold text-white hover:bg-zinc-900 shadow-sm transition-all"
            >
              <span>How It Works</span>
              <span className="text-[10px]">▷</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Subscription Stack Card Deck */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-blue-500/10 rounded-3xl blur-3xl -z-10" />
          <HolographicStack />
        </div>
      </section>

      {/* Stats Bar Container */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="bg-[#0C0D14]/80 border border-zinc-900 backdrop-blur-md rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-650/10 text-purple-400 shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-black">10K+</div>
              <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Happy Customers</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-650/10 text-blue-400 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-black">100+</div>
              <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Products</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-650/10 text-amber-400 shrink-0">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <div className="text-base font-black">4.9/5</div>
              <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Rating</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-650/10 text-emerald-400 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-black">100%</div>
              <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Safe & Secure</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ALL PRODUCTS (CATALOG SECTION) --- */}
      <section className="mx-auto max-w-7xl pt-10">
        <Catalog products={PRODUCTS} />
      </section>

      {/* Bottom Trust Ticker */}
      <section className="mx-auto max-w-7xl px-6 py-6 border-t border-zinc-900/60 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-white bg-[#0C0D14]/40 border border-zinc-900/60 rounded-2xl p-6 shadow-md">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-8 w-8 rounded-full bg-purple-650/10 text-purple-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="text-xs font-black">10K+</div>
            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Orders Delivered</div>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-8 w-8 rounded-full bg-blue-650/10 text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div className="text-xs font-black">100+</div>
            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Premium Products</div>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-8 w-8 rounded-full bg-amber-650/10 text-amber-400 flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-xs font-black">24/7</div>
            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Customer Support</div>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-8 w-8 rounded-full bg-yellow-650/10 text-yellow-400 flex items-center justify-center shrink-0">
              <Star className="h-4 w-4 fill-current" />
            </div>
            <div className="text-xs font-black">4.9/5</div>
            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Customer Rating</div>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-8 w-8 rounded-full bg-teal-650/10 text-teal-400 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-xs font-black">99.9%</div>
            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Uptime Guarantee</div>
          </div>
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="h-8 w-8 rounded-full bg-emerald-650/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="text-xs font-black">100%</div>
            <div className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Secure Payments</div>
          </div>
        </div>
      </section>

      {/* --- BUSINESS & AGENCY SERVICES --- */}
      <section id="services" className="mx-auto max-w-7xl px-6 space-y-12 scroll-mt-24">
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-650/10 px-3 py-1 rounded-full inline-block">
            TechNKT Enterprise Services
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            Premium Digital Services & <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Enterprise Solutions
            </span>
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Build websites, mobile apps, AI integrations, BPO calling workflows, KPO spreadsheets, and custom automation tools with our multi-million dollar global developer team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencyServices.map((service, idx) => (
            <div
              key={idx}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-[#0C0D14]/90 p-7.5 shadow-2xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-300 ease-out h-[520px] ${service.border}`}
            >
              {/* Corner accent light */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${service.accent} opacity-5 blur-2xl group-hover:opacity-15 transition-opacity`} />
              
              <div className="space-y-4 overflow-y-auto scrollbar-none pr-1">
                <div className="flex justify-between items-start">
                  <div className="text-3xl filter drop-shadow-md">{service.icon}</div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-purple-400 bg-purple-650/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Enterprise
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mt-1">
                    {service.desc}
                  </p>
                </div>

                {/* Sub services bullets */}
                <div className="pt-2 border-t border-zinc-900/60">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                    {service.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex gap-1.5 items-center text-xs text-zinc-300 hover:text-white transition-colors">
                        <span className="h-1 w-1 rounded-full bg-purple-500 shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Action Buttons (Highly readable text size and font bold) */}
              <div className="pt-4 mt-4 border-t border-zinc-900 grid grid-cols-2 gap-2 shrink-0">
                <a
                  href={"https://wa.me/919822587641?text=Hello%20TechNKT,%20I%20am%20interested%20in%20a%20quote%20for%20" + encodeURIComponent(service.title) + "."}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white py-3 transition-all shadow-md text-center cursor-pointer"
                >
                  Get Quote
                </a>
                <a
                  href={"https://wa.me/919822587641?text=Hello%20TechNKT,%20I%20want%20to%20talk%20to%20an%20expert%20regarding%20" + encodeURIComponent(service.title) + "."}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl border border-zinc-800 bg-[#0C0D14] hover:bg-zinc-900 text-xs font-bold text-zinc-200 py-3 transition-colors text-center cursor-pointer"
                >
                  Talk to Expert
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ANIMATED PROCESS TIMELINE --- */}
      <section className="mx-auto max-w-7xl px-6 space-y-12">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Our Development <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Process</span>
          </h2>
          <p className="text-xs text-zinc-300">
            From initial wireframes to successful cloud deployment - here is how we launch custom software products.
          </p>
        </div>

        <div className="relative border-l border-zinc-900 ml-4 md:ml-0 md:border-l-0 md:grid md:grid-cols-7 gap-4 pt-4">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative pl-8 md:pl-0 md:text-center md:pt-6 space-y-3 pb-8 md:pb-0">
              {/* Circle Connection Node */}
              <div className="absolute left-[-9px] top-1 md:left-1/2 md:top-[-9px] md:-translate-x-1/2 h-4.5 w-4.5 rounded-full bg-[#0C0D14] border-2 border-purple-500 shadow-md flex items-center justify-center z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              </div>
              
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-650/10 border border-purple-650/20 text-purple-400 font-bold text-xs">
                {step.num}
              </div>
              <div>
                <h4 className="text-xs font-black text-white leading-tight">{step.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed mt-1 md:max-w-[140px] md:mx-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- STATISTICS SECTION --- */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-6 gap-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent blur-2xl" />
          
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">100+</div>
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Team Members</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">500+</div>
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Projects Delivered</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">1000+</div>
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Happy Clients</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">24/7</div>
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Support Available</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">99.9%</div>
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Network Uptime</div>
          </div>
          <div className="text-center space-y-1 relative z-10">
            <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">5+</div>
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Years Experience</div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section id="why-choose-us" className="mx-auto max-w-7xl px-6 space-y-12 scroll-mt-24">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-white">
            Why Choose <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TechNKT</span>
          </h2>
          <p className="text-xs text-zinc-300">
            We deliver top-tier, enterprise-ready software products backed by transparent terms and full warranty support.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {whyChooseUsFeatures.map((feat, idx) => (
            <div key={idx} className="rounded-2xl border border-zinc-900 bg-[#0C0D14]/80 p-5 space-y-2 hover:border-zinc-800 transition-all flex flex-col justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Check className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-white tracking-tight">{feat.title}</h3>
                <p className="text-xs text-zinc-300 leading-relaxed mt-1">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="mx-auto max-w-4xl px-6 space-y-8 scroll-mt-24">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-zinc-300">
            Find answers to licensing models, post-delivery support, NDAs, and business billing.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-900 bg-[#0C0D14]/80 p-5 space-y-2"
            >
              <h3 className="font-bold text-sm text-white flex items-center gap-2.5">
                <HelpCircle className="h-4.5 w-4.5 text-purple-500 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- STRONG AGENCY CTA SECTION --- */}
      <section id="contact" className="mx-auto max-w-5xl px-6 scroll-mt-24">
        <div className="rounded-3xl border border-zinc-900 bg-gradient-to-tr from-[#0C0D14] via-[#05050A] to-zinc-950 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 blur-3xl" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 items-center">
            {/* CTA Text */}
            <div className="space-y-6 text-left">
              <div className="space-y-3">
                <span className="inline-block text-[9px] font-black text-purple-400 uppercase tracking-widest bg-purple-650/15 border border-purple-650/30 px-2.5 py-0.5 rounded-full">
                  Partner with TechNKT
                </span>
                <h2 className="text-2xl md:text-3.5xl font-black text-white leading-tight">
                  Ready to Build Your<br />
                  Next Digital Product?
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Build Websites, Mobile Apps, AI Solutions, BPO, KPO, Customer Support, Business Automation and Enterprise Software with TechNKT.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/919822587641?text=Hello%20TechNKT,%20I%20would%20like%20to%20get%20a%20free%20consultation%2520for%2520my%2520project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-black text-white px-5 py-3 shadow-md hover:shadow-lg transition-all"
                >
                  Get Free Consultation
                </a>
                <a
                  href="https://wa.me/919822587641"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-800 bg-[#0C0D14] hover:bg-zinc-900 text-xs font-bold text-zinc-300 px-5 py-3 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Consultation Intake Form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// Client-side Contact Form helper
function ContactForm() {
  return (
    <form
      action="https://wa.me/919822587641"
      method="GET"
      target="_blank"
      className="space-y-4 rounded-2xl border border-zinc-900 bg-[#0C0D14] p-5 shadow-lg text-left"
    >
      <h3 className="text-xs font-black text-white uppercase tracking-wider pb-2 border-b border-zinc-900">
        Launch Project Form
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">
            Your Message
          </label>
          <textarea
            name="text"
            required
            defaultValue="Hello TechNKT, I am looking for a custom solution..."
            rows={3}
            className="w-full rounded-lg border border-zinc-200 bg-transparent p-3 text-xs outline-none focus:border-primary transition-all text-zinc-800 dark:text-zinc-150"
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 py-2 text-xs font-bold text-white shadow-sm hover:shadow transition-all cursor-pointer"
      >
        <MessageCircle className="h-3.5 w-3.5 fill-white" />
        Send Message on WhatsApp
      </button>
    </form>
  );
}
