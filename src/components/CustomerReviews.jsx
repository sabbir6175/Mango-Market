import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { handleAnchorClick } from "../utils/smoothScroll";
import { SHOP_PHONE, SHOP_WHATSAPP } from "../data/products";

const REVIEW_COUNT = 5;
const REVIEWS = Array.from({ length: REVIEW_COUNT }, (_, i) => ({
  src: "/images/review.svg",
  alt: `গ্রাহক রিভিউ ${i + 1}`,
}));

function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);
  const autoRef = useRef(null);

  const titleRef = useScrollAnimation();
  const ctaRef = useScrollAnimation();

  const prev = useCallback(() => setCurrent((c) => (c - 1 + REVIEW_COUNT) % REVIEW_COUNT), []);
  const next = useCallback(() => setCurrent((c) => (c + 1) % REVIEW_COUNT), []);

  // Auto-play
  useEffect(() => {
    autoRef.current = setInterval(next, 3500);
    return () => clearInterval(autoRef.current);
  }, [next]);

  function resetAuto() {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 3500);
  }

  function handlePrev() { prev(); resetAuto(); }
  function handleNext() { next(); resetAuto(); }

  // Touch / mouse drag
  function onDragStart(e) {
    dragStart.current = e.touches ? e.touches[0].clientX : e.clientX;
    setDragging(true);
  }

  function onDragEnd(e) {
    if (!dragging) return;
    const end = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart.current - end;
    if (Math.abs(diff) > 40) { diff > 0 ? handleNext() : handlePrev(); }
    setDragging(false);
  }

  // Visible slides: prev, current, next
  const indices = [
    (current - 1 + REVIEW_COUNT) % REVIEW_COUNT,
    current,
    (current + 1) % REVIEW_COUNT,
  ];

  return (
    <section className="py-16 bg-[var(--color-bg-soft)]">
      <div className="container mx-auto max-w-[1100px] px-5">

        <h2
          ref={titleRef}
          className="scroll-reveal text-center text-[clamp(24px,4vw,34px)] font-bold text-[var(--color-primary-dark)] mb-9"
        >
          গতবছরে গ্রাহকদের অভিজ্ঞতা
        </h2>

        {/* Carousel */}
        <div className="relative select-none">

          {/* Slides */}
          <div
            className="flex items-center justify-center gap-4 overflow-hidden px-2 cursor-grab active:cursor-grabbing"
            style={{ minHeight: 280 }}
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
            onMouseLeave={() => setDragging(false)}
            onTouchStart={onDragStart}
            onTouchEnd={onDragEnd}
          >
            {indices.map((imgIdx, pos) => (
              <div
                key={pos}
                onClick={() => { if (pos === 0) handlePrev(); if (pos === 2) handleNext(); }}
                className="rounded-xl overflow-hidden shadow-md shrink-0 bg-white"
                style={{
                  width:      pos === 1 ? "min(300px, 62vw)" : "min(180px, 36vw)",
                  opacity:    pos === 1 ? 1 : 0.4,
                  transform:  pos === 1 ? "scale(1)" : "scale(0.85)",
                  transition: "opacity 0.4s ease, transform 0.4s ease, width 0.4s ease",
                  cursor:     pos !== 1 ? "pointer" : "grab",
                  outline:    "none",
                  outlineOffset: "2px",
                  boxShadow: pos === 1 ? "0 8px 32px rgba(46,125,50,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={REVIEWS[imgIdx].src}
                  alt={REVIEWS[imgIdx].alt}
                  draggable={false}
                  className="w-full block"
                  style={{ aspectRatio: "4/3", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            aria-label="আগের রিভিউ"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-colors z-10 -translate-x-1 text-lg font-bold"
          >‹</button>

          {/* Next button */}
          <button
            onClick={handleNext}
            aria-label="পরের রিভিউ"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-colors z-10 translate-x-1 text-lg font-bold"
          >›</button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5 mb-8">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); resetAuto(); }}
              aria-label={`রিভিউ ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === current ? 24 : 8,
                height:     8,
                background: i === current ? "var(--color-primary)" : "var(--color-border)",
              }}
            />
          ))}
        </div>

        <div className="flex justify-center my-4">
          <a href="#order" onClick={handleAnchorClick} className="btn-primary">অর্ডার করতে চাই</a>
        </div>

        <div ref={ctaRef} className="scroll-reveal flex justify-center gap-3.5 mt-7 flex-wrap">
          <a
            href={`tel:${SHOP_PHONE}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-white border border-[var(--color-border)] shadow-sm"
          >
            📞 Phone Number
          </a>
          <a
            href={`https://wa.me/${SHOP_WHATSAPP}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-[#25d366] text-white"
          >
            💬 WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}

export default CustomerReviews;
