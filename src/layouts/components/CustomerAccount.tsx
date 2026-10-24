import React, { useState, useEffect } from "react";
import {
  LuUser as User,
  LuPackage as Package,
  LuMessageSquare as MessageSquare,
  LuShield as Shield,
  LuLogOut as LogOut,
  LuKey as Key,
  LuCircleCheck as CheckCircle,
  LuClock as Clock,
  LuSend as Send,
  LuCopy as Copy,
  LuCheck as Check,
  LuExternalLink as ExternalLink,
  LuChevronRight as ChevronRight,
  LuCircleAlert as AlertCircle,
  LuRefreshCw as RefreshCw,
  LuShoppingBag as ShoppingBag,
  LuArrowRight as ArrowRight,
  LuSparkles as Sparkles,
} from "react-icons/lu";

interface CustomerUser {
  id: string;
  username: string;
  displayName: string | null;
  createdAt?: string;
}

interface CustomerProfile {
  user_id: string;
  optional_whatsapp: string | null;
  optional_email: string | null;
  optional_telegram: string | null;
  preferred_contact_method: string;
}

interface OrderItem {
  id: string;
  product_name_snapshot: string;
  variant_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
}

interface Order {
  id: string;
  public_order_reference: string;
  delivery_preference: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  items?: OrderItem[];
}

interface OrderMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: "customer" | "admin";
  message: string;
  created_at: string;
  read_at: string | null;
}

