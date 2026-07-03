import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { handleAnchorClick } from "../utils/smoothScroll";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}>
        <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/images/hero.svg" alt="logo" className="w-9 h-9 rounded-full object-cover" />
            <div className="leading-tight">
              <p className={`font-bold text-[14px] transition-colors ${scrolled || !isHome ? "text-[var(--color-primary-dark)]" : "text-[var(--color-primary-dark)]"}`}>
                ফ্রেশ ফুড রংপুর
              </p>
              <p className="text-[10px] text-[var(--color-text-light)]">হাড়িভাঙ্গা আম</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {isHome && (
              <>
                <a href="#why" onClick={handleAnchorClick} className="px-3 py-2 rounded-lg text-sm font-semibold text-[var(--color-text-light)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)] transition-colors">
                  কেন আমরা
                </a>
                <a href="#faq" onClick={handleAnchorClick} className="px-3 py-2 rounded-lg text-sm font-semibold text-[var(--color-text-light)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)] transition-colors">
                  FAQ
                </a>
                <a href="#pricing" onClick={handleAnchorClick} className="px-3 py-2 rounded-lg text-sm font-semibold text-[var(--color-text-light)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)] transition-colors">
                  মূল্য
                </a>
              </>
            )}
            <Link to="/track-order" className="px-3 py-2 rounded-lg text-sm font-semibold text-[var(--color-text-light)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-soft)] transition-colors">
              🔍 ট্র্যাক অর্ডার
            </Link>
            {isHome ? (
              <a
                href="#order"
                onClick={handleAnchorClick}
                className="ml-2 px-5 py-2.5 rounded-full bg-[var(--color-accent)] text-[#1b1b1b] font-bold text-sm shadow-sm hover:bg-[var(--color-accent-dark)] transition-colors"
              >
                🥭 অর্ডার করুন
              </a>
            ) : (
              <Link
                to="/#order"
                className="ml-2 px-5 py-2.5 rounded-full bg-[var(--color-accent)] text-[#1b1b1b] font-bold text-sm shadow-sm hover:bg-[var(--color-accent-dark)] transition-colors"
              >
                🥭 অর্ডার করুন
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="মেনু"
          >
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-lg px-5 py-4 flex flex-col gap-1 sm:hidden"
          >
            {isHome && (
              <>
                <a href="#why" onClick={handleAnchorClick} className="px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-soft)]">কেন আমরা</a>
                <a href="#faq" onClick={handleAnchorClick} className="px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-soft)]">FAQ</a>
                <a href="#pricing" onClick={handleAnchorClick} className="px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-soft)]">মূল্য</a>
              </>
            )}
            <Link to="/track-order" className="px-4 py-3 rounded-xl text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-soft)]">🔍 ট্র্যাক অর্ডার</Link>
            {isHome ? (
              <a href="#order" onClick={handleAnchorClick} className="mt-1 btn-primary text-center">🥭 অর্ডার করুন</a>
            ) : (
              <Link to="/#order" className="mt-1 btn-primary text-center">🥭 অর্ডার করুন</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide under navbar */}
      <div className="h-16" />
    </>
  );
}
