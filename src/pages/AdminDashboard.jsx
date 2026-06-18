import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { getAllOrders, updateOrderStatus } from "../firebase/orders";
import ParticlesCanvas from "../components/ParticlesCanvas";

const STATUS_LABELS = {
  pending:   "নতুন",
  confirmed: "কনফার্ম",
  delivered: "ডেলিভারি",
  cancelled: "বাতিল",
};

const STATUS_STYLES = {
  pending:   { badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400" },
  confirmed: { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  delivered: { badge: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  cancelled: { badge: "bg-red-100 text-red-600",       dot: "bg-red-400" },
};

const FILTERS = ["all", "pending", "confirmed", "delivered", "cancelled"];

const STAT_CONFIG = [
  { key: "all",       label: "মোট অর্ডার",  icon: "📦", color: "bg-indigo-50 text-indigo-600" },
  { key: "pending",   label: "নতুন",         icon: "🔔", color: "bg-amber-50 text-amber-600" },
  { key: "confirmed", label: "কনফার্ম",      icon: "✅", color: "bg-emerald-50 text-emerald-600" },
  { key: "delivered", label: "ডেলিভারি",     icon: "🚚", color: "bg-blue-50 text-blue-600" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/admin");
      else { setCheckingAuth(false); loadOrders(); }
    });
    return unsubscribe;
  }, [navigate]);

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      setOrders(await getAllOrders());
    } catch (err) {
      console.error(err);
      setError("অর্ডার লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error(err);
      alert("Status আপডেট করতে সমস্যা হয়েছে।");
    }
  }

  const stats = useMemo(() => ({
    all:       orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }), [orders]);

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0),
    [orders]
  );

  const filteredOrders = useMemo(() =>
    orders
      .filter((o) => filter === "all" || o.status === filter)
      .filter((o) =>
        search.trim() === ""
          ? true
          : o.id.slice(-8).toUpperCase().includes(search.trim().toUpperCase()) ||
            o.phone?.includes(search.trim()) ||
            o.customerName?.toLowerCase().includes(search.trim().toLowerCase())
      )
      .sort((a, b) => {
        if (filter !== "all") return 0;
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0;
      }),
    [orders, filter, search]
  );

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* Particles background */}
      <ParticlesCanvas />

      {/* Top navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1000px] mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🥭</span>
            <div>
              <p className="font-bold text-[var(--color-primary-dark)] text-[15px] leading-tight">ফ্রেশ ফুড রংপুর</p>
              <p className="text-[11px] text-gray-400 leading-tight">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <span className={loading ? "animate-spin inline-block" : ""}>↻</span>
              রিফ্রেশ
            </button>
            <button
              onClick={() => signOut(auth).then(() => navigate("/admin"))}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
            >
              ⎋ লগআউট
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1000px] mx-auto px-5 py-6 relative z-10">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {STAT_CONFIG.map(({ key, label, icon, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-2xl p-4 text-left transition-all border-2 ${
                filter === key
                  ? "border-[var(--color-primary)] bg-white shadow-md"
                  : "border-transparent bg-white shadow-sm hover:shadow-md"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2.5 ${color}`}>
                {icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats[key]}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
            </button>
          ))}
        </div>

        {/* Revenue banner */}
        <div className="rounded-2xl px-6 py-4 mb-6 flex items-center justify-between flex-wrap gap-3"
          style={{ background: "linear-gradient(135deg, #e65100 0%, #f57c00 60%, #ffb300 100%)" }}>
          <div>
            <p className="text-orange-100 text-sm font-medium">মোট রেভিনিউ (বাতিল বাদে)</p>
            <p className="text-white text-2xl font-bold mt-0.5">{totalRevenue.toLocaleString("bn-BD")}.00৳</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-white text-sm font-semibold">
            {stats.delivered} টি ডেলিভারি সম্পন্ন
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="অর্ডার ID, ফোন নম্বর বা নাম দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >×</button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                filter === f
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-[var(--color-primary-light)]"
              }`}
            >
              {f === "all" ? `সব (${stats.all})` : `${STATUS_LABELS[f]} (${stats[f] ?? 0})`}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">অর্ডার লোড হচ্ছে...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-3">📭</p>
            <p className="text-gray-400 font-medium">কোনো অর্ডার পাওয়া যায়নি</p>
          </div>
        )}

        {/* Order cards */}
        <div className="flex flex-col gap-3">
          {filteredOrders.map((order) => {
            const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
            const date  = order.createdAt?.toDate?.();
            return (
              <div
                key={order.id}
                className={`rounded-2xl overflow-hidden transition-shadow ${
                  order.status === "pending"
                    ? "bg-white border-2 border-amber-300 shadow-md hover:shadow-lg"
                    : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Pending top bar */}
                {order.status === "pending" && (
                  <div className="px-5 py-1.5 flex items-center gap-2 border-b border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-[12px] font-bold text-amber-600">নতুন অর্ডার — এখনো কনফার্ম হয়নি</p>
                  </div>
                )}

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-lg font-bold text-[var(--color-primary-dark)]">
                      {order.customerName?.[0] || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-[15px] leading-tight">{order.customerName}</p>
                      <a href={`tel:${order.phone}`} className="text-[var(--color-primary)] text-sm font-medium hover:underline">
                        📞 {order.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${style.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono bg-gray-100 px-2.5 py-1 rounded-full">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-5 py-3.5 flex flex-col gap-2.5">
                  <p className="text-sm text-gray-500 flex items-start gap-1.5">
                    <span className="mt-0.5">📍</span>
                    <span>{order.address}</span>
                  </p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-1.5">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} <span className="text-gray-400">× {item.qty}</span></span>
                        <span className="font-semibold text-gray-700">{(item.price * item.qty).toLocaleString("bn-BD")}৳</span>
                      </div>
                    ))}
                  </div>
                  {order.note && (
                    <p className="text-sm text-gray-400 flex items-start gap-1.5">
                      <span>📝</span> {order.note}
                    </p>
                  )}
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-800 text-base">
                      {order.total?.toLocaleString("bn-BD")}.00৳
                    </p>
                    {date && (
                      <span className="text-[11px] text-gray-400">
                        🕐 {date.toLocaleDateString("bn-BD")} {date.toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-[13px] font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] cursor-pointer"
                  >
                    <option value="pending">🔔 নতুন</option>
                    <option value="confirmed">✅ কনফার্ম</option>
                    <option value="delivered">🚚 ডেলিভারি</option>
                    <option value="cancelled">❌ বাতিল</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
