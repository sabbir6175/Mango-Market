import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { handleAnchorClick } from "../utils/smoothScroll";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[var(--color-primary)] text-white shadow-lg flex items-center justify-center text-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          aria-label="উপরে যান"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none"
        >
          <div className="max-w-[480px] mx-auto pointer-events-auto">
            <a
              href="#order"
              onClick={handleAnchorClick}
              className="btn-primary w-full shadow-2xl text-base"
            >
              🥭 এখনই অর্ডার করুন
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
