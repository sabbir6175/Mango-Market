import { motion } from "framer-motion";
import { handleAnchorClick } from "../utils/smoothScroll";

export default function Hero() {
  return (
    <header className="bg-gradient-to-b from-[var(--color-bg-soft)] to-white">
      <div className="flex justify-center pt-4 pb-2">
        <motion.img
          src="/images/hero.svg"
          alt="ফ্রেশ ফুড রংপুর"
          className="w-[90px] h-[90px] rounded-full object-cover shadow-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="container mx-auto max-w-[1100px] px-5 text-center py-5 pb-14 flex flex-col items-center gap-[18px]">
        <motion.p
          className="inline-block bg-[var(--color-primary)] text-white font-semibold text-sm px-[18px] py-1.5 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          🥭 ফ্রেশ ফুড রংপুর
        </motion.p>

        <motion.h1
          className="font-bold text-[clamp(26px,5vw,42px)] leading-tight text-[var(--color-primary-dark)] max-w-[720px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          এবছরের প্রথম রংপুরের ফরমালিনমুক্ত
          <br />
          বিখ্যাত হাড়িভাঙ্গা আম
        </motion.h1>

        <motion.div
          className="flex items-center gap-2 font-bold tracking-wide text-[var(--color-primary)] text-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="bg-[var(--color-primary)] text-white w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs">✔</span>
          <span>QUALITY ASSURED</span>
        </motion.div>

        <motion.p
          className="max-w-[640px] text-[var(--color-text-light)] text-base"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          গার্ডেন ফ্রেশ হাড়িভাঙ্গা আমের অর্ডার শুরু হয়ে গেছে অলরেডি। "ভাই,
          কেমিক্যাল ছাড়া হাড়িভাঙ্গা আম পাব কোথায়?" এই প্রশ্নের উত্তর — "ফ্রেশ ফুড রংপুর"
        </motion.p>

        <motion.a
          href="#order"
          onClick={handleAnchorClick}
          className="btn-primary mt-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          অর্ডার করতে চাই
        </motion.a>
      </div>
    </header>
  );
}
