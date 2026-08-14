import React from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { Sparkles, Terminal } from 'lucide-react';

export const metadata = {
  title: "Enterprise Digital Services - TechNKT",
  description: "Browse our customized agency services ranging from premium web/app development and AI workflow automation to reliable BPO customer support and KPO spreadsheet data management.",
};

export default function ServicesPage() {
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
      accent: "from-blue-600 to-indigo-650",
      border: "border-border/80 hover:border-indigo-500/40 shadow-sm hover:shadow-indigo-500/5"
    },
    {
      title: "Mobile App Development",
      icon: "📱",
      desc: "Native and cross-platform mobile apps built with top-tier UI/UX designs and high-performance backend syncing.",
      bullets: [
        "Android Apps", "iOS Apps", "Flutter Apps", "React Native Apps", "Progressive Web Apps"
      ],
      accent: "from-purple-600 to-pink-650",
      border: "border-border/80 hover:border-purple-500/40 shadow-sm hover:shadow-purple-500/5"
    },
    {
      title: "Software Development",
      icon: "💻",
      desc: "Automate manual business workflows with secure, offline-compatible enterprise desktop and cloud software applications.",
      bullets: [
        "Custom Software", "Billing Software", "Inventory Management", "HRMS", "POS Systems",
        "School Management", "Hospital Management", "Logistics Software", "Business Automation"
      ],
      accent: "from-emerald-600 to-teal-650",
      border: "border-border/80 hover:border-emerald-500/40 shadow-sm hover:shadow-emerald-500/5"
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
      border: "border-border/80 hover:border-amber-500/40 shadow-sm hover:shadow-amber-500/5"
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
      border: "border-border/80 hover:border-cyan-500/40 shadow-sm hover:shadow-cyan-500/5"
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
      border: "border-border/80 hover:border-rose-500/40 shadow-sm hover:shadow-rose-500/5"
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
      border: "border-border/80 hover:border-teal-500/40 shadow-sm hover:shadow-teal-500/5"
    },
    {
      title: "Digital Marketing",
      icon: "📈",
      desc: "Grow your online search visibility, run ads campaigns, and manage social channels to maximize conversion rate.",
      bullets: [
        "SEO", "Local SEO", "Google Ads", "Meta Ads", "Instagram Marketing",
        "Facebook Marketing", "LinkedIn Marketing", "Email Marketing", "Content Marketing", "Branding"
      ],
      accent: "from-fuchsia-600 to-purple-650",
      border: "border-border/80 hover:border-fuchsia-500/40 shadow-sm hover:shadow-fuchsia-550/5"
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
      border: "border-border/80 hover:border-red-500/40 shadow-sm hover:shadow-red-550/5"
    }
  ];

  return (
    <div className="relative overflow-hidden w-full space-y-20 pb-20 pt-10">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none -z-10 h-full opacity-60" />

      {/* Glow Effects */}
      <div className="absolute top-[15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[25%] left-[-10%] w-[650px] h-[650px] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none -z-10 animate-pulse" />

      {/* Header Info */}
      <div className="mx-auto max-w-4xl px-6 space-y-6 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3.5 py-1.5 text-xs font-bold text-foreground/80 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Multi-disciplinary Developer & Marketing Powerhouse
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
          Enterprise Solutions & <br />
          <span className="text-indigo-600 dark:text-indigo-400">
            Custom Development Services
          </span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          From modern web architectures to complete business call centers, we build scale-ready digital solutions configured to resolve your organizational bottlenecks.
        </p>
      </div>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
          {agencyServices.map((service, idx) => (
            <ScrollReveal
              key={idx}
              delay={idx * 0.05}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-7.5 shadow-sm transition-all duration-300 ease-out h-[500px] ${service.border}`}
            >
              {/* Corner accent glow */}
              <div className={`absolute top-0 right-0 w-28 h-28 rounded-full bg-gradient-to-br ${service.accent} opacity-5 blur-2xl group-hover:opacity-20 transition-opacity pointer-events-none`} />

              <div className="space-y-4 overflow-y-auto scrollbar-none pr-1">
                <div className="flex justify-between items-center">
                  <div className="text-3xl filter drop-shadow-md select-none">{service.icon}</div>
                  <span className="text-[8px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-full select-none">
                    Solutions
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-foreground group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    {service.desc}
                  </p>
                </div>

                {/* Sub features list */}
                <div className="pt-3 border-t border-border">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                    {service.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex gap-1.5 items-center text-[11px] text-foreground/80 hover:text-foreground transition-colors">
                        <Terminal className="h-3 w-3 text-indigo-500 shrink-0" />
                        <span className="truncate">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action triggers */}
              <div className="pt-4 mt-4 border-t border-border grid grid-cols-2 gap-3 shrink-0">
                <a
                  href={`https://wa.me/919822587641?text=Hello%20TechNKT,%20I%20am%20interested%20in%2520a%2520quote%252520for%2520${encodeURIComponent(service.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white py-3 transition-all shadow-md text-center cursor-pointer"
                >
                  Get Quote
                </a>
                <a
                  href={`https://wa.me/919822587641?text=Hello%20TechNKT,%20I%20want%20to%2520talk%2520to%2520an%2520expert%2520regarding%2520${encodeURIComponent(service.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground py-3 transition-colors text-center cursor-pointer"
                >
                  Talk to Expert
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
