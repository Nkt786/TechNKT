'use client';

import React, { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { Mail, MessageSquare, ChevronDown, HelpCircle, Send, Sparkles } from 'lucide-react';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Website Development',
    message: ''
  });
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const agencyServices = [
    "Website Development",
    "Mobile App Development",
    "Software Development",
    "AI Development",
    "Cloud & DevOps",
    "BPO Services",
    "KPO Services",
    "Digital Marketing",
    "Lead Generation"
  ];

  const faqs = [
    { q: "How are subscriptions and software keys delivered?", a: "All subscription account credentials, software keys, and invitation links are delivered to your WhatsApp number and Email within 30 to 180 minutes of purchase validation." },
    { q: "Is an NDA (Non-Disclosure Agreement) available for custom projects?", a: "Absolutely! Before starting any custom website, mobile app, or AI automation project, we sign a standard NDA to protect your proprietary logic, assets, and IP." },
    { q: "What is your support and replacement warranty policy?", a: "We offer a 100% full active-period warranty. If any premium credentials or software slot go inactive, drop a message to our WhatsApp support team and we will issue a fresh replacement slot." },
    { q: "How do I request a quote for custom software or app development?", a: "Simply click the 'Get Quote' or 'Talk to Expert' buttons in our Services section, or send a brief description of your requirements via the launch form on WhatsApp. Our solution architects will return a proposal within 24 hours." },
    { q: "Do you provide post-deployment support for mobile apps and websites?", a: "Yes, we provide 30 to 90 days of free post-deployment bug fixing and minor text changes. Long-term support is also available via retainer SLAs." },
    { q: "What is your BPO and KPO support team structure?", a: "We operate a hybrid contact center with trained support agents, telecallers, and research analysts. We support inbound/outbound calls, email, and live chat desks with custom dashboards." },
    { q: "Can you help migrate our existing database to a new server?", a: "Yes! We specialize in zero-downtime database migrations. We will move your system to secure Linux VPS, AWS, or GCP nodes without losing traffic or data." },
    { q: "How does payment work for custom business software?", a: "For custom developments, we work on a milestone-based payment structure (typically 30% advance, 40% after design/first demo, 30% after completion and QA)." },
    { q: "What payment methods are supported on your platform?", a: "We accept all major UPI nodes (Google Pay, PhonePe, Paytm), Netbanking, and Bank Transfers. International payments are handled securely on demand." }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const textMsg = `Hello TechNKT,\n\nName: ${formData.name}\nEmail: ${formData.email}\nInterested Service: ${formData.service}\nMessage: ${formData.message}`;
    const encoded = encodeURIComponent(textMsg);
    window.open(`https://wa.me/919822587641?text=${encoded}`, '_blank');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="mx-auto max-w-7xl px-6 space-y-24">
      
      {/* Contact Channels Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 5 columns: Channels info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3.5xl font-black text-foreground leading-tight">
              Get in Touch with our <br />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Solution Architects</span>
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have questions about project timelines, pricing retainers, NDAs, or custom development flows? Connect with us via any of our active communication hubs.
            </p>
          </div>

          <div className="space-y-4">
            {/* WhatsApp Business */}
            <a 
              href="https://wa.me/919822587641" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-4.5 p-5 border border-border bg-card rounded-2xl hover:border-border/80 hover:scale-[1.01] transition-all group shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0 shadow-inner">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-foreground group-hover:text-indigo-600 transition-colors uppercase tracking-wider">WhatsApp Business</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Quick support: +91 98225 87641</p>
              </div>
            </a>

            {/* Email Contact */}
            <a 
              href="mailto:support@technkt.in" 
              className="flex items-center gap-4.5 p-5 border border-border bg-card rounded-2xl hover:border-border/80 hover:scale-[1.01] transition-all group shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0 shadow-inner">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-foreground group-hover:text-indigo-600 transition-colors uppercase tracking-wider">Email Inquiry</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Official email: support@technkt.in</p>
              </div>
            </a>

            {/* Telegram Helpdesk */}
            <a 
              href="https://t.me/TechNKT" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-4.5 p-5 border border-border bg-card rounded-2xl hover:border-border/80 hover:scale-[1.01] transition-all group shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 shrink-0 shadow-inner">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-foreground group-hover:text-indigo-600 transition-colors uppercase tracking-wider">Telegram Helpdesk</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Community handle: @TechNKT</p>
              </div>
            </a>
          </div>
        </div>

        {/* Right 7 columns: Contact intake form */}
        <div className="lg:col-span-7">
          <ScrollReveal className="bg-card border border-border rounded-3xl p-6.5 md:p-8 shadow-sm relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent blur-3xl pointer-events-none" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider pb-3.5 border-b border-border flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
              Project Intake Request
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-5 relative z-10 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-indigo-500 transition-all text-foreground placeholder-muted-foreground/70"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-indigo-500 transition-all text-foreground placeholder-muted-foreground/70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1.5">Required Service / Solution</label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-indigo-500 transition-all text-foreground cursor-pointer"
                >
                  {agencyServices.map(service => (
                    <option key={service} value={service} className="bg-card text-foreground">{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase mb-1.5">Message / Requirements Description</label>
                <textarea 
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project scope, timeline expectations, or software custom setup requirements..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-indigo-500 transition-all text-foreground placeholder-muted-foreground/70 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-650 hover:bg-indigo-700 py-3.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <MessageSquare className="h-4.5 w-4.5 fill-white stroke-none" />
                Submit and Launch on WhatsApp
              </button>
            </form>
          </ScrollReveal>
        </div>

      </section>

      {/* Accordion FAQ Section */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3.5xl font-black text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-muted-foreground">
            Find clarifications to digital key delivery schedules, project pricing models, NDAs, and warranties.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <ScrollReveal 
                key={idx} 
                delay={idx * 0.04}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <span className="font-extrabold text-xs md:text-sm text-foreground flex items-center gap-3">
                    <HelpCircle className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed pl-12 border-t border-border">
                    {faq.a}
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </section>

    </div>
  );
}
