export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
  warranty?: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export const CATEGORIES = [
  "AI Tools",
  "LinkedIn",
  "Developer Tools",
  "Creative Software",
  "OTT",
  "Cloud Credits",
  "VPN",
  "Productivity",
  "Health",
  "Website Development",
  "Instagram Services",
];

export const PRODUCTS: Product[] = [
  // --- LINKEDIN ---
  {
    id: "linkedin-premium-business-2m-1yr",
    name: "LinkedIn Premium Business – 2M / 1YR",
    slug: "linkedin-premium-business",
    category: "LinkedIn",
    price: 3499,
    duration: "1 Year / 2M options",
    features: [
      "Access to Business Insights",
      "15 InMail credits per month",
      "Who's viewed your profile",
      "Unlimited people browsing",
      "Full warranty support"
    ],
    isFeatured: true,
    warranty: "Full Period Warranty",
    description: "Accelerate your professional growth and business outreach with LinkedIn Premium Business. Unlock key sales metrics, send direct InMail messages, and discover who is viewing your professional profile.",
    seoTitle: "Buy LinkedIn Premium Business Subscription - TechNKT",
    seoDescription: "Get LinkedIn Premium Business at the best prices on TechNKT. Unlock 15 InMail credits, profile views, and deep business analytics with full warranty."
  },
  {
    id: "linkedin-premium-new-user-3m",
    name: "LinkedIn Premium (New User) – 3M",
    slug: "linkedin-premium",
    category: "LinkedIn",
    price: 299,
    duration: "3 Months",
    features: [
      "Special offer for new users",
      "InMail credits included",
      "See who viewed your profile",
      "Learn with LinkedIn Learning",
      "Instant activation"
    ],
    isPopular: true,
    warranty: "Instant Activation",
    description: "Try LinkedIn Premium with a special 3-month access pass designed exclusively for new users. Boost your search visibility, access professional courses, and stand out to hiring recruiters.",
    seoTitle: "LinkedIn Premium 3 Months (New User) at ₹299 - TechNKT",
    seoDescription: "Unlock LinkedIn Premium for 3 months at just ₹299. Access LinkedIn Learning, InMail, and premium profile badges today. Safe and reliable."
  },
  {
    id: "linkedin-all-in-one-3m",
    name: "LinkedIn All-in-One – 3M",
    slug: "linkedin-all-in-one",
    category: "LinkedIn",
    price: 999,
    duration: "3 Months",
    features: [
      "Combines Business & Career tools",
      "InMail credits boosted",
      "Full search filters unlock",
      "LinkedIn Learning access",
      "Priority customer assistance"
    ],
    warranty: "90 Days Warranty",
    description: "Get the complete LinkedIn package combining the features of LinkedIn Business and Career plans. Ideal for freelancers, active job seekers, and digital marketers.",
    seoTitle: "LinkedIn All-in-One 3-Month Plan - TechNKT",
    seoDescription: "Unlock all LinkedIn premium services in one bundle for 3 months. InMails, premium courses, and advanced analytics included."
  },
  {
    id: "linkedin-sales-navigator-advanced-1m",
    name: "LinkedIn Sales Navigator Advanced – 1M",
    slug: "linkedin-sales-navigator",
    category: "LinkedIn",
    price: 2499,
    duration: "1 Month",
    features: [
      "Advanced Lead and Account Search",
      "50 InMail messages per month",
      "Custom list creation",
      "Alerts on leads and accounts",
      "Seamless CRM integrations"
    ],
    warranty: "1 Month Warranty",
    description: "The ultimate B2B sales intelligence tool. LinkedIn Sales Navigator Advanced allows sales professionals to find, target, and build relationships with key decision-makers.",
    seoTitle: "Buy LinkedIn Sales Navigator Advanced 1 Month - TechNKT",
    seoDescription: "Get premium B2B leads. Buy LinkedIn Sales Navigator Advanced for 1 Month with full search filters, CRM integration, and InMail credits."
  },
  {
    id: "linkedin-business-1yr",
    name: "LinkedIn Business – 1YR",
    slug: "linkedin-business-1yr",
    category: "LinkedIn",
    price: 6499,
    duration: "1 Year",
    features: [
      "15 InMail credits monthly",
      "Deep company growth insights",
      "Unlimited profile browsing",
      "Salary and job search insights",
      "100% full year warranty"
    ],
    warranty: "1 Year Full Warranty",
    description: "Keep your professional network running at full capacity for an entire year. TechNKT offers LinkedIn Business yearly licenses with absolute safety and continuous warranty support.",
    seoTitle: "LinkedIn Business Yearly Plan (1 Year Subscription) - TechNKT",
    seoDescription: "Maximize your business development. Buy LinkedIn Business 1 Year Subscription at the most affordable corporate discount rates."
  },
  {
    id: "linkedin-career-1yr",
    name: "LinkedIn Career – 1YR",
    slug: "linkedin-career-1yr",
    category: "LinkedIn",
    price: 5499,
    duration: "1 Year",
    features: [
      "5 InMail credits monthly",
      "Stand out to recruiters",
      "Compare yourself with other applicants",
      "Full LinkedIn Learning library",
      "Full period warranty"
    ],
    warranty: "1 Year Full Warranty",
    description: "Invest in your career progression. The LinkedIn Career yearly plan helps you get noticed by employers, prepare for interviews, and learn new skills with professional validation.",
    seoTitle: "LinkedIn Career 1 Year Premium Subscription - TechNKT",
    seoDescription: "Land your dream job. Purchase a 1-year LinkedIn Career subscription with full warranty. Premium courses and recruiter visibility unlocked."
  },

  // --- AI TOOLS ---
  {
    id: "claude-pro-3m",
    name: "Claude Pro – 3M",
    slug: "claude-pro",
    category: "AI Tools",
    price: 8999,
    duration: "3 Months",
    features: [
      "Access to Claude 3.5 Sonnet & Opus",
      "5x more usage than free tier",
      "Create custom Claude Projects",
      "Upload complex code and documents",
      "Fast response speeds during peak times"
    ],
    isFeatured: true,
    warranty: "90 Days Warranty",
    description: "Claude Pro offers access to Anthropic's most advanced AI models. Get five times more usage compared to the free tier, custom project workspaces, and state-of-the-art coding assistance.",
    seoTitle: "Buy Claude Pro 3-Month Subscription - TechNKT",
    seoDescription: "Get premium access to Anthropic's Claude Pro for 3 Months. Boost productivity with advanced reasoning, coding, and document analysis."
  },
  {
    id: "gemini-pro-18m",
    name: "Google AI Gemini Pro – 18M",
    slug: "gemini-pro",
    category: "AI Tools",
    price: 599,
    duration: "18 Months",
    features: [
      "Access to Google Gemini Advanced models",
      "Integrates with Gmail, Docs, and Drive",
      "Massive context window support",
      "Superior multimodal capabilities",
      "Long-term 18-month warranty support"
    ],
    isPopular: true,
    warranty: "18 Months Warranty",
    description: "Experience the next generation of Google's AI with Gemini Pro. Fully integrated into your Google Workspace, it provides advanced analysis, coding, writing, and logic processing.",
    seoTitle: "Google AI Gemini Pro 18 Months Subscription - TechNKT",
    seoDescription: "Purchase Google Gemini Pro for 18 Months at an unbeatable rate of ₹599. Get a premium multimodal AI assistant with long-term warranty."
  },
  {
    id: "super-grok",
    name: "Super Grok",
    slug: "super-grok",
    category: "AI Tools",
    price: 699,
    duration: "1 Month",
    features: [
      "Real-time access to X data",
      "Uncensored, witty AI responses",
      "Image generation & file analysis",
      "Premium account on X (Twitter)",
      "Instant activation"
    ],
    warranty: "Full Month Warranty",
    description: "Get real-time insights and opinions powered by xAI. Grok is connected to live data from X, providing you with up-to-the-minute updates and premium AI chat benefits.",
    seoTitle: "Buy Super Grok Premium Subscription - TechNKT",
    seoDescription: "Get Super Grok access with real-time news search, image generation, and a premium X account at a discounted monthly price."
  },
  {
    id: "gpt-api-credits",
    name: "GPT API Credits",
    slug: "gpt-api-credits",
    category: "AI Tools",
    price: 999,
    duration: "Flexible Credits",
    features: [
      "OpenAI API credits for developers",
      "Access GPT-4o, GPT-4, DALL-E 3",
      "Low latency, high rate limits",
      "Compatible with any API framework",
      "Safe, verified credits"
    ],
    warranty: "Verified Balance",
    description: "Get verified OpenAI API credits to power your custom AI applications, chatbots, or autonomous agents. Skip credit card setups and start coding immediately.",
    seoTitle: "Buy OpenAI GPT API Credits at Discount - TechNKT",
    seoDescription: "Power your apps with OpenAI GPT-4 API credits. Purchase safe, pre-loaded API balances at TechNKT for developer software."
  },
  {
    id: "microsoft-api-credits",
    name: "Microsoft API Credits",
    slug: "microsoft-api-credits",
    category: "AI Tools",
    price: 1499,
    duration: "Flexible Credits",
    features: [
      "Azure OpenAI and Cognitive Services",
      "Access GPT-4, custom vision, translation",
      "Enterprise-grade reliability & security",
      "Official developer integration keys",
      "100% genuine activation"
    ],
    warranty: "Verified Balance",
    description: "Azure cognitive services and OpenAI integrations. These Microsoft API credits allow you to build scalable AI systems using Microsoft's highly secure cloud endpoints.",
    seoTitle: "Buy Microsoft Azure API Credits - TechNKT",
    seoDescription: "Access Azure cognitive services and OpenAI APIs. Buy Microsoft API credits with instant delivery and secure developer setup."
  },
  {
    id: "deepseek-api-credits",
    name: "DeepSeek API Credits",
    slug: "deepseek-api-credits",
    category: "AI Tools",
    price: 499,
    duration: "Flexible Credits",
    features: [
      "Extremely cost-effective reasoning model",
      "Access DeepSeek-V3 and DeepSeek-R1",
      "Excellent coding and math processing",
      "Official API endpoints compatible",
      "Instant top-up"
    ],
    isPopular: true,
    warranty: "Instant Verification",
    description: "DeepSeek API credits unlock the highly acclaimed DeepSeek coder and reasoning models. Renowned for top-tier open-source benchmarks and extremely low input/output costs.",
    seoTitle: "Buy DeepSeek API Credits (DeepSeek-R1 & V3) - TechNKT",
    seoDescription: "Integrate DeepSeek-R1 and V3 reasoning models. Buy affordable DeepSeek API credits at TechNKT for fast coding automation."
  },
  {
    id: "meta-api-credits",
    name: "Meta API Credits",
    slug: "meta-api-credits",
    category: "AI Tools",
    price: 499,
    duration: "Flexible Credits",
    features: [
      "Llama 3.1 & 3.2 APIs",
      "High performance open weights deployment",
      "Fast response generation",
      "Perfect for open source model pipelines",
      "Full setup guide included"
    ],
    warranty: "Verified Balance",
    description: "Deploy and access Meta Llama models through high-quality hosted API channels. Perfect for developers who want private, robust, and cost-effective AI completions.",
    seoTitle: "Meta Llama API Credits - TechNKT",
    seoDescription: "Access Meta Llama API endpoints. Purchase verified API credits at TechNKT for open-source AI integrations."
  },
  {
    id: "xai-api-credits",
    name: "xAI API Credits",
    slug: "xai-api-credits",
    category: "AI Tools",
    price: 799,
    duration: "Flexible Credits",
    features: [
      "Grok API integration",
      "Real-time search results pipeline",
      "Developer API credentials",
      "Robust rate limits",
      "100% verified setup"
    ],
    warranty: "Verified Balance",
    description: "Integrate Grok's real-time knowledge and witty style into your third-party applications using the official xAI developer API credits.",
    seoTitle: "xAI Grok API Credits for Developers - TechNKT",
    seoDescription: "Connect your applications to Grok's real-time database. Buy xAI API credits with easy activation on TechNKT."
  },
  {
    id: "vapi-credits",
    name: "Vapi Credits",
    slug: "vapi-credits",
    category: "AI Tools",
    price: 999,
    duration: "Flexible Credits",
    features: [
      "Developer voice AI agents",
      "Ultra low-latency conversational AI",
      "Inbound & outbound phone integrations",
      "WebRTC support for custom client apps",
      "Secure key handover"
    ],
    warranty: "Instant Setup",
    description: "Power your real-time voice AI agents with Vapi credits. Ideal for building automated customer service, cold-calling systems, or voice assistants.",
    seoTitle: "Buy Vapi Voice AI Credits - TechNKT",
    seoDescription: "Get Vapi API credits for conversational voice agents. Low-latency, high-reliability voice systems for developers."
  },

  // --- OTT ---
  {
    id: "netflix-4k-1-screen-1m",
    name: "Netflix 4K – 1 Screen",
    slug: "netflix",
    category: "OTT",
    price: 80,
    duration: "1 Month",
    features: [
      "UHD 4K streaming quality",
      "1 Personal Screen with Profile Lock",
      "Works on TV, Phone, and Laptop",
      "No ad interruptions",
      "Full month warranty"
    ],
    isPopular: true,
    warranty: "30 Days Warranty",
    description: "Enjoy your favorite movies and TV shows in stunning Ultra HD. With Netflix 4K (1 Screen), you get a personal profile on a shared account, completely secured and warrantied.",
    seoTitle: "Buy Netflix 4K 1 Screen Premium Subscription - TechNKT",
    seoDescription: "Get Netflix 4K UHD premium subscription for 1 screen at just ₹80/month. Safe profile lock, works on smart TVs and mobile."
  },
  {
    id: "netflix-full-account",
    name: "Netflix Full Account",
    slug: "netflix-full",
    category: "OTT",
    price: 269,
    duration: "1 Month",
    features: [
      "4 screens streaming simultaneously",
      "Fully private login credentials",
      "Change passwords & profile pins",
      "4K Ultra HD resolution",
      "Instant activation"
    ],
    isFeatured: true,
    warranty: "Full period support",
    description: "Get a private, full-access Netflix account that you can share with your family or friends. Supports simultaneous streaming on four screens at maximum quality.",
    seoTitle: "Buy Netflix Full Private Account (4 Screens) - TechNKT",
    seoDescription: "Purchase a full private Netflix account supporting 4K UHD streaming on 4 screens. Customize profiles and passwords with full warranty."
  },
  {
    id: "amazon-prime-1yr",
    name: "Amazon Prime – 1YR",
    slug: "amazon-prime",
    category: "OTT",
    price: 699,
    duration: "1 Year",
    features: [
      "Prime Video ad-free movies & shows",
      "Free fast delivery on Amazon India",
      "Prime Music unlimited listening",
      "Early access to top sales & deals",
      "100% safe official activation"
    ],
    isFeatured: true,
    warranty: "1 Year Full Warranty",
    description: "Get a full year of Amazon Prime benefits including super-fast e-commerce deliveries, ad-free music, and award-winning Amazon Originals on Prime Video.",
    seoTitle: "Amazon Prime 1 Year Premium Subscription - TechNKT",
    seoDescription: "Unlock Amazon Prime for an entire year. Includes Prime Video, Music, and free shopping deliveries with full 12-month warranty."
  },
  {
    id: "amazon-prime-video-1m",
    name: "Amazon Prime Video – 1M",
    slug: "amazon-prime-video-1m",
    category: "OTT",
    price: 49,
    duration: "1 Month",
    features: [
      "HD / 4K streaming quality",
      "Watch Prime original series",
      "Access on mobile & smart TV",
      "Shared profile access",
      "Full month support"
    ],
    warranty: "30 Days Warranty",
    description: "Watch regional and international cinema, comedy specials, and exclusive Prime series on your phone or television at an unbeatable monthly cost.",
    seoTitle: "Buy Amazon Prime Video 1 Month Access - TechNKT",
    seoDescription: "Access Amazon Prime Video for 1 Month. HD streaming on TV and phone for just ₹49. Warrantied and safe."
  },
  {
    id: "amazon-prime-video-6m",
    name: "Amazon Prime Video – 6M",
    slug: "amazon-prime-video-6m",
    category: "OTT",
    price: 169,
    duration: "6 Months",
    features: [
      "6 Months uninterrupted streaming",
      "UHD quality where available",
      "Offline downloads enabled",
      "Warrantied for the full term",
      "Easy and quick login setup"
    ],
    warranty: "6 Months Warranty",
    description: "A half-year subscription plan for Prime Video. Stay updated on the latest shows, web series, and live sporting events on Prime Video without any hassle.",
    seoTitle: "Amazon Prime Video 6 Months Subscription - TechNKT",
    seoDescription: "Save more with the 6-month Prime Video subscription. Seamless logins, offline downloading, and dedicated support."
  },
  {
    id: "hotstar-premium-12m",
    name: "Hotstar Premium – 12M",
    slug: "hotstar-premium",
    category: "OTT",
    price: 1950,
    duration: "12 Months",
    features: [
      "Disney+ Hotstar Premium",
      "Stream on up to 4 devices in 4K",
      "Live sports, IPL, and ICC events",
      "Ad-free entertainment experience",
      "Full yearly official activation"
    ],
    warranty: "1 Year Full Warranty",
    description: "Watch premium Disney movies, Marvel blockbusters, Hotstar Specials, and enjoy live streaming of all international cricket and sporting events in crystal clear 4K UHD.",
    seoTitle: "Disney+ Hotstar Premium 1 Year Subscription - TechNKT",
    seoDescription: "Get Disney+ Hotstar Premium for 12 months. Stream sports, international shows, and movie blockbusters on 4 devices in 4K."
  },
  {
    id: "hotstar-super-6m",
    name: "Hotstar Super – 6M",
    slug: "hotstar-super",
    category: "OTT",
    price: 499,
    duration: "6 Months",
    features: [
      "Disney+ Hotstar Super Plan",
      "Stream on up to 2 devices in HD",
      "Complete content library included",
      "Live sports and cricket matches",
      "6 months warranty"
    ],
    warranty: "6 Months Warranty",
    description: "A budget-friendly 6-month subscription for Disney+ Hotstar. Stream all shows, sports matches, and movies on your mobile and television in high definition.",
    seoTitle: "Disney+ Hotstar Super 6 Months Plan - TechNKT",
    seoDescription: "Stream live sports and movies on 2 devices with the Hotstar Super 6-month subscription at ₹499."
  },
  {
    id: "sonyliv-premium-1yr",
    name: "SonyLIV Premium – 1YR",
    slug: "sonyliv-premium",
    category: "OTT",
    price: 399,
    duration: "1 Year",
    features: [
      "Access to all international sports",
      "Premium Sony serials & live TV",
      "Watch on Smart TV and Mobile",
      "UHD / HD video streaming quality",
      "12 months absolute warranty"
    ],
    isPopular: true,
    warranty: "1 Year Warranty",
    description: "Watch live UEFA Champions League matches, Sony LIV original series, and popular television serials. Enjoy ad-free premium content for a full year.",
    seoTitle: "SonyLIV Premium 1 Year Subscription - TechNKT",
    seoDescription: "Buy SonyLIV Premium yearly membership. Enjoy live sports, WWE, UEFA, and exclusive series at the lowest price."
  },
  {
    id: "zee5-premium-1yr",
    name: "ZEE5 Premium – 1YR",
    slug: "zee5-premium",
    category: "OTT",
    price: 299,
    duration: "1 Year",
    features: [
      "Access to ZEE5 Originals & Movies",
      "Stream on multiple devices",
      "Ad-free viewing experience",
      "12-month continuous access",
      "Instant activation via code/login"
    ],
    warranty: "1 Year Warranty",
    description: "Get unlimited access to thousands of Bollywood blockbusters, regional language cinema, live news, and exclusive ZEE5 original series for an entire year.",
    seoTitle: "ZEE5 Premium 1 Year Membership - TechNKT",
    seoDescription: "Purchase ZEE5 Premium annual subscription at a discounted rate. Access regional cinema, originals, and live TV channels."
  },
  {
    id: "spotify-premium-1yr",
    name: "Spotify Premium",
    slug: "spotify-premium",
    category: "OTT",
    price: 499,
    duration: "1 Year",
    features: [
      "Ad-free music and podcast listening",
      "Offline downloads (Listen anywhere)",
      "Premium high-fidelity audio quality",
      "Unlimited skips on all tracks",
      "Official account upgrade"
    ],
    isPopular: true,
    warranty: "12 Months Warranty",
    description: "Enjoy pure, uninterrupted audio. With Spotify Premium, download your favorite music playlists offline and experience high-quality playback on any phone or speaker system.",
    seoTitle: "Spotify Premium 1 Year Account Upgrade - TechNKT",
    seoDescription: "Get Spotify Premium for 12 months with ad-free music playback, offline downloads, and high-fidelity sound. Safe upgrade."
  },
  {
    id: "apple-music-6m",
    name: "Apple Music – 6M",
    slug: "apple-music",
    category: "OTT",
    price: 399,
    duration: "6 Months",
    features: [
      "Lossless & Spatial Audio support",
      "Over 100 million songs ad-free",
      "Offline music downloads",
      "Works on Android, iOS, and PC",
      "6-month continuous support"
    ],
    warranty: "6 Months Warranty",
    description: "Dive into rich spatial audio and lossless music streaming. Apple Music offers curated playlists, live radio stations, and a massive catalog with zero advertisements.",
    seoTitle: "Apple Music 6-Month Premium Subscription - TechNKT",
    seoDescription: "Buy Apple Music premium membership for 6 Months. High fidelity lossless audio and offline streaming for Android & iOS."
  },
  {
    id: "apple-tv-12m",
    name: "Apple TV+ – 12M",
    slug: "apple-tv",
    category: "OTT",
    price: 399,
    duration: "12 Months",
    features: [
      "Access to premium Apple Originals",
      "Stunning 4K Dolby Vision quality",
      "Ad-free video streaming",
      "Share with Apple Family sharing",
      "Full year guarantee"
    ],
    warranty: "1 Year Warranty",
    description: "Stream award-winning Apple Original series, films, and live documentaries in premium 4K resolution on Apple TV+, accessible on smart TVs, game consoles, and browsers.",
    seoTitle: "Apple TV+ 1 Year Premium Subscription - TechNKT",
    seoDescription: "Unlock Apple TV+ premium originals for an entire year. 4K Dolby Vision streams, ad-free cinema with full warranty."
  },
  {
    id: "crunchyroll-1yr",
    name: "Crunchyroll – 1YR",
    slug: "crunchyroll-premium",
    category: "OTT",
    price: 699,
    duration: "1 Year",
    features: [
      "Mega Fan tier advantages",
      "Ad-free access to all anime library",
      "Simulcast episodes direct from Japan",
      "Offline viewing & multi-screen",
      "12 months warranty assurance"
    ],
    warranty: "1 Year Full Warranty",
    description: "The ultimate destination for anime lovers. Stream the latest episodes of running shows like One Piece, Jujutsu Kaisen, and Demon Slayer in HD right after they air in Japan.",
    seoTitle: "Crunchyroll Mega Fan 1 Year Subscription - TechNKT",
    seoDescription: "Watch anime ad-free. Buy Crunchyroll Mega Fan 1 Year Subscription with offline downloading, multiple screens, and full support."
  },

  // --- CREATIVE SOFTWARE ---
  {
    id: "adobe-creative-cloud-4m",
    name: "Adobe Creative Cloud – 4M",
    slug: "adobe",
    category: "Creative Software",
    price: 799,
    duration: "4 Months",
    features: [
      "Access to Photoshop, Illustrator, Premiere",
      "20+ professional desktop & mobile apps",
      "100GB of secure cloud storage",
      "Access to Adobe Fonts & libraries",
      "Official account activation"
    ],
    isFeatured: true,
    warranty: "4 Months Warranty",
    description: "Unlock the complete suite of creative apps. Adobe Creative Cloud includes Photoshop, Illustrator, Premiere Pro, After Effects, and Lightroom, activated on your personal email ID.",
    seoTitle: "Adobe Creative Cloud 4-Month Official Access - TechNKT",
    seoDescription: "Get official Adobe Creative Cloud access on your own email for 4 months. Photoshop, Premiere, Illustrator, and cloud space."
  },
  {
    id: "canva-edu-1yr",
    name: "Canva Edu – 1YR",
    slug: "canva-edu",
    category: "Creative Software",
    price: 169,
    duration: "1 Year",
    features: [
      "Unlock all Canva Pro elements & templates",
      "Brand kits, logos, and fonts",
      "AI background remover & magic resize",
      "Collaborative classrooms tools",
      "1 year warranty support"
    ],
    isPopular: true,
    warranty: "1 Year Warranty",
    description: "Design social graphics, presentations, and print material with Canva Education. Access all Canva Pro tools, including millions of premium graphics, templates, and video assets.",
    seoTitle: "Canva Education (Canva Pro) 1 Year - TechNKT",
    seoDescription: "Buy Canva Education 1 Year membership at just ₹169. Full access to premium templates, fonts, and background remover tools."
  },
  {
    id: "canva-business-1yr",
    name: "Canva Business – 1YR",
    slug: "canva-business",
    category: "Creative Software",
    price: 699,
    duration: "1 Year",
    features: [
      "Full team management & design sharing",
      "Advanced brand kit integrations",
      "High volume cloud assets storage",
      "Premium design automation templates",
      "Dedicated corporate support"
    ],
    isFeatured: true,
    warranty: "1 Year Full Warranty",
    description: "Run your company's design operations seamlessly. Canva Business yearly plans allow marketing teams to create unified brand identity, collaborate in real-time, and download unlimited assets.",
    seoTitle: "Canva Business 1 Year License Purchase - TechNKT",
    seoDescription: "Empower your business brand. Buy Canva Business 1 Year Plan with full template libraries, brand kits, and priority support."
  },
  {
    id: "office-365-1yr",
    name: "Office 365 – 1YR",
    slug: "office-365",
    category: "Creative Software",
    price: 699,
    duration: "1 Year",
    features: [
      "Access Word, Excel, PowerPoint, Outlook",
      "1TB secure OneDrive cloud storage",
      "Install on up to 5 devices simultaneously",
      "Supports Windows, Mac, iPad, and mobile",
      "100% genuine yearly activation"
    ],
    warranty: "1 Year Warranty",
    description: "Stay productive with Microsoft's suite of office software. Get full desktop apps, offline editing capabilities, and a huge 1TB OneDrive cloud space to store documents securely.",
    seoTitle: "Microsoft Office 365 Yearly Subscription - TechNKT",
    seoDescription: "Buy Microsoft Office 365 for 1 year. Unlock Word, Excel, PowerPoint, and 1TB OneDrive cloud storage for 5 devices."
  },
  {
    id: "youtube-premium-1yr",
    name: "YouTube Premium – 1YR",
    slug: "youtube-premium",
    category: "Creative Software",
    price: 899,
    duration: "1 Year",
    features: [
      "Ad-free video watching experience",
      "Background play (Listen while using apps)",
      "YouTube Music Premium subscription",
      "Offline video downloading support",
      "Full 12-month period warranty"
    ],
    isFeatured: true,
    warranty: "1 Year Warranty",
    description: "Enjoy YouTube without annoying ads. Background playback keeps audio running when your screen turns off. YouTube Music Premium is included.",
    seoTitle: "Buy YouTube Premium 1 Year Subscription - TechNKT",
    seoDescription: "Get YouTube Premium & Music for 1 Year. Enjoy ad-free videos, background play, and offline downloads. Fully warrantied."
  },
  {
    id: "youtube-premium-1m",
    name: "YouTube Premium – 1M",
    slug: "youtube-premium-1m",
    category: "Creative Software",
    price: 49,
    duration: "1 Month",
    features: [
      "Ad-free YouTube videos",
      "YouTube Music Premium app",
      "Background play & downloads",
      "Instant email invitation link",
      "30 days warranty support"
    ],
    warranty: "30 Days Warranty",
    description: "Try YouTube Premium for a month at an extremely budget rate. Skip ads and enjoy offline music downloading immediately on your phone.",
    seoTitle: "YouTube Premium 1 Month Access at ₹49 - TechNKT",
    seoDescription: "Ad-free YouTube and Music for 1 Month. Get instant email invitation and 30-day warranty support at TechNKT."
  },
  {
    id: "jetbrains-license",
    name: "JetBrains All Products Pack",
    slug: "jetbrains",
    category: "Creative Software",
    price: 999,
    duration: "1 Year",
    features: [
      "Access IntelliJ IDEA, PyCharm, WebStorm",
      "Includes ReSharper, Rider, and GoLand",
      "Official educational/developer license",
      "Update to latest releases",
      "100% genuine warranty"
    ],
    warranty: "1 Year Warranty",
    description: "The complete toolbox for professional developers. Access all JetBrains IDEs including IntelliJ IDEA, PyCharm, WebStorm, Rider, and GoLand for a whole year.",
    seoTitle: "JetBrains All Products Pack 1 Year Subscription - TechNKT",
    seoDescription: "Unlock all JetBrains IDEs including IntelliJ, WebStorm, PyCharm, and Rider for 1 Year. Official developer license."
  },
  {
    id: "google-one-1yr",
    name: "Google One Storage Pack",
    slug: "google-one",
    category: "Creative Software",
    price: 599,
    duration: "1 Year",
    features: [
      "Premium Google Drive & Gmail storage",
      "100GB to 2TB storage options",
      "Google Photos advanced edits",
      "Safe, private Google account link",
      "Full period activation"
    ],
    warranty: "1 Year Warranty",
    description: "Expand your digital life's storage. Google One gives you extra cloud space across Gmail, Google Drive, and Google Photos, alongside advanced photo editing tools.",
    seoTitle: "Buy Google One Cloud Storage Subscription - TechNKT",
    seoDescription: "Increase your Gmail and Drive space. Purchase Google One yearly storage subscriptions with 12 months full warranty."
  },
  {
    id: "grammarly-premium",
    name: "Grammarly Premium",
    slug: "grammarly-premium",
    category: "Creative Software",
    price: 799,
    duration: "1 Year",
    features: [
      "Advanced spelling & grammar check",
      "Tone adjustment & vocabulary ideas",
      "Built-in plagiarism detector",
      "Chrome extension and desktop app",
      "Instant activation"
    ],
    warranty: "1 Year Warranty",
    description: "Write with complete confidence. Grammarly Premium corrects tone, enhances vocabulary, and check for duplicate text to keep your essays, emails, and code docs polished.",
    seoTitle: "Grammarly Premium 1 Year Access Key - TechNKT",
    seoDescription: "Improve your writing style. Buy Grammarly Premium yearly accounts at cheap rates. Adheres to professional, clear text writing."
  },
  {
    id: "ilovepdf-premium",
    name: "iLovePDF Premium",
    slug: "ilovepdf",
    category: "Creative Software",
    price: 299,
    duration: "1 Year",
    features: [
      "Unlimited PDF conversion processes",
      "Merge, split, and compress PDFs",
      "OCR text scanning from image files",
      "No ads and unlimited file size upload",
      "1 year verified key activation"
    ],
    warranty: "1 Year Warranty",
    description: "Complete PDF file tool suite. Convert PDFs to editable Word documents, reduce file size with compression, and protect sensitive files with encryption tools.",
    seoTitle: "iLovePDF Premium Yearly Subscription - TechNKT",
    seoDescription: "Unlock unlimited PDF edits, conversions, and OCR scans. Purchase iLovePDF Premium for 1 Year with complete warranty."
  },

  // --- DEVELOPER TOOLS & SERVICES ---
  {
    id: "lovable",
    name: "Lovable Starter App Builder",
    slug: "lovable",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "Next-generation AI full stack builder",
      "Publish custom apps on lovable.app",
      "Export clean code directly",
      "Framer & database integration templates",
      "Warrantied user details"
    ],
    warranty: "30 Days Warranty",
    description: "Start prototyping web applications instantly using natural language prompts. Lovable translates your descriptions into functional components.",
    seoTitle: "Buy Lovable Starter AI Account - TechNKT",
    seoDescription: "Fast track web design. Get Lovable AI starter licenses with full-period guarantee and support."
  },
  {
    id: "lovable-pro",
    name: "Lovable Pro AI Builder",
    slug: "lovable-pro",
    category: "Developer Tools",
    price: 2499,
    duration: "1 Month",
    features: [
      "Publish custom apps instantly",
      "Export clean React and Tailwind code",
      "Github integration support",
      "Priority build limits",
      "Official account activation"
    ],
    isFeatured: true,
    warranty: "Full month support",
    description: "Build production-ready web apps using plain English statements. Lovable Pro provides high-end generative coding speeds, allowing you to deploy interactive React/Tailwind frontends in seconds.",
    seoTitle: "Buy Lovable Pro Subscription - TechNKT",
    seoDescription: "Get Lovable Pro access at discounted rates. Build, deploy, and export full-stack web applications with generative AI."
  },
  {
    id: "lovable-unlimited-ai",
    name: "Lovable Unlimited AI Builder",
    slug: "lovable-unlimited",
    category: "Developer Tools",
    price: 4999,
    duration: "1 Month",
    features: [
      "Unlimited AI generations",
      "Highest priority server queues",
      "Custom domain connections",
      "Dedicated developer workspace",
      "Instant account activation"
    ],
    warranty: "Full Month Warranty",
    description: "Remove all limits on your AI application building pipeline. Lovable Unlimited AI gives development teams limitless prompts, highest-priority queues, and fast deployment workflows.",
    seoTitle: "Lovable Unlimited AI Month Subscription - TechNKT",
    seoDescription: "Design custom websites without limitations. Buy Lovable Unlimited AI monthly accounts at TechNKT."
  },
  {
    id: "cursor-pro",
    name: "Cursor Pro AI Editor",
    slug: "cursor",
    category: "Developer Tools",
    price: 499,
    duration: "1 Month",
    features: [
      "Premium AI coding features (GPT-4o, Claude 3.5)",
      "Composer mode for multi-file edits",
      "Instant codebases search and index",
      "Smart auto-complete tab actions",
      "Safe, private developer account"
    ],
    isPopular: true,
    warranty: "Full Month Warranty",
    description: "The premier AI-powered code editor built on VS Code. Cursor Pro accelerates your development velocity by allowing multi-file code generation, context-aware queries, and automatic fixes.",
    seoTitle: "Buy Cursor Pro 1 Month Account - TechNKT",
    seoDescription: "Boost your programming speed. Get Cursor Pro monthly account with unlimited AI completions, composer mode, and repository indexing."
  },
  {
    id: "github-copilot-1yr",
    name: "GitHub Copilot – 1YR",
    slug: "github-copilot",
    category: "Developer Tools",
    price: 1499,
    duration: "1 Year",
    features: [
      "Standard autocomplete editor extension",
      "Compatible with VS Code, JetBrains, Visual Studio",
      "Explains complex algorithms & functions",
      "Learns your codebase style",
      "100% full year warranty support"
    ],
    isPopular: true,
    warranty: "1 Year Warranty",
    description: "Your AI pair programmer. GitHub Copilot integrates straight into your text editor, turning natural language descriptions into active code suggestions and completing lines instantly.",
    seoTitle: "GitHub Copilot 1 Year Premium Subscription - TechNKT",
    seoDescription: "Empower your coding tools. Buy GitHub Copilot 1-Year subscription for VS Code and JetBrains with full warranty."
  },
  {
    id: "gamma-pro",
    name: "Gamma App Pro Builder",
    slug: "gamma",
    category: "Developer Tools",
    price: 699,
    duration: "1 Month",
    features: [
      "AI generated presentation decks & slides",
      "Custom branding assets & fonts",
      "Unlimited AI credits per month",
      "Advanced engagement analytics",
      "Export to PDF and PPTX formats"
    ],
    warranty: "30 Days Warranty",
    description: "Create breathtaking, responsive presentation slides, webpages, and document guides in seconds. Input text details and watch the AI curate custom design layouts.",
    seoTitle: "Gamma App Pro Monthly Subscription - TechNKT",
    seoDescription: "Create gorgeous slides with AI. Buy Gamma Pro monthly membership with unlimited design credits and branding options."
  },
  {
    id: "framer-pro",
    name: "Framer Pro Page Builder",
    slug: "framer",
    category: "Developer Tools",
    price: 899,
    duration: "1 Month",
    features: [
      "Premium layout designs & interactions",
      "Publish custom websites immediately",
      "Connect private domains",
      "Remove Framer logo watermark",
      "Full month design support"
    ],
    warranty: "30 Days Warranty",
    description: "Design and publish gorgeous visual websites. Framer combines canvas design flexibility with responsive HTML outputs, perfect for portfolio sites and SaaS homepages.",
    seoTitle: "Framer Pro 1 Month Account Purchase - TechNKT",
    seoDescription: "Get Framer Pro at discounted prices. Create responsive websites, connect custom domains, and remove branding logos."
  },
  {
    id: "replit-core",
    name: "Replit Core Online IDE",
    slug: "replit",
    category: "Developer Tools",
    price: 799,
    duration: "1 Month",
    features: [
      "Online interactive coding workspace",
      "Deploy apps instantly to the cloud",
      "Access to Replit AI assistant",
      "High performance virtual machine speeds",
      "Collaborative coding sessions"
    ],
    warranty: "30 Days Warranty",
    description: "Code, build, and deploy straight from your browser. Replit Core gives developers high-resource workspaces, smart code autocomplete, and instant cloud-hosted endpoints.",
    seoTitle: "Buy Replit Core Monthly Subscription - TechNKT",
    seoDescription: "Access online developer sandboxes. Purchase Replit Core subscription keys with verified account support."
  },
  {
    id: "railway-credits",
    name: "Railway Cloud Credits",
    slug: "railway",
    category: "Developer Tools",
    price: 499,
    duration: "Flexible Credits",
    features: [
      "Cloud hosting credits for databases & APIs",
      "Zero-config PostgreSQL and Redis hosting",
      "Auto-deployment from Github repos",
      "Scalable container hardware options",
      "Genuine credit delivery"
    ],
    warranty: "Verified Balance",
    description: "Deploy databases, cron jobs, and web services in seconds. Railway takes your GitHub repositories and handles the deployment pipeline without complicated setups.",
    seoTitle: "Railway Hosting Credits Purchase - TechNKT",
    seoDescription: "Deploy backend apps easily. Buy Railway cloud hosting credits at cheap prices for your developer applications."
  },
  {
    id: "n8n-pro",
    name: "n8n Automation Pro",
    slug: "n8n",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "Self-hosted & cloud workflow automation",
      "Over 400 integrations & custom nodes",
      "Complex logic routing structures",
      "Execute raw Javascript/Python code",
      "Warrantied service credentials"
    ],
    warranty: "30 Days Warranty",
    description: "A powerful node-based workflow automation tool. Link APIs, parse JSON payloads, and automate business processes with n8n's visual node editor.",
    seoTitle: "n8n Cloud Automation Pro Account - TechNKT",
    seoDescription: "Automate your workflows. Buy n8n cloud subscriptions at competitive rates with continuous period warranty."
  },
  {
    id: "supabase-pro",
    name: "Supabase Pro Backend",
    slug: "supabase",
    category: "Developer Tools",
    price: 699,
    duration: "1 Month",
    features: [
      "Firebase alternative with Postgres DB",
      "Real-time subscriptions & security policies",
      "8GB database and 100GB file storage",
      "Authentication and Edge functions",
      "Instant activation keys"
    ],
    warranty: "30 Days Warranty",
    description: "Build backend servers at lightning speeds. Supabase Pro offers scalable Postgres databases, file storage containers, authentication gateways, and secure edge functions.",
    seoTitle: "Supabase Pro Month Account Activation - TechNKT",
    seoDescription: "Deploy scalable databases. Buy Supabase Pro subscription keys with full-period customer assistance."
  },
  {
    id: "webflow-pro",
    name: "Webflow Premium CMS",
    slug: "webflow",
    category: "Developer Tools",
    price: 1299,
    duration: "1 Month",
    features: [
      "Design CSS visual systems directly",
      "Advanced content management (CMS)",
      "High scalability site exports",
      "Custom analytics & tag integrations",
      "100% verified setup key"
    ],
    warranty: "30 Days Warranty",
    description: "Webflow empowers web designers to build custom responsive sites visually with full production-grade controls over raw styling code.",
    seoTitle: "Webflow CMS Pro 1 Month Account - TechNKT",
    seoDescription: "Unlock custom CSS page builders. Buy Webflow CMS pro memberships at TechNKT with monthly warranty guarantees."
  },
  {
    id: "bolt-new",
    name: "Bolt DIY App Engine",
    slug: "bolt",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "Generative software building tools",
      "Export web scripts & databases",
      "Auto-debug application terminal codes",
      "Collaborative project folders",
      "Instant key activation"
    ],
    warranty: "30 Days Warranty",
    description: "Create fully interactive full-stack mockups in minutes using modern prompt interfaces that automate installation and local builds.",
    seoTitle: "Bolt AI App Builder Account Purchase - TechNKT",
    seoDescription: "Accelerate software delivery. Purchase Bolt AI app builder monthly access keys with verified support."
  },
  {
    id: "retool-pro",
    name: "Retool Internal Tools Pro",
    slug: "retool",
    category: "Developer Tools",
    price: 1499,
    duration: "1 Month",
    features: [
      "Drag-and-drop dashboard components",
      "Connect databases, APIs, and GraphQL",
      "Write custom JS to query and transform",
      "Fine-grained access controls",
      "Secure developer onboarding"
    ],
    warranty: "30 Days Warranty",
    description: "Build secure internal administration dashboards and CRM interfaces inside Retool. Connect to any database or API in minutes.",
    seoTitle: "Retool Pro Internal Tool Builder Keys - TechNKT",
    seoDescription: "Create internal apps quickly. Buy Retool Pro subscriptions with full security setups and warranty."
  },
  {
    id: "intercom-starter",
    name: "Intercom Customer Support",
    slug: "intercom",
    category: "Developer Tools",
    price: 2999,
    duration: "1 Month",
    features: [
      "Conversational customer messenger widgets",
      "Shared support inbox & agent tickets",
      "Article database and helper guides",
      "Automated custom user routing",
      "Official account activation"
    ],
    warranty: "30 Days Warranty",
    description: "Integrate chat support into your website using Intercom. Streamline customer communication and ticket resolution pipelines.",
    seoTitle: "Intercom Starter 1 Month Plan - TechNKT",
    seoDescription: "Provide high quality support. Purchase Intercom starter licenses with fast deployment options."
  },
  {
    id: "coderabbit-pro",
    name: "CodeRabbit AI Code Reviewer",
    slug: "coderabbit",
    category: "Developer Tools",
    price: 799,
    duration: "1 Month",
    features: [
      "Automated pull request code reviews",
      "Detect bugs and suggest optimal fixes",
      "Fits Github and GitLab repositories",
      "Speeds up reviewer approval pipelines",
      "Verified keys"
    ],
    warranty: "30 Days Warranty",
    description: "Get context-aware code reviews on every pull request. CodeRabbit reviews diffs, highlights logical flaws, and submits actionable code edits.",
    seoTitle: "CodeRabbit Pro AI Code Reviewer Keys - TechNKT",
    seoDescription: "Automate code quality audits. Buy CodeRabbit Pro accounts with instant activation and 30-day warranty."
  },
  {
    id: "asana-premium",
    name: "Asana Project Management",
    slug: "asana",
    category: "Developer Tools",
    price: 599,
    duration: "1 Month",
    features: [
      "Manage sprint boards and timelines",
      "Assign custom user task targets",
      "Build workflow calendars & lists",
      "Advanced reporting filters",
      "100% verified setup link"
    ],
    warranty: "30 Days Warranty",
    description: "Plan and track software sprints, marketing calendars, and company roadmaps with Asana's premium project management features.",
    seoTitle: "Asana Premium 1 Month Subscription - TechNKT",
    seoDescription: "Organize project tasks. Buy Asana Premium membership keys with instant delivery and period warranty."
  },
  {
    id: "clickup-unlimited",
    name: "ClickUp Workspace Unlimited",
    slug: "clickup",
    category: "Developer Tools",
    price: 599,
    duration: "1 Month",
    features: [
      "Custom list, board, and document views",
      "Unlimited dashboard storage limits",
      "Detailed agile sprints planning",
      "Integrate calendars & task timers",
      "Full warranty support"
    ],
    warranty: "30 Days Warranty",
    description: "ClickUp is a unified workspace replacement that combines notes, project planning, goals, chat, and wikis into one robust platform.",
    seoTitle: "ClickUp Unlimited 1 Month Subscription - TechNKT",
    seoDescription: "Centralize your company work. Purchase ClickUp Unlimited subscriptions with verified corporate codes."
  },
  {
    id: "airtable-team",
    name: "Airtable Team Workspace",
    slug: "airtable",
    category: "Developer Tools",
    price: 699,
    duration: "1 Month",
    features: [
      "Relational database spreadsheet structures",
      "Custom views (Kanban, Grid, Gallery)",
      "Automate email integrations and scripts",
      "Collaborative project sharing",
      "Full-term support"
    ],
    warranty: "30 Days Warranty",
    description: "Build custom digital databases using standard spreadsheet elements. Airtable makes it easy to structure operational data, organize assets, and run automations.",
    seoTitle: "Airtable Team Plan Monthly License - TechNKT",
    seoDescription: "Manage databases visually. Buy Airtable Team monthly accounts with full-period replacement warranty."
  },
  {
    id: "miro-business",
    name: "Miro Business Whiteboard",
    slug: "miro",
    category: "Developer Tools",
    price: 499,
    duration: "1 Month",
    features: [
      "Collaborative whiteboard canvas spaces",
      "Custom templates for flowcharts & wireframes",
      "Real-time sticky note brainstorming",
      "Export high-resolution PDF canvases",
      "Instant activation keys"
    ],
    warranty: "30 Days Warranty",
    description: "Miro is an online visual workspace that enables distributed product teams to map out architectures, draw wireframes, and run brainstorms.",
    seoTitle: "Miro Business Whiteboard 1 Month Keys - TechNKT",
    seoDescription: "Design diagrams together. Purchase Miro Business subscription keys at cheap reseller pricing."
  },
  {
    id: "hootsuite-pro",
    name: "Hootsuite Social Manager",
    slug: "hootsuite",
    category: "Developer Tools",
    price: 1499,
    duration: "1 Month",
    features: [
      "Schedule posts to Facebook, Instagram, LinkedIn",
      "Track multi-channel brand engagements",
      "Advanced social listening keywords",
      "Unified brand inbox manager",
      "Safe, private credentials"
    ],
    warranty: "30 Days Warranty",
    description: "Manage all social media marketing from one screen. Hootsuite helps you schedule content, respond to comments, and track metrics.",
    seoTitle: "Hootsuite Pro 1 Month Premium Access - TechNKT",
    seoDescription: "Automate social media marketing. Buy Hootsuite Pro subscriptions with verified credentials on TechNKT."
  },
  {
    id: "notion-business",
    name: "Notion Business Workspace",
    slug: "notion-business",
    category: "Productivity",
    price: 699,
    duration: "1 Month",
    features: [
      "Collaborative team wiki databases",
      "Unlimited file upload capacity",
      "Advanced page permissions setup",
      "Agile database views & Gantt charts",
      "100% verified activation"
    ],
    isPopular: true,
    warranty: "30 Days Warranty",
    description: "Connect your team's documents, projects, and custom wiki tables in a unified, beautifully styled workspace.",
    seoTitle: "Notion Business Plan Monthly Subscription - TechNKT",
    seoDescription: "Coordinate your team's docs. Purchase Notion Business monthly plan keys at discount rates with warranty."
  },
  {
    id: "notion-ai",
    name: "Notion AI Assistant",
    slug: "notion-ai",
    category: "Productivity",
    price: 499,
    duration: "1 Month",
    features: [
      "Autocompletes articles & summaries",
      "Extracts bullet points from raw notes",
      "Changes tone & formats language styles",
      "Access AI inside any Notion page",
      "Instant activation"
    ],
    warranty: "30 Days Warranty",
    description: "Activate premium AI inside your Notion pages. Ask questions, brainstorm layout ideas, translate pages, and summarize meetings instantly.",
    seoTitle: "Notion AI Assistant Subscription Upgrade - TechNKT",
    seoDescription: "Enhance your document workflows. Upgrade Notion with Notion AI monthly add-ons. Verified accounts."
  },
  {
    id: "elevenlabs-creator",
    name: "ElevenLabs Creator Voice AI",
    slug: "elevenlabs",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "State-of-the-art AI voice synthesis",
      "Access professional voice cloning",
      "100,000 characters per month limit",
      "Commercial license rights included",
      "Secure credential handoff"
    ],
    isPopular: true,
    warranty: "30 Days Warranty",
    description: "Generate highly realistic audio speech from text. ElevenLabs offers realistic voice cloning, multiple languages, and expressive tones for audiobooks and videos.",
    seoTitle: "ElevenLabs Creator Plan Monthly License - TechNKT",
    seoDescription: "Generate premium speech. Purchase ElevenLabs Creator plan credits at competitive prices on TechNKT."
  },
  {
    id: "sentry-team",
    name: "Sentry Error Monitoring",
    slug: "sentry",
    category: "Developer Tools",
    price: 899,
    duration: "1 Month",
    features: [
      "Real-time codebase error tracking",
      "Traces issues to exact source lines",
      "Performance metrics & slow queries logs",
      "Integrates with Slack, Github, Jira",
      "Verified setup credentials"
    ],
    warranty: "30 Days Warranty",
    description: "Diagnose frontend and backend errors in real-time. Sentry captures exceptions, traces stack files, and logs server latencies to keep apps running.",
    seoTitle: "Sentry Team Plan 1 Month Subscription - TechNKT",
    seoDescription: "Debug production apps. Buy Sentry Team monthly plan keys with full period warranty."
  },
  {
    id: "scalingo-starter",
    name: "Scalingo Cloud Hosting",
    slug: "scalingo",
    category: "Developer Tools",
    price: 799,
    duration: "1 Month",
    features: [
      "European cloud hosting services",
      "Git push to deploy application flows",
      "Database clusters auto-management",
      "100% GDPR compliant host environment",
      "Safe activation code"
    ],
    warranty: "30 Days Warranty",
    description: "Deploy and host web projects in a secure, European cloud environment. Perfect for applications requiring strict compliance guidelines.",
    seoTitle: "Scalingo Cloud Starter Plan Subscription - TechNKT",
    seoDescription: "Secure European web hosting. Purchase Scalingo cloud developer credentials with instant delivery."
  },
  {
    id: "stripe-atlas",
    name: "Stripe Atlas LLC Setup",
    slug: "stripe-atlas",
    category: "Developer Tools",
    price: 4999,
    duration: "One-Time Voucher",
    features: [
      "Register a US LLC or C-Corp company",
      "Includes registered agent setups",
      "Get US Tax ID (EIN) documentation",
      "Activates Stripe business processing",
      "Verified discount voucher"
    ],
    isFeatured: true,
    warranty: "Activation Guarantee",
    description: "Incorporate your tech company in the US from anywhere in the world. Stripe Atlas handles the legal paperwork, EIN registration, and banking setups.",
    seoTitle: "Stripe Atlas Corporate Registration Voucher - TechNKT",
    seoDescription: "Incorporate your business in the US. Buy Stripe Atlas vouchers with full validity and legal guide support."
  },
  {
    id: "aliasbrowser-pro",
    name: "AliasBrowser Anti-Detect",
    slug: "aliasbrowser",
    category: "VPN",
    price: 999,
    duration: "1 Month",
    features: [
      "Anti-detect profile management",
      "Separate cookies, cache, and IP fingerprints",
      "Perfect for managing multiple ad accounts",
      "Supports HTTP/SOCKS5 proxy settings",
      "Instant activation keys"
    ],
    warranty: "30 Days Warranty",
    description: "AliasBrowser prevents website tracking by creating isolated browser profiles. Run multiple profiles with independent fingerprints and proxies safely.",
    seoTitle: "AliasBrowser Pro 1 Month Account - TechNKT",
    seoDescription: "Manage multiple web accounts safely. Buy AliasBrowser Pro anti-detect licenses with complete monthly warranty."
  },
  {
    id: "cal-com-pro",
    name: "Cal.com Scheduling Pro",
    slug: "cal-com",
    category: "Productivity",
    price: 399,
    duration: "1 Month",
    features: [
      "Custom scheduling page workflows",
      "Connect multiple calendar endpoints",
      "Set up paid event gateways",
      "Integrate Zoom, Google Meet, Stripe",
      "Verified keys"
    ],
    warranty: "30 Days Warranty",
    description: "The open-source Calendly alternative. Cal.com Pro gives you custom scheduling structures, routing forms, and white-label setups.",
    seoTitle: "Cal.com Pro Scheduling 1 Month License - TechNKT",
    seoDescription: "Book client meetings. Purchase Cal.com Pro subscription keys with full-period customer assistance."
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro Video Editor",
    slug: "capcut-pro",
    category: "Creative Software",
    price: 599,
    duration: "1 Month",
    features: [
      "Unlock advanced AI video filters",
      "Access premium transitions & templates",
      "Extract audio subtitles automatically",
      "High resolution 4K exports without watermarks",
      "Official account upgrade"
    ],
    isPopular: true,
    warranty: "30 Days Warranty",
    description: "Edit professional short-form videos and TikTok reels. CapCut Pro unlocks AI video transitions, automatic transcriptions, and premium stock libraries.",
    seoTitle: "CapCut Pro Premium Video Editor 1 Month - TechNKT",
    seoDescription: "Create viral video reels. Buy CapCut Pro monthly subscriptions with clean activations and full support."
  },
  {
    id: "figma-edu",
    name: "Figma Professional Edu",
    slug: "figma-edu",
    category: "Developer Tools",
    price: 199,
    duration: "1 Year",
    features: [
      "Figma Professional design workspace",
      "Create unlimited design files & shares",
      "Unlock advanced developer mode views",
      "Access professional shared UI libraries",
      "Full yearly guarantee support"
    ],
    isPopular: true,
    warranty: "1 Year Warranty",
    description: "Unlock Figma Professional. Build responsive vector UI layouts, share assets with teams, export CSS structures, and inspect drafts via Developer Mode.",
    seoTitle: "Figma Professional (Edu License) 1 Year - TechNKT",
    seoDescription: "Unlock Figma Dev Mode and UI components libraries. Buy Figma Professional educational licenses with 12 months warranty."
  },
  {
    id: "filmora-15",
    name: "Filmora 15 Video Editor",
    slug: "filmora",
    category: "Creative Software",
    price: 499,
    duration: "1 Year",
    features: [
      "Wondershare Filmora 15 license",
      "Unlock all advanced transitions & templates",
      "AI portrait editing & background removal",
      "Access royalty-free sound effects library",
      "100% genuine keys"
    ],
    warranty: "1 Year Warranty",
    description: "Filmora 15 is a versatile, easy-to-use desktop video editor. Create professional videos with customizable filters, AI motion trackers, and titles.",
    seoTitle: "Wondershare Filmora 15 Yearly Account - TechNKT",
    seoDescription: "Edit stunning social videos. Buy genuine Wondershare Filmora 15 licenses at discounted yearly rates."
  },
  {
    id: "rdp-premium",
    name: "RDP Premium Remote Desktop",
    slug: "rdp",
    category: "Developer Tools",
    price: 799,
    duration: "1 Month",
    features: [
      "High-speed Windows/Linux remote desktop",
      "Located in US/Europe datacenters",
      "24/7 online availability uptime",
      "Full administrator access permissions",
      "Instant credentials delivery"
    ],
    warranty: "30 Days Warranty",
    description: "Access a virtual desktop computer located in secure global data centers. Run automation scripts, test code setups, and browse with high-speed uplinks.",
    seoTitle: "Premium RDP (Remote Desktop Protocol) Accounts - TechNKT",
    seoDescription: "Access 24/7 online remote desktops. Buy high-speed RDP servers with admin rights and 30-day warranty."
  },
  {
    id: "vps-developer",
    name: "VPS Developer Server Hosting",
    slug: "vps",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "Dedicated virtual private server hosting",
      "Root SSD storage and hardware specs",
      "Configure custom OS & network scripts",
      "Perfect for hosting API backends",
      "Warrantied virtual servers"
    ],
    warranty: "30 Days Warranty",
    description: "A Virtual Private Server (VPS) optimized for developers. Install system packages, run Docker containers, host websites, and scale resources.",
    seoTitle: "Developer VPS (Virtual Private Server) Hosting - TechNKT",
    seoDescription: "Host web APIs and apps. Purchase high performance SSD cloud VPS hosting with root access on TechNKT."
  },
  {
    id: "algolia-starter",
    name: "Algolia Search Engine API",
    slug: "algolia",
    category: "Developer Tools",
    price: 1499,
    duration: "1 Month",
    features: [
      "Ultra-fast search-as-you-type API indexing",
      "Custom typo-tolerance and analytics logs",
      "Integrates with React, Vue, and iOS",
      "Warrantied query quotas",
      "Instant activation keys"
    ],
    warranty: "30 Days Warranty",
    description: "Implement premium, autocomplete-grade site search. Algolia's API delivers sub-millisecond search query results with typo tolerance.",
    seoTitle: "Algolia Search API Starter Subscription - TechNKT",
    seoDescription: "Add search capabilities to your apps. Buy Algolia API starter credits with verified setups on TechNKT."
  },
  {
    id: "factory-pro",
    name: "Factory Pro API Data",
    slug: "factory",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "Developer API for structured web scraping",
      "Collects clean datasets & formats automatically",
      "Robust proxy rotation to avoid blocks",
      "Scales data ingestion pipelines",
      "Verified balance key"
    ],
    warranty: "30 Days Warranty",
    description: "Automate raw data scraping and ingestion. Factory Pro API handles rotating proxies, CAPTCHA bypasses, and structures content cleanly.",
    seoTitle: "Factory Pro API Scraper Subscription - TechNKT",
    seoDescription: "Scrape web content without getting blocked. Buy Factory Pro API keys with guaranteed monthly access."
  },
  {
    id: "chatprd-pro",
    name: "ChatPRD Pro Product Manager",
    slug: "chatprd",
    category: "Productivity",
    price: 599,
    duration: "1 Month",
    features: [
      "AI assistant trained for Product Managers",
      "Generates detailed PRDs and user stories",
      "Builds product roadmaps and strategies",
      "Improves product release alignments",
      "Instant email activation"
    ],
    warranty: "30 Days Warranty",
    description: "ChatPRD acts as an on-demand Product Manager. Input feature ideas and instantly generate comprehensive Product Requirement Documents (PRDs).",
    seoTitle: "ChatPRD Pro AI Product Manager Subscription - TechNKT",
    seoDescription: "Generate professional PRDs in seconds. Purchase ChatPRD Pro monthly keys at cheap rates on TechNKT."
  },
  {
    id: "warp-pro",
    name: "Warp Terminal Pro",
    slug: "warp",
    category: "Developer Tools",
    price: 399,
    duration: "1 Month",
    features: [
      "Modern terminal with AI completions built-in",
      "Save and share custom CLI command blocks",
      "Collaborative team terminal settings",
      "Custom styles and terminal window themes",
      "Verified key activation"
    ],
    warranty: "30 Days Warranty",
    description: "Warp is a Rust-based terminal that integrates AI. Complete CLI commands with natural language inputs and save command snippets for teams.",
    seoTitle: "Warp Terminal Pro Monthly License Key - TechNKT",
    seoDescription: "Upgrade your terminal coding. Buy Warp Terminal Pro subscription keys with full month warranty."
  },
  {
    id: "mobbin-pro",
    name: "Mobbin UI/UX Design Library",
    slug: "mobbin",
    category: "Developer Tools",
    price: 799,
    duration: "1 Month",
    features: [
      "Browse UI screenshots of top iOS/Android apps",
      "Filter by screen type, pattern, and element",
      "Save inspiration boards and reference guides",
      "Weekly updates of premium web designs",
      "Instant activation link"
    ],
    isPopular: true,
    warranty: "30 Days Warranty",
    description: "Mobbin is the world's largest mobile design library. Access high-resolution screenshots from thousands of popular iOS and Android applications.",
    seoTitle: "Mobbin UI/UX Design Library Pro Access - TechNKT",
    seoDescription: "Find UI design inspiration. Buy Mobbin Pro monthly memberships with guaranteed access codes."
  },
  {
    id: "granola-pro",
    name: "Granola AI Meeting Notes",
    slug: "granola",
    category: "Productivity",
    price: 499,
    duration: "1 Month",
    features: [
      "AI transcriber for Zoom, Meet, and Slack",
      "Highlights key discussion action points",
      "Summarizes audio files into neat reports",
      "Integrates with company wiki workspaces",
      "Genuine activation key"
    ],
    warranty: "30 Days Warranty",
    description: "Granola transcribes voice meetings and builds structured summaries, allowing product developers to stay fully focused on the active discussion.",
    seoTitle: "Granola AI Meeting Notes Assistant - TechNKT",
    seoDescription: "Never miss meeting points. Buy Granola AI meeting transcriber monthly subscriptions at TechNKT."
  },
  {
    id: "linear-pro",
    name: "Linear Pro Issue Tracker",
    slug: "linear",
    category: "Developer Tools",
    price: 699,
    duration: "1 Month",
    features: [
      "Lightning-fast project tracking software",
      "Custom sprint workflows and team boards",
      "Advanced keyboard shortcut navigations",
      "Integrates with GitHub and Slack pipelines",
      "Verified key codes"
    ],
    isPopular: true,
    warranty: "30 Days Warranty",
    description: "Linear helps software teams streamline project issues, plan product roadmaps, build sprint cycles, and track bug lists.",
    seoTitle: "Linear Pro Project Manager Monthly License - TechNKT",
    seoDescription: "Coordinate developer sprints. Buy Linear Pro monthly subscription licenses at cheap corporate rates."
  },
  {
    id: "magic-patterns-pro",
    name: "Magic Patterns AI UI Designer",
    slug: "magic-patterns",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "Generates beautiful UI mocks using AI",
      "Exports raw React, Vue, or Tailwind codes",
      "Design design-system compliant interfaces",
      "Saves designer draft history paths",
      "Instant setup keys"
    ],
    warranty: "30 Days Warranty",
    description: "Generates functional component structures from text prompts. Perfect for web developers prototyping custom layout systems.",
    seoTitle: "Magic Patterns Pro AI UI Designer Keys - TechNKT",
    seoDescription: "Accelerate frontend wireframing. Purchase Magic Patterns Pro monthly plans with active support."
  },
  {
    id: "posthog-pro",
    name: "PostHog Analytics Pro",
    slug: "posthog",
    category: "Developer Tools",
    price: 899,
    duration: "1 Month",
    features: [
      "Web product analytics & session replays",
      "Deploy custom feature flags to users",
      "A/B multivariate landing page testing",
      "Collect and track database events",
      "Verified key credentials"
    ],
    warranty: "30 Days Warranty",
    description: "PostHog combines session recording, user analytics, page testing, and feature flags into one developer-first platform.",
    seoTitle: "PostHog Pro Product Analytics Accounts - TechNKT",
    seoDescription: "Track web app usage events. Purchase PostHog Pro monthly subscriptions with verified developer setups."
  },
  {
    id: "snap-leads-pro",
    name: "Snap Leads Pro Scraper",
    slug: "snap-leads-pro",
    category: "Productivity",
    price: 1499,
    duration: "1 Month",
    features: [
      "Scrapes business contacts from Google Maps",
      "Collects emails, phone numbers, and socials",
      "Export datasets straight to CSV files",
      "Supports multi-threaded fast queries",
      "Genuine activation key"
    ],
    warranty: "30 Days Warranty",
    description: "Extract marketing data and build business contact databases. Find prospects in any geographical region quickly.",
    seoTitle: "Snap Leads Pro Google Maps Scraper Keys - TechNKT",
    seoDescription: "Generate local sales leads. Buy Snap Leads Pro monthly scraper keys at discount rates."
  },
  {
    id: "synthesia-starter",
    name: "Synthesia AI Avatar Video",
    slug: "synthesia",
    category: "Creative Software",
    price: 2499,
    duration: "1 Month",
    features: [
      "AI avatars that present text scripts",
      "Over 120 languages & natural accents",
      "Built-in video templates & editors",
      "Commercial rights usage enabled",
      "Secure activation credentials"
    ],
    isFeatured: true,
    warranty: "30 Days Warranty",
    description: "Create premium video presentations with realistic AI avatars speaking your written scripts. Skip studios, cameras, and actors.",
    seoTitle: "Synthesia AI Video Generator 1 Month - TechNKT",
    seoDescription: "Create video presentations with AI. Buy Synthesia starter plan keys at competitive prices."
  },
  {
    id: "gumloop-pro",
    name: "Gumloop AI Web Workflow",
    slug: "gumloop",
    category: "Developer Tools",
    price: 999,
    duration: "1 Month",
    features: [
      "Build LLM automation pipelines visually",
      "Extracts data and runs automated checks",
      "Connects to ChatGPT, Anthropic, and tools",
      "Custom API integration nodes",
      "Verified key codes"
    ],
    warranty: "30 Days Warranty",
    description: "Create complex workflow automations powered by generative AI. Connect web tools, parse document contents, and generate reports.",
    seoTitle: "Gumloop AI Web Automation Pro Monthly - TechNKT",
    seoDescription: "Deploy LLM data pipelines. Purchase Gumloop Pro subscriptions with verified credentials."
  },
  {
    id: "whimsical-pro",
    name: "Whimsical Flowcharts Pro",
    slug: "whimsical",
    category: "Productivity",
    price: 499,
    duration: "1 Month",
    features: [
      "Fast flowchart mapping tools",
      "Collaborative wireframing and notes",
      "Clean, modern UI element symbols",
      "Export images & share page links",
      "Genuine activation keys"
    ],
    warranty: "30 Days Warranty",
    description: "Whimsical combines flowcharts, wireframes, sticky notes, and mind maps into a clean visual workspace for product design.",
    seoTitle: "Whimsical Flowcharts Pro 1 Month License - TechNKT",
    seoDescription: "Map product user flows. Buy Whimsical Pro monthly plans with guaranteed activation codes."
  },
  {
    id: "textshift-pro",
    name: "TextShift Translation API",
    slug: "textshift",
    category: "Developer Tools",
    price: 399,
    duration: "1 Month",
    features: [
      "Ultra fast website localization API",
      "Translates JSON file contents automatically",
      "Typo and context error corrections",
      "Integrates with Github release actions",
      "Verified balance key"
    ],
    warranty: "30 Days Warranty",
    description: "Localize software applications across multiple language streams using TextShift's context-aware translation APIs.",
    seoTitle: "TextShift Localization API Pro Keys - TechNKT",
    seoDescription: "Translate software JSON assets. Buy TextShift Pro subscriptions with full month warranty."
  },
  {
    id: "cimanote-pro",
    name: "CimaNote Document Wiki",
    slug: "cimanote",
    category: "Productivity",
    price: 299,
    duration: "1 Month",
    features: [
      "Rich text notes with link mappings",
      "Fast markdown syntax keyboards",
      "Offline database backups storage",
      "Shared folder views for teams",
      "Verified activation codes"
    ],
    warranty: "30 Days Warranty",
    description: "CimaNote organizes notes, study guides, and software specifications using bidirectional link structures.",
    seoTitle: "CimaNote Pro Document Organizer 1 Month - TechNKT",
    seoDescription: "Organize digital notes. Buy CimaNote Pro subscriptions with instant setup and support."
  },
  {
    id: "coda-teams",
    name: "Coda Teams Workspace",
    slug: "coda-teams",
    category: "Productivity",
    price: 699,
    duration: "1 Month",
    features: [
      "Combines word docs with tables",
      "Integrates integrations like Slack & Jira",
      "Automates notification loops & updates",
      "Custom app-like screen interfaces",
      "100% verified setup key"
    ],
    warranty: "30 Days Warranty",
    description: "Coda blends text editing, spreadsheet data, and application buttons, allowing product teams to build custom internal applications.",
    seoTitle: "Coda Teams Plan Monthly License - TechNKT",
    seoDescription: "Run business processes on docs. Buy Coda Teams subscription keys with verified warranty support."
  },
  {
    id: "jio-rc-3199",
    name: "Jio Recharge – ₹3199 Plan",
    slug: "jio-rc-3199",
    category: "Productivity",
    price: 2899,
    duration: "365 Days",
    features: [
      "Unlimited Voice calls across India",
      "2GB high-speed daily 4G/5G data",
      "Complimentary JioApps memberships",
      "100 free SMS text daily messages",
      "Direct code/instant number transfer"
    ],
    isFeatured: true,
    warranty: "Activation Guarantee",
    description: "Get India's top mobile network plan at a discount. The Jio ₹3199 annual recharge plan delivers high-speed data, unlimited calling, and premium JioApp access.",
    seoTitle: "Buy Jio Recharge ₹3199 Annual Plan at Discount - TechNKT",
    seoDescription: "Save on telecom. Purchase the Jio ₹3199 annual recharge plan at discounted rates with guaranteed activation."
  },
  {
    id: "jio-rc-999",
    name: "Jio Recharge – ₹999 Plan",
    slug: "jio-rc-999",
    category: "Productivity",
    price: 899,
    duration: "84 Days",
    features: [
      "Unlimited national voice calls",
      "2GB daily high-speed 4G data",
      "Free unlimited 5G data access",
      "JioTV and JioCinema access links",
      "Direct transfer activation"
    ],
    isPopular: true,
    warranty: "Activation Guarantee",
    description: "Save on your Jio mobile recharge. Get 84 days of unlimited voice calls, high-speed daily data limits, and unlimited 5G connectivity.",
    seoTitle: "Jio Recharge ₹999 (84 Days Plan) Discount - TechNKT",
    seoDescription: "Get Jio ₹999 mobile recharge with unlimited calling and 5G data at a discount from TechNKT."
  }
];