export default function CustomerAccount() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "messages" | "profile" | "security">("overview");

  // Auth form states (logged out)
  const [authMode, setAuthMode] = useState<"login" | "register" | "recover">("login");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Login inputs
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register inputs
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regDisplayName, setRegDisplayName] = useState("");
  const [regWhatsapp, setRegWhatsapp] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regTelegram, setRegTelegram] = useState("");

  // Recovery codes modal after registration
  const [newRecoveryCodes, setNewRecoveryCodes] = useState<string[] | null>(null);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Recovery form inputs
  const [recUsername, setRecUsername] = useState("");
  const [recCode, setRecCode] = useState("");
  const [recNewPassword, setRecNewPassword] = useState("");
  const [recConfirmPassword, setRecConfirmPassword] = useState("");

  // Selected order for detail / messaging
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderMessages, setOrderMessages] = useState<OrderMessage[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Profile update form
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTelegram, setEditTelegram] = useState("");
  const [editPrefContact, setEditPrefContact] = useState("dashboard");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");

  // Change password form
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [passSaving, setPassSaving] = useState(false);
  const [passNotice, setPassNotice] = useState("");

  // Check auth and URL tab on mount
  useEffect(() => {
    checkAuth();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "orders" || tab === "messages" || tab === "profile" || tab === "security" || tab === "overview") {
        setActiveTab(tab);
      }
    }
  }, []);

  async function checkAuth() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
        setProfile(data.profile);
        if (data.profile) {
          setEditDisplayName(data.user.displayName || "");
          setEditWhatsapp(data.profile.optional_whatsapp || "");
          setEditEmail(data.profile.optional_email || "");
          setEditTelegram(data.profile.optional_telegram || "");
          setEditPrefContact(data.profile.preferred_contact_method || "dashboard");
        }
        await loadCustomerOrders();
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomerOrders() {
    try {
      const res = await fetch("/api/customer/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        if (data.orders.length > 0 && !selectedOrder) {
          setSelectedOrder(data.orders[0]);
        }
      }
    } catch (e) {
      console.error("Error loading customer orders:", e);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Login failed. Check your credentials.");
        return;
      }
      setUser(data.user);
      setProfile(data.profile);
      await loadCustomerOrders();
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    if (regPassword !== regConfirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername.trim(),
          password: regPassword,
          confirmPassword: regConfirmPassword,
          displayName: regDisplayName.trim() || undefined,
          optionalWhatsapp: regWhatsapp.trim() || undefined,
          optionalEmail: regEmail.trim() || undefined,
          optionalTelegram: regTelegram.trim() || undefined,
          preferredContact: "dashboard",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Signup failed. Please try again.");
        return;
      }
      setUser(data.user);
      setProfile(data.profile);
      if (Array.isArray(data.recoveryCodes)) {
        setNewRecoveryCodes(data.recoveryCodes);
      }
      await loadCustomerOrders();
    } catch {
      setAuthError("Network error during registration.");
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    if (recNewPassword !== recConfirmPassword) {
      setAuthError("New passwords do not match.");
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: recUsername.trim(),
          recoveryCode: recCode.trim(),
          newPassword: recNewPassword,
          confirmPassword: recConfirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.error || "Recovery failed.");
        return;
      }
      setAuthSuccess("Account recovered successfully! You can now log in.");
      setAuthMode("login");
    } catch {
      setAuthError("Network error during recovery.");
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      setProfile(null);
      setOrders([]);
      setSelectedOrder(null);
    }
  }

  // Load chat messages when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      loadMessagesForOrder(selectedOrder.id);
    }
  }, [selectedOrder]);

  async function loadMessagesForOrder(orderId: string) {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/customer/messages?orderId=${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setOrderMessages(data.messages);
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder || !chatMessage.trim() || sendingMessage) return;
    setSendingMessage(true);
    try {
      const res = await fetch("/api/customer/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          message: chatMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setOrderMessages((prev) => [...prev, data.message]);
        setChatMessage("");
      }
    } catch (e) {
      console.error("Failed to post message:", e);
    } finally {
      setSendingMessage(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileNotice("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: editDisplayName.trim() || undefined,
          optionalWhatsapp: editWhatsapp.trim() || undefined,
          optionalEmail: editEmail.trim() || undefined,
          optionalTelegram: editTelegram.trim() || undefined,
          preferredContact: editPrefContact,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
        if (data.user) setUser(data.user);
        setProfileNotice("Profile updated successfully.");
      } else {
        setProfileNotice(data.error || "Failed to update profile.");
      }
    } catch {
      setProfileNotice("Network error.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassSaving(true);
    setPassNotice("");
    if (newPass !== confirmNewPass) {
      setPassNotice("New passwords do not match.");
      setPassSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
          confirmPassword: confirmNewPass,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPassNotice("Password changed successfully.");
        setCurrentPass("");
        setNewPass("");
        setConfirmNewPass("");
      } else {
        setPassNotice(data.error || "Failed to change password.");
      }
    } catch {
      setPassNotice("Network error.");
    } finally {
      setPassSaving(false);
    }
  }

  function copyRecoveryCodes() {
    if (!newRecoveryCodes) return;
    navigator.clipboard.writeText(newRecoveryCodes.join("\n"));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 3000);
  }

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#A6B1C2]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#2965E8]" />
          <span>Loading account...</span>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // LOGGED OUT VIEW: SIGN IN / SIGN UP (NO OTP) / RECOVERY
  // ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="rounded-3xl p-6 sm:p-10 bg-[#151D2B] border border-[#1E2837] backdrop-blur-xl shadow-2xl relative">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2965E8]/10 text-[#2965E8] border border-[#2965E8]/30 text-xs font-semibold mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>TechNKT Account Desk</span>
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">
              {authMode === "login"
                ? "Sign in to TechNKT"
                : authMode === "register"
                ? "Create Your TechNKT Account"
                : "Account Recovery"}
            </h2>
            <p className="text-xs text-[#A6B1C2]">
              {authMode === "register"
                ? "Sign up with a username and password. No OTP required."
                : authMode === "login"
                ? "Track orders, talk to support, and view digital delivery."
                : "Recover account access using your one-time recovery code."}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#0B101A] rounded-xl border border-[#1E2837] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === "login"
                  ? "bg-[#2965E8] text-white shadow-sm"
                  : "text-[#A6B1C2] hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === "register"
                  ? "bg-[#2965E8] text-white shadow-sm"
                  : "text-[#A6B1C2] hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {authMode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g. nikhil_sharma"
                  className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("recover");
                    setAuthError("");
                  }}
                  className="text-xs text-[#2965E8] hover:text-[#3D75F0] transition-colors"
                >
                  Forgot password? Use a recovery code &rarr;
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTER FORM (NO OTP REQUIRED) */}
          {authMode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                  Username <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  placeholder="Your Name or Nickname"
                  className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                />
              </div>

              {/* Optional Contacts Header */}
              <div className="pt-2 border-t border-[#1E2837]">
                <p className="text-[11px] text-[#A6B1C2] mb-3">
                  <span className="font-semibold text-white">External Contacts (Optional):</span> WhatsApp, email and Telegram are optional. You can add them later if you prefer external delivery or support.
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    placeholder="WhatsApp Number (optional, e.g. 919822587641)"
                    className="w-full h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-xs transition-colors"
                  />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Email Address (optional)"
                    className="w-full h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-xs transition-colors"
                  />
                  <input
                    type="text"
                    value={regTelegram}
                    onChange={(e) => setRegTelegram(e.target.value)}
                    placeholder="Telegram Username (optional, e.g. @myhandle)"
                    className="w-full h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-xs transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-50 cursor-pointer mt-4"
              >
                {authSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Create Account (No OTP)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. RECOVER FORM */}
          {authMode === "recover" && (
            <form onSubmit={handleRecover} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={recUsername}
                  onChange={(e) => setRecUsername(e.target.value)}
                  placeholder="Your username"
                  className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                  One-Time Recovery Code
                </label>
                <input
                  type="text"
                  required
                  value={recCode}
                  onChange={(e) => setRecCode(e.target.value)}
                  placeholder="e.g. 7K4X-9M2P"
                  className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white font-mono placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors uppercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={recNewPassword}
                    onChange={(e) => setRecNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={recConfirmPassword}
                    onChange={(e) => setRecConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full h-11 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] font-semibold text-white text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authSubmitting ? "Verifying..." : "Reset Password & Log In"}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className="text-xs text-[#A6B1C2] hover:text-white transition-colors"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RECOVERY CODES ONE-TIME MODAL */}
        {newRecoveryCodes && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-md w-full rounded-2xl bg-[#151D2B] border border-[#2965E8]/40 p-6 shadow-2xl relative">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#2965E8]/20 text-[#2965E8] flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Save Your One-Time Recovery Codes
                </h3>
                <p className="text-xs text-[#A6B1C2]">
                  Because your account requires no phone or OTP, these codes are your only way to regain access if you forget your password.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-[#0B101A] rounded-xl border border-[#1E2837] mb-4">
                {newRecoveryCodes.map((code, idx) => (
                  <div key={idx} className="font-mono text-center text-xs text-white py-1.5 bg-[#151D2B] rounded border border-[#1E2837]">
                    {code}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-amber-400 mb-4 text-center">
                ⚠️ Store these in a safe place. They will never be shown again!
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyRecoveryCodes}
                  className="flex-1 h-10 rounded-xl bg-[#1E2837] hover:bg-[#2A374A] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedCodes ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCodes ? "Copied!" : "Copy All Codes"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewRecoveryCodes(null)}
                  className="flex-1 h-10 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
                >
                  I Have Saved Them
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────
  // LOGGED IN VIEW: CUSTOMER DASHBOARD
  // ──────────────────────────────────────────────────────────
  const activeOrdersCount = orders.filter((o) => ["new", "awaiting_payment", "sourcing", "ready"].includes(o.order_status)).length;
  const completedOrdersCount = orders.filter((o) => o.order_status === "delivered").length;
  const totalSpent = orders.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Top Banner / Welcome */}
      <div className="rounded-3xl p-6 bg-[#151D2B] border border-[#1E2837] mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2965E8]/20 text-[#2965E8] border border-[#2965E8]/30 font-semibold">
              Authenticated Account
            </span>
            <span className="text-xs text-[#A6B1C2]">@{user.username}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.displayName || user.username}
          </h1>
          <p className="text-xs text-[#A6B1C2] mt-0.5">
            Communication Channel: <span className="text-white font-medium capitalize">{profile?.preferred_contact_method || "TechNKT Dashboard"}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="h-9 px-4 rounded-xl bg-[#1E2837] hover:bg-rose-500/20 text-[#A6B1C2] hover:text-rose-400 border border-[#1E2837] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#1E2837] pb-4 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
              : "bg-[#151D2B] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "orders"
              ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
              : "bg-[#151D2B] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>My Orders ({orders.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "messages"
              ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
              : "bg-[#151D2B] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>In-Site Messages</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
              : "bg-[#151D2B] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Contacts</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-[#2965E8] text-white shadow-md shadow-blue-500/20"
              : "bg-[#151D2B] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security</span>
        </button>
      </div>

      {/* ──────────────── TAB 1: OVERVIEW ──────────────── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
              <span className="text-[11px] text-[#A6B1C2] uppercase font-semibold">Total Requests</span>
              <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
              <span className="text-[10px] text-[#A6B1C2]">Placed in your account</span>
            </div>
            <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
              <span className="text-[11px] text-[#A6B1C2] uppercase font-semibold">Active / In Progress</span>
              <p className="text-2xl font-bold text-[#2965E8] mt-1">{activeOrdersCount}</p>
              <span className="text-[10px] text-[#A6B1C2]">Awaiting delivery</span>
            </div>
            <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
              <span className="text-[11px] text-[#A6B1C2] uppercase font-semibold">Fulfilled Orders</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{completedOrdersCount}</p>
              <span className="text-[10px] text-[#A6B1C2]">Completed successfully</span>
            </div>
            <div className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837]">
              <span className="text-[11px] text-[#A6B1C2] uppercase font-semibold">Total Amount</span>
              <p className="text-2xl font-bold text-white mt-1">₹{totalSpent}/-</p>
              <span className="text-[10px] text-[#A6B1C2]">Confirmed paid</span>
            </div>
          </div>

          {/* Quick Order Tracker Banner */}
          <div className="rounded-2xl p-6 bg-gradient-to-r from-[#151D2B] to-[#1E2837] border border-[#1E2837] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Need to Place a New Order?</h3>
              <p className="text-xs text-[#A6B1C2] mt-0.5">
                Browse our live digital subscriptions and tools catalogue in the Store.
              </p>
            </div>
            <a
              href="/store"
              className="h-10 px-5 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/20"
            >
              <span>Explore Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Recent Orders Preview */}
          <div className="rounded-2xl bg-[#151D2B] border border-[#1E2837] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Recent Order Requests</h3>
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className="text-xs text-[#2965E8] hover:text-[#3D75F0] font-semibold"
              >
                View All &rarr;
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-[#A6B1C2] text-xs">
                No orders placed yet. Visit the Store to submit your first request.
              </div>
            ) : (
              <div className="divide-y divide-[#1E2837]">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {ord.public_order_reference}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2965E8]/20 text-[#2965E8]">
                          {ord.order_status.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A6B1C2] mt-0.5">
                        {ord.items?.map((i) => `${i.product_name_snapshot} (${i.variant_name_snapshot})`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-white">₹{ord.total_amount}/-</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveTab("messages");
                        }}
                        className="block text-[11px] text-[#2965E8] hover:underline mt-0.5 cursor-pointer"
                      >
                        Open Chat &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: MY ORDERS ──────────────── */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-white">All Order Requests</h2>
            <button
              type="button"
              onClick={loadCustomerOrders}
              className="text-xs text-[#A6B1C2] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl p-12 bg-[#151D2B] border border-[#1E2837] text-center">
              <ShoppingBag className="w-12 h-12 text-[#A6B1C2]/40 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No Orders Yet</h3>
              <p className="text-xs text-[#A6B1C2] mb-4">
                You haven't submitted any order requests with this account yet.
              </p>
              <a
                href="/store"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold"
              >
                <span>Browse Store Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl p-5 bg-[#151D2B] border border-[#1E2837] hover:border-[#2965E8]/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-[#1E2837]">
                    <div>
                      <span className="font-mono text-sm font-bold text-[#2965E8]">
                        {ord.public_order_reference}
                      </span>
                      <span className="text-[11px] text-[#A6B1C2] ml-2">
                        {new Date(ord.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          ord.order_status === "delivered"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : ord.order_status === "cancelled"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-[#2965E8]/20 text-[#2965E8] border border-[#2965E8]/30"
                        }`}
                      >
                        {ord.order_status.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          ord.payment_status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {ord.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="py-3 space-y-2">
                    {ord.items?.map((itm) => (
                      <div key={itm.id} className="flex justify-between items-center text-xs">
                        <span className="text-white">
                          {itm.product_name_snapshot} ({itm.variant_name_snapshot}) × {itm.quantity}
                        </span>
                        <span className="font-mono font-semibold text-white">₹{itm.line_total}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#1E2837] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-xs text-[#A6B1C2]">
                      Communication Channel:{" "}
                      <span className="font-semibold text-white capitalize">
                        {ord.delivery_preference}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-base font-bold text-white mr-auto sm:mr-0">
                        ₹{ord.total_amount}/-
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveTab("messages");
                        }}
                        className="px-4 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat With Support</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 3: IN-SITE MESSAGES ──────────────── */}
      {activeTab === "messages" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Selector List */}
          <div className="md:col-span-1 rounded-2xl bg-[#151D2B] border border-[#1E2837] p-4 h-[600px] flex flex-col">
            <h3 className="text-xs font-bold text-[#A6B1C2] uppercase tracking-wider mb-3">
              Order Conversations
            </h3>
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {orders.length === 0 ? (
                <p className="text-xs text-[#A6B1C2] text-center py-6">No orders available.</p>
              ) : (
                orders.map((ord) => (
                  <button
                    key={ord.id}
                    type="button"
                    onClick={() => setSelectedOrder(ord)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedOrder?.id === ord.id
                        ? "bg-[#2965E8]/20 border-[#2965E8] text-white"
                        : "bg-[#0B101A] border-[#1E2837] text-[#A6B1C2] hover:border-[#2965E8]/30"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs font-bold text-white">
                        {ord.public_order_reference}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-[#2965E8]">
                        {ord.order_status}
                      </span>
                    </div>
                    <p className="text-[11px] truncate text-[#A6B1C2]">
                      {ord.items?.map((i) => i.product_name_snapshot).join(", ")}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Active Chat Conversation Panel */}
          <div className="md:col-span-2 rounded-2xl bg-[#151D2B] border border-[#1E2837] flex flex-col h-[600px]">
            {selectedOrder ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-[#1E2837] flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {selectedOrder.public_order_reference}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2965E8]/20 text-[#2965E8]">
                        {selectedOrder.order_status.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A6B1C2]">
                      Direct order messaging with TechNKT team.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadMessagesForOrder(selectedOrder.id)}
                    className="p-2 rounded-lg bg-[#0B101A] hover:bg-[#1E2837] text-[#A6B1C2] hover:text-white transition-colors cursor-pointer"
                    title="Refresh messages"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B101A]">
                  {loadingMessages && orderMessages.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#A6B1C2]">
                      Loading conversation...
                    </div>
                  ) : orderMessages.length === 0 ? (
                    <div className="text-center py-12 text-[#A6B1C2] text-xs">
                      No messages yet for this order. Send a question below!
                    </div>
                  ) : (
                    orderMessages.map((msg) => {
                      const isCustomer = msg.sender_role === "customer";
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isCustomer
                                ? "bg-[#2965E8] text-white rounded-tr-none"
                                : "bg-[#151D2B] text-white border border-[#1E2837] rounded-tl-none"
                            }`}
                          >
                            <span className="block text-[10px] font-semibold opacity-70 mb-1">
                              {isCustomer ? "You" : "TechNKT Team"}
                            </span>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          <span className="text-[9px] text-[#A6B1C2] mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Composer */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#1E2837] bg-[#151D2B] flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message or question regarding your order..."
                    className="flex-1 h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white placeholder:text-[#A6B1C2]/40 focus:border-[#2965E8] focus:outline-none text-xs"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !chatMessage.trim()}
                    className="h-10 px-4 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#A6B1C2]">
                Select an order to view and reply to messages.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────── TAB 4: PROFILE & CONTACTS ──────────────── */}
      {activeTab === "profile" && (
        <div className="max-w-2xl rounded-2xl bg-[#151D2B] border border-[#1E2837] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-1">Profile & Contact Preferences</h2>
          <p className="text-xs text-[#A6B1C2] mb-6">
            TechNKT operates fully through your internal dashboard. External contact details are strictly optional.
          </p>

          {profileNotice && (
            <div className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs">
              {profileNotice}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1">
                Username
              </label>
              <input
                type="text"
                disabled
                value={user.username}
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white/50 text-sm cursor-not-allowed"
              />
              <span className="text-[10px] text-[#A6B1C2]">Usernames cannot be changed.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="Your Display Name"
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-sm focus:border-[#2965E8] focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#1E2837] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Optional External Channels
              </h3>

              <div>
                <label className="block text-xs font-medium text-[#A6B1C2] mb-1">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="text"
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  placeholder="e.g. 919822587641"
                  className="w-full h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-xs focus:border-[#2965E8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6B1C2] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-xs focus:border-[#2965E8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6B1C2] mb-1">
                  Telegram Contact (Optional)
                </label>
                <input
                  type="text"
                  value={editTelegram}
                  onChange={(e) => setEditTelegram(e.target.value)}
                  placeholder="e.g. @myhandle"
                  className="w-full h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-xs focus:border-[#2965E8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A6B1C2] mb-1">
                  Default Communication Preference
                </label>
                <select
                  value={editPrefContact}
                  onChange={(e) => setEditPrefContact(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-xs focus:border-[#2965E8] focus:outline-none"
                >
                  <option value="dashboard">TechNKT Dashboard (Recommended - No external app needed)</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="h-10 px-6 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer mt-4"
            >
              {profileSaving ? "Saving..." : "Save Profile Details"}
            </button>
          </form>
        </div>
      )}

      {/* ──────────────── TAB 5: SECURITY ──────────────── */}
      {activeTab === "security" && (
        <div className="max-w-xl rounded-2xl bg-[#151D2B] border border-[#1E2837] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-1">Security & Password</h2>
          <p className="text-xs text-[#A6B1C2] mb-6">
            Manage your account credentials and password.
          </p>

          {passNotice && (
            <div className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs">
              {passNotice}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter current password"
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-sm focus:border-[#2965E8] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-sm focus:border-[#2965E8] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A6B1C2] uppercase tracking-wider mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-11 px-4 rounded-xl bg-[#0B101A] border border-[#1E2837] text-white text-sm focus:border-[#2965E8] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={passSaving}
              className="h-10 px-6 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer mt-2"
            >
              {passSaving ? "Updating Password..." : "Change Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
