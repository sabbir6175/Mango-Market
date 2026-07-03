import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SHOP_PHONE, SHOP_WHATSAPP } from "../data/products";
import { generateInvoice } from "../utils/generateInvoice";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";

function ThankYouPage() {
  const location = useLocation();
  const orderInfo = location.state;

  if (!orderInfo) return <Navigate to="/" replace />;

  const { orderId, name, phone, total } = orderInfo;
  const shortId = orderId.slice(-8).toUpperCase();

  function handleDownload() {
    generateInvoice({
      id: orderId,
      customerName: name,
      phone,
      total,
      items: [],
    });
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      <SEO title="অর্ডার সম্পন্ন" description="আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।" />
      <Navbar />
      <div className="flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl px-8 py-12 max-w-[480px] w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white text-3xl flex items-center justify-center mx-auto mb-5"
        >
          ✓
        </motion.div>

        <h1 className="text-2xl text-[var(--color-primary-dark)] font-bold mb-2">
          ধন্যবাদ, {name}!
        </h1>
        <p className="text-[var(--color-text-light)] mb-7">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
        </p>

        {/* Order summary */}
        <div className="bg-[var(--color-bg-soft)] rounded-xl p-4 mb-6 flex flex-col gap-3 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">অর্ডার নম্বর</span>
            <strong className="font-mono">{shortId}</strong>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">ফোন নাম্বার</span>
            <strong>{phone}</strong>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">সর্বমোট</span>
            <strong>{total.toLocaleString("bn-BD")}.00৳</strong>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">পেমেন্ট পদ্ধতি</span>
            <strong>ক্যাশ অন ডেলিভারি</strong>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">আনুমানিক ডেলিভারি</span>
            <strong>২–৩ কার্যদিবস</strong>
          </div>
        </div>

        <p className="text-sm mb-6 text-[var(--color-text-light)]">
          অর্ডার কনফার্ম করতে আমাদের প্রতিনিধি শীঘ্রই{" "}
          <strong className="text-[var(--color-text)]">{phone}</strong> নম্বরে কল করবেন।
        </p>

        {/* Invoice buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors"
          >
            📥 Invoice ডাউনলোড
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            🖨️ প্রিন্ট করুন
          </button>
        </div>

        {/* Contact buttons */}
        <div className="flex gap-2 mb-4">
          <a
            href={`tel:${SHOP_PHONE}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-bg-soft)] border border-[var(--color-border)] font-semibold text-sm"
          >
            📞 কল করুন
          </a>
          <a
            href={`https://wa.me/${SHOP_WHATSAPP}?text=আমার অর্ডার নম্বর: ${shortId}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25d366] text-white font-semibold text-sm"
          >
            💬 WhatsApp
          </a>
        </div>

        <Link to="/" className="btn-primary w-full mb-3">
          হোমে ফিরে যান
        </Link>

        <Link
          to="/track-order"
          className="block text-center text-sm text-[var(--color-primary)] font-semibold hover:underline"
        >
          🔍 অর্ডার ট্র্যাক করুন
        </Link>
      </motion.div>
      </div>
    </div>
  );
}

export default ThankYouPage;
