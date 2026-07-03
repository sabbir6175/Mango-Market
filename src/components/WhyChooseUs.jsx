import FadeIn from "./FadeIn";
import { handleAnchorClick } from "../utils/smoothScroll";

const FEATURES = [
  "আমের রাজা হিসাবে পরিচিত",
  "অসাধারণ স্বাদ ও গন্ধ",
  "রসালো ও সম্পূর্ণ আঁশমুক্ত",
  "পাতলা খোসা হয়",
  "শিশু সহ সবার জন্য সেরা আম",
  "পুষ্টিগুণ ও স্বাস্থ্য উপকারিতা বেশি",
];

const REASONS = [
  "100% রাসায়নিক মুক্ত তার গ্যারান্টি",
  "রংপুর জেলার আবহাওয়ার কারণে আম হয় অত্যন্ত সুমিষ্ট",
  "বাগান থেকে যেদিন আম Harvest করা হয় ওই দিনেই কুরিয়ারে পাঠিয়ে দেওয়া হয়",
  "পরিবারের সবাই সম্পূর্ণ কেমিক্যাল মুক্ত আম উপভোগ করবেন, তার শতভাগ নিশ্চয়তা দিতে পারি",
  "আম বাছাই করে পাঠিয়ে থাকি এবং প্রতিজ্ঞাবদ্ধ ভালো আমের জন্য",
  "প্রিমিয়াম প্যাকেজিং এবং নিরাপদ হোম ডেলিভারি পৌঁছাবে",
];

const GALLERY_COUNT = 9;

export default function WhyChooseUs() {
  return (
    <section id="why" className="py-16 bg-white">
      <div className="container mx-auto max-w-[1100px] px-5">

        <FadeIn>
          <h2 className="text-center text-[clamp(24px,4vw,34px)] font-bold text-[var(--color-primary-dark)] mb-9">
            কেন আমাদের হাড়িভাঙ্গা আম নিবেন?
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-2.5 mb-10">
            {Array.from({ length: GALLERY_COUNT }).map((_, i) => (
              <img
                key={i}
                src="/images/gallery.svg"
                alt={`হাড়িভাঙ্গা আম ${i + 1}`}
                className="w-full aspect-square object-cover rounded-md bg-[var(--color-bg-soft)]"
              />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="max-w-[640px] mx-auto mb-6">
            <h3 className="text-lg text-[var(--color-primary-dark)] font-bold mb-3.5">
              হাড়িভাঙ্গা আম এর বিশেষ গুনাগুন ও বৈশিষ্ট্য :-
            </h3>
            <ul className="flex flex-col gap-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="relative pl-6.5">
                  <span className="absolute left-0 top-0 text-[var(--color-primary)] font-bold">✔</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <div className="flex justify-center my-7">
          <a href="#order" onClick={handleAnchorClick} className="btn-primary">অর্ডার করতে চাই</a>
        </div>

        <FadeIn delay={0.1}>
          <div className="max-w-[640px] mx-auto mb-6">
            <h3 className="text-lg text-[var(--color-primary-dark)] font-bold mb-3.5">
              আমাদের কাছ থেকে কেন নিবেন :-
            </h3>
            <ul className="flex flex-col gap-2.5">
              {REASONS.map((r) => (
                <li key={r} className="relative pl-6.5">
                  <span className="absolute left-0 top-0 text-[var(--color-primary)] font-bold">✔</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <div className="flex justify-center my-7">
          <a href="#order" onClick={handleAnchorClick} className="btn-primary">অর্ডার করতে চাই</a>
        </div>

      </div>
    </section>
  );
}
