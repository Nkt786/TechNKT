import React, { useState, useEffect } from "react";
import {
  LuTrash2,
  LuShoppingBag,
  LuShieldCheck,
  LuZap,
  LuArrowRight,
  LuPhone,
  LuMail,
  LuSend,
  LuCircleCheck,
  LuTriangleAlert,
  LuRefreshCw,
  LuUser,
  LuSparkles,
  LuKey,
  LuCopy,
  LuCheck,
} from "react-icons/lu";

interface CartItem {
  id: string;
  cartKey?: string;
  variant_id?: string;
  name: string;
  variant_name?: string;
  price: string;
  priceAmount?: number;
  period?: string;
  quantity: number;
  image?: string;
}

interface CurrentUser {
  id: string;
  username: string;
  displayName: string | null;
}

interface UserProfile {
  user_id: string;
  optional_whatsapp: string | null;
  optional_email: string | null;
  optional_telegram: string | null;
  preferred_contact_method: string;
}

export default function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Checkout Form State
  const [deliveryPreference, setDeliveryPreference] = useState<"dashboard" | "whatsapp" | "email" | "telegram">("dashboard");
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [telegramContact, setTelegramContact] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // In-line Auth Modal State for Unauthenticated Checkout
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPass, setAuthConfirmPass] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [newRecoveryCodes, setNewRecoveryCodes] = useState<string[] | null>(null);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Order Confirmation State
  const [orderConfirmation, setOrderConfirmation] = useState<any | null>(null);

  const loadCart = () => {
    try {
      const raw = localStorage.getItem("technkt_cart") || localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
        setUserProfile(data.profile);
        if (data.user.displayName) setCustomerName(data.user.displayName);
        if (data.profile) {
          if (data.profile.optional_whatsapp) setWhatsappNumber(data.profile.optional_whatsapp);
          if (data.profile.optional_email) setEmail(data.profile.optional_email);
          if (data.profile.optional_telegram) setTelegramContact(data.profile.optional_telegram);
          if (data.profile.preferred_contact_method) {
            setDeliveryPreference(data.profile.preferred_contact_method as any);
          }
        }
      }
    } catch {
      // User is not logged in
    }
  };

  useEffect(() => {
    loadCart();
    checkUserAuth();
    window.addEventListener("storage", loadCart);
    window.addEventListener("cart-updated", loadCart);
    return () => {
      window.removeEventListener("storage", loadCart);
      window.removeEventListener("cart-updated", loadCart);
    };
  }, []);

  const updateQuantity = (cartKeyOrId: string, delta: number) => {
    const updated = items
      .map((item) => {
        const key = item.cartKey || item.id;
        if (key === cartKeyOrId) {
          const newQty = (item.quantity || 1) + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    setItems(updated);
    localStorage.setItem("technkt_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (cartKeyOrId: string) => {
    const updated = items.filter((item) => (item.cartKey || item.id) !== cartKeyOrId);
    setItems(updated);
    localStorage.setItem("technkt_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const parsePrice = (item: CartItem) => {
    if (typeof item.priceAmount === "number" && item.priceAmount > 0) {
      return item.priceAmount;
    }
    const num = Number(item.price.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + parsePrice(item) * (item.quantity || 1),
    0
  );

  // Validate contact before submitting
  const validateContact = (): boolean => {
    setErrorMessage(null);

    if (deliveryPreference === "whatsapp") {
      const digits = whatsappNumber.replace(/\D/g, "");
      if (digits.length < 10) {
        setErrorMessage("Please enter a valid 10-digit WhatsApp number with country code.");
        return false;
      }
    } else if (deliveryPreference === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErrorMessage("Please enter a valid email address for digital delivery.");
        return false;
      }
    } else if (deliveryPreference === "telegram") {
      if (!telegramContact.trim() || telegramContact.trim().length < 3) {
        setErrorMessage("Please enter your Telegram @username or phone number.");
        return false;
      }
    }
    // "dashboard" requires no phone or email at all!
    return true;
  };

  // Place Order Request
  const handlePlaceOrder = async (isWhatsAppDirect = false) => {
    // 1. Check if user is logged in
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!validateContact()) return;

    try {
      setSubmitting(true);
      setErrorMessage(null);

      const payload = {
        customer_name: customerName.trim() || currentUser.displayName || currentUser.username,
        whatsapp_number: whatsappNumber.trim() || null,
        email: email.trim() || null,
        telegram_contact: telegramContact.trim() || null,
        delivery_preference: deliveryPreference,
        order_notes: orderNotes.trim() || undefined,
        order_source: isWhatsAppDirect ? "whatsapp_direct" : "web_store",
        items: items.map((i) => ({
          product_id: i.id,
          variant_id: i.variant_id,
          quantity: i.quantity || 1,
        })),
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.requiresAuth) {
          setShowAuthModal(true);
          setErrorMessage(data.error);
        } else {
          setErrorMessage(data.error || "Failed to submit order request. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      // Order created successfully
      localStorage.removeItem("technkt_cart");
      window.dispatchEvent(new Event("cart-updated"));

      if (isWhatsAppDirect && data.encodedWhatsAppUrl) {
        window.open(data.encodedWhatsAppUrl, "_blank", "noopener,noreferrer");
      }

      setOrderConfirmation(data);
    } catch {
      setErrorMessage("Network error processing order. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  // Quick In-Checkout Auth Handler
  const handleInCheckoutAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    try {
      if (authMode === "register") {
        if (authPassword !== authConfirmPass) {
          setAuthError("Passwords do not match.");
          setAuthSubmitting(false);
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: authUsername.trim(),
            password: authPassword,
            confirmPassword: authConfirmPass,
            preferredContact: deliveryPreference,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setAuthError(data.error || "Failed to create account.");
          return;
        }

        setCurrentUser(data.user);
        setUserProfile(data.profile);
        if (Array.isArray(data.recoveryCodes)) {
          setNewRecoveryCodes(data.recoveryCodes);
        } else {
          setShowAuthModal(false);
          // Auto place order once authenticated!
          setTimeout(() => handlePlaceOrder(false), 200);
        }
      } else {
        // Login
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: authUsername.trim(),
            password: authPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setAuthError(data.error || "Invalid credentials.");
          return;
        }

        setCurrentUser(data.user);
        setUserProfile(data.profile);
        setShowAuthModal(false);
        setTimeout(() => handlePlaceOrder(false), 200);
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-[#DAD4DE]">
        <div className="animate-spin size-8 border-2 border-[#2965E8] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs text-[#A6B1C2]">Loading your cart...</p>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // ORDER CONFIRMATION VIEW
  // ──────────────────────────────────────────────────────────
  if (orderConfirmation) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 sm:px-6">
        <div className="rounded-3xl p-6 sm:p-8 bg-[#151D2B] border border-[#1E2837] shadow-2xl text-center">
          <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 text-3xl">
            <LuCircleCheck />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">
            Order Request Received!
          </h2>
          <p className="text-xs text-[#A6B1C2] mb-6">
            Track your order and communicate with our team in your TechNKT Dashboard.
          </p>

          {/* Reference Card */}
          <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] mb-6 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A6B1C2]">Order Reference:</span>
              <span className="font-mono font-bold text-[#2965E8] text-sm sm:text-base">
                {orderConfirmation.orderReference}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A6B1C2]">Current Order Status:</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase">
                {orderConfirmation.orderStatus.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A6B1C2]">Order Amount:</span>
              <span className="font-bold text-white text-sm">
                ₹{orderConfirmation.totalAmount}/-
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A6B1C2]">Payment:</span>
              <span className="font-semibold text-amber-400">Payment not yet confirmed</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A6B1C2]">Communication Channel:</span>
              <span className="text-white font-semibold uppercase">
                {orderConfirmation.deliveryPreference}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div className="border-t border-[#1E2837] pt-4 mb-6 text-left">
            <h4 className="text-xs font-semibold text-white mb-2">Requested Products:</h4>
            <div className="space-y-1.5 text-xs text-[#A6B1C2]">
              {orderConfirmation.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product_name_snapshot} ({item.variant_name_snapshot}) × {item.quantity}</span>
                  <span className="font-medium text-white">₹{item.line_total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <a
              href="/account"
              className="w-full h-11 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>View in My Orders & Support Chat &rarr;</span>
            </a>

            {orderConfirmation.encodedWhatsAppUrl && (
              <a
                href={orderConfirmation.encodedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LuPhone className="size-4" />
                <span>Optional: Connect on WhatsApp (+91 9822587641)</span>
              </a>
            )}

            <a
              href="/store"
              className="inline-block text-xs text-[#A6B1C2] hover:text-white transition-colors pt-2"
            >
              ← Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // EMPTY CART VIEW
  // ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center">
        <div className="size-20 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-6 text-[#2965E8] text-3xl shadow-[0_0_30px_rgba(41,101,232,0.2)]">
          <LuShoppingBag />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-[#A6B1C2] mb-8 max-w-md mx-auto">
          You haven't added any digital subscriptions or tools to your cart yet.
        </p>
        <a
          href="/store"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
        >
          <span>Explore Digital Store</span>
          <LuArrowRight className="text-base" />
        </a>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // CART & CHECKOUT FORM
  // ──────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8 max-w-7xl mx-auto">
      {/* LEFT: Items List & Order Details (lg:col-span-2) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Section 1: Your Order */}
        <div className="rounded-2xl p-6 bg-[#151D2B] border border-[#1E2837] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2837]">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>1. Your Order Items</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#2965E8]/20 text-[#2965E8] font-semibold">
                {items.length} items
              </span>
            </h2>
            <a href="/store" className="text-xs text-[#2965E8] hover:text-[#3D75F0] font-medium">
              + Add more items
            </a>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const itemKey = item.cartKey || item.id;
              return (
                <div
                  key={itemKey}
                  className="rounded-xl p-4 bg-[#0B101A] border border-[#1E2837] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold uppercase tracking-wider">
                        Instant Delivery
                      </span>
                      {item.variant_name && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white font-medium">
                          {item.variant_name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{item.name}</h3>
                    <p className="text-xs font-semibold text-[#A6B1C2] mt-0.5">
                      {item.price} {item.period || ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center rounded-lg bg-[#151D2B] border border-[#1E2837] px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemKey, -1)}
                        className="size-6 rounded text-white/80 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-white">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemKey, 1)}
                        className="size-6 rounded text-white/80 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm sm:text-base font-bold text-white min-w-16 text-right font-mono">
                      ₹{(parsePrice(item) * (item.quantity || 1)).toLocaleString()}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(itemKey)}
                      className="size-8 rounded-lg text-[#A6B1C2] hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <LuTrash2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Contact Preference */}
        <div className="rounded-2xl p-6 bg-[#151D2B] border border-[#1E2837] space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white pb-2 border-b border-[#1E2837]">
            2. Contact & Delivery Preference
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryPreference("dashboard")}
              className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                deliveryPreference === "dashboard"
                  ? "bg-[#2965E8]/20 border-[#2965E8] text-[#2965E8]"
                  : "bg-[#0B101A] border-[#1E2837] text-[#A6B1C2] hover:text-white"
              }`}
            >
              <LuShieldCheck className="size-4" />
              <span>TechNKT Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryPreference("whatsapp")}
              className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                deliveryPreference === "whatsapp"
                  ? "bg-[#25D366]/20 border-[#25D366] text-[#25D366]"
                  : "bg-[#0B101A] border-[#1E2837] text-[#A6B1C2] hover:text-white"
              }`}
            >
              <LuPhone className="size-4" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryPreference("email")}
              className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                deliveryPreference === "email"
                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                  : "bg-[#0B101A] border-[#1E2837] text-[#A6B1C2] hover:text-white"
              }`}
            >
              <LuMail className="size-4" />
              <span>Email</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryPreference("telegram")}
              className={`py-3 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                deliveryPreference === "telegram"
                  ? "bg-sky-500/20 border-sky-500 text-sky-400"
                  : "bg-[#0B101A] border-[#1E2837] text-[#A6B1C2] hover:text-white"
              }`}
            >
              <LuSend className="size-4" />
              <span>Telegram</span>
            </button>
          </div>

          {/* Conditional input fields */}
          {deliveryPreference === "dashboard" && (
            <div className="p-3.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-[#A6B1C2]">
              <span className="font-semibold text-white block mb-0.5">⚡ No external phone/email required.</span>
              You can track your order status and communicate directly with our fulfillment team here inside your TechNKT Dashboard.
            </div>
          )}

          {deliveryPreference === "whatsapp" && (
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                WhatsApp Number (with Country Code) *
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/40 focus:outline-none focus:border-[#2965E8]"
              />
            </div>
          )}

          {deliveryPreference === "email" && (
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/40 focus:outline-none focus:border-[#2965E8]"
              />
            </div>
          )}

          {deliveryPreference === "telegram" && (
            <div>
              <label className="block text-xs font-semibold text-white mb-1">
                Telegram Handle *
              </label>
              <input
                type="text"
                value={telegramContact}
                onChange={(e) => setTelegramContact(e.target.value)}
                placeholder="@myusername"
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/40 focus:outline-none focus:border-[#2965E8]"
              />
            </div>
          )}
        </div>

        {/* Section 3: Order Notes */}
        <div className="rounded-2xl p-6 bg-[#151D2B] border border-[#1E2837] space-y-2">
          <h2 className="text-base font-bold text-white">3. Order Notes (Optional)</h2>
          <textarea
            rows={3}
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Anything our team should know? (e.g. existing account renewal or special activation instructions)"
            className="w-full p-3.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/40 focus:outline-none focus:border-[#2965E8]"
          />
        </div>
      </div>

      {/* RIGHT: Sticky Order Summary & Submit (lg:col-span-1) */}
      <div className="lg:col-span-1">
        <div className="rounded-2xl p-6 bg-[#151D2B] border border-[#1E2837] space-y-5 sticky top-24">
          <h3 className="text-base font-bold text-white pb-3 border-b border-[#1E2837]">
            Order Summary
          </h3>

          {/* Account Status Badge */}
          {currentUser ? (
            <div className="p-3 rounded-xl bg-[#2965E8]/10 border border-[#2965E8]/30 flex items-center gap-2.5 text-xs text-white">
              <LuUser className="size-4 text-[#2965E8]" />
              <div>
                <span className="font-semibold block">Signed in as @{currentUser.username}</span>
                <span className="text-[10px] text-[#A6B1C2]">Order will be saved to your dashboard</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <span className="font-bold block mb-0.5">TechNKT Account Required</span>
              <span>You'll be prompted to enter a username and password upon placing your request (No OTP required).</span>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex justify-between text-[#A6B1C2]">
              <span>Items Total ({items.reduce((t, i) => t + (i.quantity || 1), 0)})</span>
              <span className="font-semibold text-white font-mono">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#A6B1C2]">
              <span>Digital Fulfillment</span>
              <span className="text-emerald-400 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-[#1E2837]">
              <span className="text-sm font-bold text-white">Final Amount</span>
              <span className="text-2xl font-extrabold text-[#F4F6FA] font-mono">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <LuTriangleAlert className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handlePlaceOrder(false)}
              className="w-full h-12 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <LuRefreshCw className="size-4 animate-spin" />
                  <span>Submitting Order Request...</span>
                </>
              ) : (
                <>
                  <span>Place Order Request</span>
                  <LuArrowRight className="size-4" />
                </>
              )}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handlePlaceOrder(true)}
              className="w-full h-11 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <LuPhone className="size-4" />
              <span>Order via WhatsApp (+91 9822587641)</span>
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] text-[#A6B1C2] pt-2 border-t border-[#1E2837]">
            <div className="flex items-center gap-1.5">
              <LuShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
              <span>Guaranteed replacement warranty & verified credentials.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuZap className="size-3.5 text-[#2965E8] shrink-0" />
              <span>Official TechNKT business management.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── IN-LINE AUTH MODAL ──────────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#151D2B] border border-[#2965E8]/40 p-6 shadow-2xl relative">
            <div className="text-center mb-5">
              <div className="size-11 rounded-full bg-[#2965E8]/20 text-[#2965E8] flex items-center justify-center mx-auto mb-2.5">
                <LuUser className="size-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {authMode === "register" ? "Create TechNKT Account" : "Sign In to Account"}
              </h3>
              <p className="text-xs text-[#A6B1C2]">
                {authMode === "register"
                  ? "Sign up with a username and password. No OTP required."
                  : "Sign in to complete your order request."}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#0B101A] rounded-xl border border-[#1E2837] mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === "register"
                    ? "bg-[#2965E8] text-white shadow-sm"
                    : "text-[#A6B1C2] hover:text-white"
                }`}
              >
                New Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  authMode === "login"
                    ? "bg-[#2965E8] text-white shadow-sm"
                    : "text-[#A6B1C2] hover:text-white"
                }`}
              >
                Already have account
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleInCheckoutAuth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Unique username"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={authConfirmPass}
                    onChange={(e) => setAuthConfirmPass(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                  />
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 h-10 rounded-xl bg-[#1E2837] hover:bg-[#2A374A] text-[#A6B1C2] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="flex-1 h-10 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {authSubmitting ? (
                    "Please wait..."
                  ) : authMode === "register" ? (
                    <>
                      <LuSparkles className="size-3.5 text-amber-300" />
                      <span>Create & Order</span>
                    </>
                  ) : (
                    <span>Sign In & Order</span>
                  )}
                </button>
              </div>
            </form>

            {/* One-time recovery codes dialog inside checkout */}
            {newRecoveryCodes && (
              <div className="absolute inset-0 bg-[#151D2B] rounded-2xl p-6 flex flex-col justify-between z-10">
                <div className="text-center">
                  <LuKey className="size-10 text-[#2965E8] mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Save Your Recovery Codes</h4>
                  <p className="text-[11px] text-[#A6B1C2] mb-3">
                    Copy and store these securely in case you forget your password:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-[#0B101A] rounded-lg border border-[#1E2837] font-mono text-[11px] text-white mb-2">
                    {newRecoveryCodes.map((c, i) => (
                      <span key={i} className="py-1 bg-[#151D2B] rounded">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newRecoveryCodes.join("\n"));
                      setCopiedCodes(true);
                      setTimeout(() => setCopiedCodes(false), 2000);
                    }}
                    className="flex-1 h-9 rounded-xl bg-[#1E2837] text-white text-xs font-medium flex items-center justify-center gap-1"
                  >
                    {copiedCodes ? <LuCheck className="size-3.5 text-emerald-400" /> : <LuCopy className="size-3.5" />}
                    <span>{copiedCodes ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewRecoveryCodes(null);
                      setShowAuthModal(false);
                      setTimeout(() => handlePlaceOrder(false), 150);
                    }}
                    className="flex-1 h-9 rounded-xl bg-[#2965E8] text-white text-xs font-semibold"
                  >
                    Done & Submit Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
