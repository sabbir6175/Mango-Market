import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { handleAnchorClick } from "../utils/smoothScroll";
import { PRODUCTS, SHOP_PHONE } from "../data/products";

function Pricing() {
  const titleRef = useScrollAnimation();
  const cardsRef = useScrollAnimation();
  const infoRef = useScrollAnimation();

  return (
    <section className="py-16 bg-[var(--color-bg-soft)]">
      <div className="container mx-auto max-w-[1100px] px-5">
        <h2
          ref={titleRef}
          className="scroll-reveal text-center text-[clamp(24px,4vw,34px)] font-bold text-[var(--color-primary-dark)] mb-2"
        >
          হাড়িভাঙ্গা আমের অফার প্রাইজ
        </h2>
        <p className="text-center text-[var(--color-text-light)] mb-8">
          সরাসরি বাগান থেকে আপনার ঘরে
        </p>

        <div ref={cardsRef} className="scroll-reveal grid grid-cols-3 max-[640px]:grid-cols-1 gap-4 mb-8">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-sm px-4 py-7 text-center border-2 border-transparent hover:border-[var(--color-primary-light)] transition-colors"
            >
              <h3 className="text-lg text-[var(--color-primary-dark)] font-bold mb-1.5">
                {p.name.replace("ক্যারেট", "").trim()}
              </h3>
              <p className="text-[13px] text-[var(--color-text-light)] mb-3.5">
                প্রিমিয়াম হাড়িভাঙ্গা আম
              </p>
              <p className="text-2xl font-bold text-[var(--color-primary)] mb-2.5">
                {p.price.toLocaleString("bn-BD")} টাকা
              </p>
              <span className="inline-block bg-[var(--color-accent)] text-[#1b1b1b] text-xs font-bold px-3.5 py-1 rounded-full">
                অফার প্রাইজ
              </span>
            </div>
          ))}
        </div>

        <div ref={infoRef} className="scroll-reveal text-center flex flex-col gap-1.5 font-medium mb-2">
          <p>🚚 ডেলিভারি চার্জ ফ্রি</p>
          <p>💵 ক্যাশ অন ডেলিভারি সুবিধা রয়েছে</p>
          <p>📲 প্রয়োজনে যোগাযোগ করুন : {SHOP_PHONE}</p>
        </div>

        <div className="flex justify-center my-7">
          <a href="#order" onClick={handleAnchorClick} className="btn-primary">
            অর্ডার করতে চাই
          </a>
        </div>

        <div className="flex justify-center gap-6 mt-5 font-semibold text-[var(--color-primary-dark)] flex-wrap">
          <span>✓ পরিপক্ক আম</span>
          <span>✓ প্রিজারভেটিভ বিহীন</span>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
