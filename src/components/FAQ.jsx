import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";
import { handleAnchorClick } from "../utils/smoothScroll";

const FAQ_ITEMS = [
  {
    q: "আম কি ফরমালিন বা কেমিক্যালমুক্ত?",
    a: "জ্বি, আমাদের আম সম্পূর্ণ ন্যাচারাল এবং ক্ষতিকর কেমিক্যালমুক্ত। সরাসরি চুয়াডাঙ্গার বাগান থেকে পরিপক্ক আম সংগ্রহ করে আপনাদের ঠিকানায় পাঠানো হয়।",
  },
  {
    q: "আমগুলো কি কুরিয়ারে নষ্ট হওয়ার সম্ভাবনা আছে?",
    a: "আমরা আমগুলো আধা-পাকা অবস্থায় বিশেষ সতর্কতায় প্যাকিং করি। এতে কুরিয়ারে নষ্ট হওয়ার ঝুঁকি থাকে না এবং আপনি হাতে পাওয়ার পর পেকে খাওয়ার উপযোগী হয়।",
  },
  {
    q: "ডেলিভারি পেতে কতদিন সময় লাগতে পারে?",
    a: "অর্ডার কনফার্ম করার পর আমের ব্যাচ রেডি করে পাঠানো হয়। সাধারণত ২ থেকে ৩ দিনের মধ্যেই আপনি ফ্রেশ আম হাতে পেয়ে যাবেন।",
  },
  {
    q: "কেন আপনাদের থেকে আম কিনব?",
    a: "আমরা সরাসরি বাগান থেকে কোনো মাধ্যম ছাড়াই আম সরবরাহ করি। আমাদের মূল লক্ষ্য হলো আপনাদের পরিবারের জন্য সাশ্রয়ী মূল্যে বিশুদ্ধ ও সুস্বাদু আম নিশ্চিত করা।",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto max-w-[1100px] px-5">

        <FadeIn>
          <h2 className="text-center text-[clamp(24px,4vw,34px)] font-bold text-[var(--color-primary-dark)] mb-2">
            সাধারণ জিজ্ঞাসা
          </h2>
          <p className="text-center text-[var(--color-text-light)] mb-8">আপনার প্রশ্নের উত্তর</p>
        </FadeIn>

        <div className="max-w-[680px] mx-auto flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeIn key={item.q} delay={i * 0.08}>
                <div className={`border rounded-xl overflow-hidden bg-[var(--color-bg-soft)] ${
                  isOpen ? "border-[var(--color-primary-light)]" : "border-[var(--color-border)]"
                }`}>
                  <button
                    className="w-full flex justify-between items-center bg-transparent px-5 py-4.5 font-semibold text-base text-left text-[var(--color-text)]"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <motion.span
                      className="text-xl text-[var(--color-primary)] shrink-0 ml-3"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      +
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="px-5 pb-4.5 text-[var(--color-text-light)] text-[15px]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="flex justify-center my-7">
          <a href="#order" onClick={handleAnchorClick} className="btn-primary">অর্ডার করতে চাই</a>
        </div>

      </div>
    </section>
  );
}
