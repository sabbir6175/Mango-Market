import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { handleAnchorClick } from "../utils/smoothScroll";

function Hero() {
  const ref = useScrollAnimation();

  return (
    <header className="bg-gradient-to-b from-[var(--color-bg-soft)] to-white">
      <div className="flex justify-center py-5">
        <img
          src="/images/hero.svg"
          alt="ফ্রেশ ফুড রংপুর"
          className="w-[90px] h-[90px] rounded-full object-cover shadow-md"
        />
      </div>

      <div
        ref={ref}
        className="scroll-reveal container mx-auto max-w-[1100px] px-5 text-center py-5 pb-14 flex flex-col items-center gap-[18px]"
      >
        <p className="inline-block bg-[var(--color-primary)] text-white font-semibold text-sm px-[18px] py-1.5 rounded-full">
          🥭 ফ্রেশ ফুড রংপুর
        </p>

        <h1 className="font-bold text-[clamp(26px,5vw,42px)] leading-tight text-[var(--color-primary-dark)] max-w-[720px]">
          এবছরের প্রথম রংপুরের ফরমালিনমুক্ত
          <br />
          বিখ্যাত হাড়িভাঙ্গা আম
        </h1>

        <div className="flex items-center gap-2 font-bold tracking-wide text-[var(--color-primary)] text-sm">
          <span className="bg-[var(--color-primary)] text-white w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs">
            ✔
          </span>
          <span>QUALITY ASSURED</span>
        </div>

        <p className="max-w-[640px] text-[var(--color-text-light)] text-base">
          গার্ডেন ফ্রেশ হাড়িভাঙ্গা আমের অর্ডার শুরু হয়ে গেছে অলরেডি। "ভাই,
          কেমিক্যাল ছাড়া হাড়িভাঙ্গা আম পাব কোথায়?" এই প্রশ্নের উত্তর — "ফ্রেশ
          ফুড রংপুর"
        </p>

        <a href="#order" onClick={handleAnchorClick} className="btn-primary mt-2">
          অর্ডার করতে চাই
        </a>
      </div>
    </header>
  );
}

export default Hero;
