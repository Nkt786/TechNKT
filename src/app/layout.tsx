import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CheckoutProvider } from "@/components/CheckoutContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import StickyFooterCta from "@/components/StickyFooterCta";
import CheckoutModal from "@/components/CheckoutModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TechNKT - Premium Digital Subscriptions, Software & Web Services",
  description: "Get 100+ premium AI tools, developer software, OTT channels, cloud credits, and professional website development at competitive rates with full period warranty.",
  keywords: ["Claude Pro", "Canva Business", "GitHub Copilot", "Cursor Pro", "LinkedIn Premium", "Netflix 4K", "Website Development", "TechNKT"],
  authors: [{ name: "TechNKT" }],
  metadataBase: new URL("https://technkt.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TechNKT - Premium Digital Solutions",
    description: "100+ premium subscription tools, developer platforms, OTT services, and web development solutions with 100% active warranty support.",
    url: "https://technkt.in",
    siteName: "TechNKT",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechNKT - Premium Digital Solutions",
    description: "Secure, reliable, and premium subscriptions, developer tools, and custom websites.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <CheckoutProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <FloatingContacts />
            <StickyFooterCta />
            <CheckoutModal />
          </CheckoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
