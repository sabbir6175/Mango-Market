import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-soft)]">
      <SEO title="পেজ পাওয়া যায়নি" />
      <Navbar />
      <div className="flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-[420px]"
        >
          <motion.p
            className="text-[100px] leading-none mb-4"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            🥭
          </motion.p>
          <h1 className="text-6xl font-bold text-[var(--color-primary-dark)] mb-3">404</h1>
          <p className="text-xl font-bold text-[var(--color-text)] mb-2">পেজ পাওয়া যায়নি!</p>
          <p className="text-[var(--color-text-light)] mb-8 text-sm">
            আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে বা এই ঠিকানায় কিছু নেই।
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/" className="btn-primary">
              🏠 হোমে ফিরে যান
            </Link>
            <Link
              to="/track-order"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              🔍 অর্ডার ট্র্যাক করুন
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
