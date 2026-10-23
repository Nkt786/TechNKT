import React, { useState, useEffect } from "react";
import {
  LuX,
  LuPhone,
  LuMail,
  LuSend,
  LuShieldCheck,
  LuDollarSign,
  LuPackage,
  LuRefreshCw,
  LuUser,
  LuMessageSquare,
  LuCircleCheck,
  LuCreditCard,
  LuCheck,
} from "react-icons/lu";

interface OrderItem {
  id: string;
  product_id: string;
  product_variant_id: string;
  product_name_snapshot: string;
  variant_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
}

interface OrderRecord {
  id: string;
  public_order_reference: string;
  guest_contact_id: string;
  customer_user_id?: string | null;
  customer_username?: string | null;
  delivery_preference: string;
  order_source: string;
  order_status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
  admin_notes: string | null;
  created_at: string;
  customer_name?: string | null;
  whatsapp_number?: string | null;
  email?: string | null;
  telegram_contact?: string | null;
  items?: OrderItem[];
}

interface Message {
  id: string;
  sender_role: "customer" | "admin";
  message: string;
  created_at: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  payment_method: string | null;
  reference: string | null;
  created_at: string;
}

export default function OrderDeskDrawer({
  order,
  onClose,
  onOrderUpdated,
  showToast,
}: {
  order: OrderRecord;
  onClose: () => void;
  onOrderUpdated: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Payments
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(String(order.total_amount));
  const [paymentMethod, setPaymentMethod] = useState("UPI QR");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Status updating
  const [currentStatus, setCurrentStatus] = useState(order.order_status);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/admin/orders/messages?orderId=${encodeURIComponent(order.id)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch {
      // fallback
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/admin/orders/payment?orderId=${encodeURIComponent(order.id)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments);
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchPayments();
  }, [order.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;
    setSendingMessage(true);
    try {
      const res = await fetch("/api/admin/orders/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          message: newMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        showToast("Message sent to customer");
      } else {
        showToast("Failed to send message", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      showToast("Enter a valid payment amount", "error");
      return;
    }
    setRecordingPayment(true);
    try {
      const res = await fetch("/api/admin/orders/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: Number(paymentAmount),
          paymentMethod,
          reference: paymentRef,
          notes: paymentNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Payment recorded successfully");
        setShowPaymentModal(false);
        fetchPayments();
        onOrderUpdated();
      } else {
        showToast(data.error || "Failed to record payment", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setRecordingPayment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${newStatus.replace(/_/g, " ")}`);
        onOrderUpdated();
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = Math.max(0, order.total_amount - totalPaid);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] md:w-[620px] bg-[#151D2B] border-l border-[#1E2837] shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-[#1E2837] flex justify-between items-center bg-[#0B101A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-[#2965E8]">
              {order.public_order_reference}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2965E8]/20 text-[#2965E8] border border-[#2965E8]/30 uppercase">
              {currentStatus.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-[#A6B1C2] mt-0.5">
            Placed on {new Date(order.created_at).toLocaleString("en-IN")}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#A6B1C2] hover:text-white hover:bg-[#1E2837] transition-colors cursor-pointer"
        >
          <LuX className="size-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Status Workflow Selector */}
        <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] space-y-2">
          <label className="block text-xs font-semibold text-[#A6B1C2] uppercase">
            Order Status Workflow
          </label>
          <select
            value={currentStatus}
            disabled={updatingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-[#151D2B] border border-[#1E2837] text-xs font-semibold text-white focus:outline-none focus:border-[#2965E8] cursor-pointer"
          >
            <option value="new">Request Received (New)</option>
            <option value="under_review">Under Review</option>
            <option value="awaiting_payment">Quoted / Awaiting Payment</option>
            <option value="paid">Payment Confirmed</option>
            <option value="sourcing">Sourcing from Supplier</option>
            <option value="ready">Ready for Delivery</option>
            <option value="delivered">Delivered / Fulfilled</option>
            <option value="awaiting_customer_message">Awaiting Customer Response</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Customer Information */}
        <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] space-y-2">
          <h4 className="text-xs font-bold text-[#A6B1C2] uppercase tracking-wider">
            Customer Information
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[#A6B1C2] block text-[11px]">Username</span>
              <span className="font-semibold text-white">
                {order.customer_username ? `@${order.customer_username}` : "Guest Order"}
              </span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block text-[11px]">Contact Channel</span>
              <span className="font-semibold text-white capitalize">
                {order.delivery_preference}
              </span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block text-[11px]">Customer Name</span>
              <span className="text-white">{order.customer_name || "—"}</span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block text-[11px]">WhatsApp / Phone</span>
              <span className="text-white font-mono">{order.whatsapp_number || "—"}</span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block text-[11px]">Email</span>
              <span className="text-white">{order.email || "—"}</span>
            </div>
            <div>
              <span className="text-[#A6B1C2] block text-[11px]">Telegram</span>
              <span className="text-white">{order.telegram_contact || "—"}</span>
            </div>
          </div>
        </div>

        {/* Products Ordered */}
        <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] space-y-3">
          <h4 className="text-xs font-bold text-[#A6B1C2] uppercase tracking-wider">
            Requested Products ({order.items?.length || 0})
          </h4>
          <div className="divide-y divide-[#1E2837]">
            {order.items?.map((item) => (
              <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white block">{item.product_name_snapshot}</span>
                  <span className="text-[11px] text-[#A6B1C2]">
                    {item.variant_name_snapshot} × {item.quantity}
                  </span>
                </div>
                <span className="font-mono font-bold text-white">
                  ₹{item.line_total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary & Payment Recording */}
        <div className="p-4 rounded-xl bg-[#0B101A] border border-[#1E2837] space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-[#A6B1C2] uppercase tracking-wider">
              Financial Status
            </h4>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-2.5 py-1 rounded-lg bg-[#2965E8] hover:bg-[#3D75F0] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <LuCreditCard className="size-3" />
              <span>Record Payment</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-[#151D2B] border border-[#1E2837]">
              <span className="text-[#A6B1C2] text-[10px] uppercase block">Total Amount</span>
              <span className="font-mono font-bold text-white text-sm">
                ₹{order.total_amount.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#151D2B] border border-[#1E2837]">
              <span className="text-[#A6B1C2] text-[10px] uppercase block">Payments In</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                ₹{totalPaid.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#151D2B] border border-[#1E2837]">
              <span className="text-[#A6B1C2] text-[10px] uppercase block">Balance Due</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                ₹{balanceDue.toLocaleString()}
              </span>
            </div>
          </div>

          {payments.length > 0 && (
            <div className="pt-2 border-t border-[#1E2837] space-y-1">
              <span className="text-[11px] font-semibold text-[#A6B1C2] block">
                Recorded Transactions:
              </span>
              {payments.map((p) => (
                <div key={p.id} className="flex justify-between text-[11px] text-[#A6B1C2]">
                  <span>
                    ₹{p.amount} via {p.payment_method} {p.reference ? `(${p.reference})` : ""}
                  </span>
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* In-Site Live Customer Messaging Thread */}
        <div className="rounded-xl bg-[#0B101A] border border-[#1E2837] overflow-hidden flex flex-col h-[320px]">
          <div className="p-3 bg-[#151D2B] border-b border-[#1E2837] flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <LuMessageSquare className="size-4 text-[#2965E8]" />
              <span className="text-xs font-bold text-white">Live Customer Conversation</span>
            </div>
            <button
              onClick={fetchMessages}
              className="p-1 rounded text-[#A6B1C2] hover:text-white cursor-pointer"
              title="Refresh messages"
            >
              <LuRefreshCw className={`size-3.5 ${loadingMessages ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#0B101A]">
            {loadingMessages && messages.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#A6B1C2]">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#A6B1C2]">
                No messages yet. Send an update or payment instruction to the customer below.
              </div>
            ) : (
              messages.map((m) => {
                const isAdmin = m.sender_role === "admin";
                return (
                  <div key={m.id} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-2.5 text-xs ${
                        isAdmin
                          ? "bg-[#2965E8] text-white rounded-tr-none"
                          : "bg-[#151D2B] text-white border border-[#1E2837] rounded-tl-none"
                      }`}
                    >
                      <span className="block text-[10px] font-semibold opacity-70 mb-0.5">
                        {isAdmin ? "You (Admin)" : "Customer"}
                      </span>
                      <p className="whitespace-pre-wrap">{m.message}</p>
                    </div>
                    <span className="text-[9px] text-[#A6B1C2] mt-0.5 px-1">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Composer */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-[#151D2B] border-t border-[#1E2837] flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Reply to customer regarding credentials or payment..."
              className="flex-1 h-9 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
            />
            <button
              type="submit"
              disabled={sendingMessage || !newMessage.trim()}
              className="h-9 px-3.5 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <LuSend className="size-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#151D2B] border border-[#1E2837] shadow-2xl p-6">
            <div className="flex justify-between items-center pb-3 border-b border-[#1E2837] mb-4">
              <h3 className="text-base font-bold text-white">Record Customer Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-[#A6B1C2] hover:text-white cursor-pointer">
                <LuX className="size-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Amount Received (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                >
                  <option value="UPI QR">UPI QR (PhonePe / GPay / Paytm)</option>
                  <option value="IMPS / Bank Transfer">IMPS / NEFT Bank Transfer</option>
                  <option value="Cash / Manual">Cash / Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Bank UTR / Transaction Reference
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. 420918374921"
                  className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#A6B1C2] uppercase mb-1">
                  Verification Notes
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Verified in HDFC current account..."
                  className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-[#2965E8]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E2837] text-[#A6B1C2] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordingPayment}
                  className="px-5 py-2 rounded-xl bg-[#2965E8] hover:bg-[#3D75F0] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {recordingPayment ? "Saving..." : "Confirm & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
