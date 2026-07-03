import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getOrdersByPhone, getOrderById, getAllOrders } from "../firebase/orders";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";

const STATUS_STEPS = ["pending", "confirmed", "packed", "shipped", "delivered"];

const STATUS_INFO = {
  pending:   { label: "অর্ডার গৃহীত",     icon: "📦", color: "text-amber-600",   bg: "bg-amber-100" },
  confirmed: { label: "কনফার্ম হয়েছে",    icon: "✅", color: "text-emerald-600", bg: "bg-emerald-100" },
  packed:    { label: "প্যাক হয়েছে",      icon: "📫", color: "text-blue-600",    bg: "bg-blue-100" },
  shipped:   { label: "কুরিয়ারে আছে",     icon: "🚚", color: "text-purple-600",  bg: "bg-purple-100" },
  delivered: { label: "ডেলিভারি হয়েছে",   icon: "🎉", color: "text-green-700",   bg: "bg-green-100" },
  cancelled: { label: "বাতিল হয়েছে",      icon: "❌", color: "text-red-600",     bg: "bg-red-100" },
};

function OrderCard({ order }) {
  const info = STATUS_INFO[order.status] || STATUS_INFO.pending;
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const date = order.createdAt?.toDate?.();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="font-bold text-gray-800 text-[15px]">{order.customerName}</p>
          <p className="text-sm text-gray-400 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${info.bg} ${info.color}`}>
          {info.icon} {info.label}
        </span>
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 z-0" />
            <div
              className="absolute left-0 top-4 h-1 bg-[var(--color-primary)] z-0 transition-all duration-700"
              style={{ width: currentStep >= 0 ? `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` : "0%" }}
            />
            {STATUS_STEPS.map((step, i) => {
              const s = STATUS_INFO[step];
              const done = i <= currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-1 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                    done ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white" : "bg-white border-gray-300 text-gray-400"
                  }`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <p className={`text-[10px] font-semibold text-center max-w-[52px] leading-tight ${done ? "text-[var(--color-primary-dark)]" : "text-gray-400"}`}>
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="px-5 py-3.5 flex flex-col gap-2">
        <p className="text-sm text-gray-500 flex items-start gap-1.5">
          <span>📍</span><span>{order.address}</span>
        </p>
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-1.5">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name} <span className="text-gray-400">× {item.qty}</span></span>
              <span className="font-semibold text-gray-700">{(item.price * item.qty).toLocaleString("bn-BD")}৳</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <p className="font-bold text-gray-800">মোট: {order.total?.toLocaleString("bn-BD")}.00৳</p>
        {date && <p className="text-[11px] text-gray-400">🕐 {date.toLocaleDateString("bn-BD")}</p>}
      </div>
    </motion.div>
  );
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      let orders = [];

      if (/^01[0-9]{9}$/.test(q)) {
        orders = await getOrdersByPhone(q);
      } else if (q.length >= 6) {
        const byId = await getOrderById(q).catch(() => null);
        if (byId) {
          orders = [byId];
        } else {
          const all = await getAllOrders();
          orders = all.filter((o) => o.id.slice(-8).toUpperCase() === q.toUpperCase());
        }
      }

      if (orders.length === 0) {
        setError("কোনো অর্ডার পাওয়া যায়নি। ফোন নম্বর বা অর্ডার ID সঠিক কিনা চেক করুন।");
      } else {
        setResults(orders);
      }
    } catch (err) {
      console.error(err);
      setError("অর্ডার খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <SEO title="অর্ডার ট্র্যাক" description="আপনার অর্ডার নম্বর বা ফোন দিয়ে অর্ডারের অবস্থান জানুন।" />
      <Navbar />
      <div className="bg-[var(--color-bg-soft)] py-12 px-5 min-h-screen">
        <div className="max-w-[640px] mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[clamp(22px,4vw,32px)] font-bold text-[var(--color-primary-dark)] mb-2">
              অর্ডার ট্র্যাক করুন
            </h1>
            <p className="text-[var(--color-text-light)] text-sm">
              আপনার ফোন নম্বর বা অর্ডার ID দিয়ে অর্ডারের অবস্থান জানুন
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm p-5 mb-6">
            <label className="font-semibold text-sm text-[var(--color-text)] block mb-2">
              ফোন নম্বর বা অর্ডার ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="017XXXXXXXX বা XMWTHETP"
                className="flex-1 border border-[var(--color-border)] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
              />
              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 shrink-0"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : "খুঁজুন"}
              </motion.button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              * Thank You পেজে দেওয়া অর্ডার নম্বর বা অর্ডারে ব্যবহৃত ফোন নম্বর দিন
            </p>
          </form>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 text-center"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex flex-col gap-4">
            {results?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
