import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { PRODUCTS as STATIC_PRODUCTS } from "../data/products";
import { DISTRICTS, getShippingCharge } from "../data/shipping";
import { validateCoupon } from "../data/coupons";
import { createOrder } from "../firebase/orders";
import { getProducts } from "../firebase/products";
import FadeIn from "./FadeIn";

function OrderForm() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [quantities, setQuantities] = useState(
    Object.fromEntries(STATIC_PRODUCTS.map((p) => [p.id, 0]))
  );

  useEffect(() => {
    getProducts()
      .then((p) => {
        if (p.length > 0) {
          setProducts(p);
          setQuantities(Object.fromEntries(p.map((x) => [x.id, 0])));
        }
      })
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({ name: "", district: "", address: "", phone: "", note: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ text: "", ok: false });
  const [couponApplied, setCouponApplied] = useState(null);

  const selectedItems = useMemo(
    () => products.map((p) => ({ ...p, qty: quantities[p.id] || 0 })).filter((p) => p.qty > 0),
    [products, quantities]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selectedItems]
  );

  const shippingCharge = useMemo(() => getShippingCharge(form.district), [form.district]);
  const total = subtotal + shippingCharge - couponDiscount;

  function applyCoupon() {
    if (!couponCode.trim()) return;
    const result = validateCoupon(couponCode, subtotal);
    if (result.valid) {
      setCouponDiscount(result.discount);
      setCouponApplied(result.coupon);
      setCouponMsg({ text: result.message, ok: true });
      toast.success(result.message);
    } else {
      setCouponDiscount(0);
      setCouponApplied(null);
      setCouponMsg({ text: result.message, ok: false });
    }
  }

  function removeCoupon() {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(null);
    setCouponMsg({ text: "", ok: false });
  }

  function updateQty(productId, delta) {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "নাম দিতে হবে";
    if (!form.district) errs.district = "জেলা সিলেক্ট করুন";
    if (!form.address.trim()) errs.address = "সম্পূর্ণ ঠিকানা দিতে হবে";
    if (!form.phone.trim()) errs.phone = "ফোন নাম্বার দিতে হবে";
    else if (!/^01[0-9]{9}$/.test(form.phone.trim()))
      errs.phone = "সঠিক ১১ ডিজিটের ফোন নাম্বার দিন (যেমন 017XXXXXXXX)";
    if (selectedItems.length === 0) errs.products = "অন্তত একটি প্যাকেজ সিলেক্ট করুন";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("সব তথ্য সঠিকভাবে পূরণ করুন।");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    const toastId = toast.loading("অর্ডার প্রসেস হচ্ছে...");
    try {
      const orderId = await createOrder({
        customerName: form.name.trim(),
        district: form.district,
        address: form.address.trim(),
        phone: form.phone.trim(),
        note: form.note.trim(),
        items: selectedItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        subtotal,
        shippingCharge,
        couponCode: couponApplied?.code || null,
        couponDiscount,
        total,
        paymentMethod: "cash_on_delivery",
      });
      toast.success("অর্ডার সফলভাবে হয়েছে! 🎉", { id: toastId });
      navigate("/thank-you", {
        state: { orderId, name: form.name.trim(), phone: form.phone.trim(), total },
      });
    } catch (err) {
      console.error(err);
      toast.error("অর্ডার সাবমিট করতে সমস্যা হয়েছে।", { id: toastId });
      setSubmitError("অর্ডার সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 bg-[var(--color-bg-soft)]" id="order">
      <div className="container mx-auto max-w-[900px] px-5">

        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-block bg-[var(--color-primary)] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
              🛒 অর্ডার করুন
            </span>
            <h2 className="text-[clamp(24px,4vw,34px)] font-bold text-[var(--color-primary-dark)]">
              প্যাকেজ বেছে নিন ও অর্ডার করুন
            </h2>
            <p className="text-[var(--color-text-light)] mt-2 text-sm">
              সরাসরি বাগান থেকে আপনার দরজায়
            </p>
          </div>
        </FadeIn>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">

            <div className="flex flex-col gap-6">

              {/* Product selection */}
              <FadeIn delay={0.1}>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold">১</span>
                    <h3 className="font-bold text-[var(--color-primary-dark)] text-[17px]">প্যাকেজ সিলেক্ট করুন</h3>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {products.map((p) => {
                      const qty = quantities[p.id] || 0;
                      const selected = qty > 0;
                      return (
                        <div key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                          selected ? "border-[var(--color-primary)] bg-[#f0f7f0]" : "border-[var(--color-border)] bg-[var(--color-bg-soft)]"
                        }`}>
                          <div className="relative shrink-0">
                            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-white" />
                            {selected && (
                              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[var(--color-primary)] text-white text-[10px] rounded-full flex items-center justify-center font-bold">✓</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[15px] text-[var(--color-text)] leading-snug">{p.name}</p>
                            <p className="text-[var(--color-primary)] font-bold text-base mt-0.5">{Number(p.price).toLocaleString("bn-BD")}.00৳</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => updateQty(p.id, -1)}
                              className={`w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center transition-colors ${
                                qty > 0 ? "bg-[var(--color-primary)] text-white shadow-sm" : "bg-white border border-[var(--color-border)] text-[var(--color-text-light)]"
                              }`}>−</button>
                            <span className="w-7 text-center font-bold text-[16px]">{qty}</span>
                            <button type="button" onClick={() => updateQty(p.id, 1)}
                              className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center shadow-sm">+</button>
                          </div>
                        </div>
                      );
                    })}
                    {errors.products && <p className="text-[var(--color-danger)] text-[13px]">⚠️ {errors.products}</p>}
                  </div>
                </div>
              </FadeIn>

              {/* Billing form */}
              <FadeIn delay={0.15}>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold">২</span>
                    <h3 className="font-bold text-[var(--color-primary-dark)] text-[17px]">আপনার তথ্য দিন</h3>
                  </div>
                  <div className="p-6 flex flex-col gap-4">

                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-sm text-[var(--color-text)]">আপনার নাম <span className="text-[var(--color-danger)]">*</span></label>
                      <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="পূর্ণ নাম লিখুন"
                        className={`border rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] ${errors.name ? "border-[var(--color-danger)] bg-red-50" : "border-[var(--color-border)]"}`} />
                      {errors.name && <p className="text-[var(--color-danger)] text-[13px]">⚠️ {errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-sm text-[var(--color-text)]">ফোন নাম্বার <span className="text-[var(--color-danger)]">*</span></label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="017XXXXXXXX"
                        className={`border rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] ${errors.phone ? "border-[var(--color-danger)] bg-red-50" : "border-[var(--color-border)]"}`} />
                      {errors.phone && <p className="text-[var(--color-danger)] text-[13px]">⚠️ {errors.phone}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-sm text-[var(--color-text)]">জেলা <span className="text-[var(--color-danger)]">*</span></label>
                      <select name="district" value={form.district} onChange={handleChange}
                        className={`border rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] bg-white ${errors.district ? "border-[var(--color-danger)] bg-red-50" : "border-[var(--color-border)]"}`}>
                        <option value="">-- জেলা সিলেক্ট করুন --</option>
                        {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {errors.district && <p className="text-[var(--color-danger)] text-[13px]">⚠️ {errors.district}</p>}
                      {form.district && (
                        <p className="text-[12px] text-[var(--color-primary)] font-semibold">
                          🚚 {form.district}-এ ডেলিভারি চার্জ: {shippingCharge}৳
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-sm text-[var(--color-text)]">সম্পূর্ণ ঠিকানা <span className="text-[var(--color-danger)]">*</span></label>
                      <textarea name="address" rows={3} value={form.address} onChange={handleChange} placeholder="বাড়ি নম্বর, রাস্তা, থানা..."
                        className={`border rounded-xl px-4 py-3 text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] ${errors.address ? "border-[var(--color-danger)] bg-red-50" : "border-[var(--color-border)]"}`} />
                      {errors.address && <p className="text-[var(--color-danger)] text-[13px]">⚠️ {errors.address}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-sm text-[var(--color-text)]">বিশেষ নোট <span className="text-[var(--color-text-light)] font-normal">(ঐচ্ছিক)</span></label>
                      <textarea name="note" rows={2} value={form.note} onChange={handleChange} placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."
                        className="border border-[var(--color-border)] rounded-xl px-4 py-3 text-[15px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]" />
                    </div>

                    {/* Coupon */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-semibold text-sm text-[var(--color-text)]">কুপন কোড</label>
                      {couponApplied ? (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                          <p className="text-sm font-bold text-green-700">🎟️ {couponApplied.code} — {couponApplied.label}</p>
                          <button type="button" onClick={removeCoupon} className="text-red-500 text-xs font-bold hover:underline">বাতিল</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="MANGO100"
                            className="flex-1 border border-[var(--color-border)] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] uppercase"
                          />
                          <button type="button" onClick={applyCoupon}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm shrink-0">
                            প্রয়োগ
                          </button>
                        </div>
                      )}
                      {couponMsg.text && (
                        <p className={`text-[12px] font-semibold ${couponMsg.ok ? "text-green-600" : "text-[var(--color-danger)]"}`}>
                          {couponMsg.text}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right column — Order Summary */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold">৩</span>
                  <h3 className="font-bold text-[var(--color-primary-dark)] text-[17px]">অর্ডার সামারি</h3>
                </div>
                <div className="p-5">
                  {selectedItems.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-4xl mb-2">🥭</p>
                      <p className="text-[var(--color-text-light)] text-sm">কোনো প্যাকেজ সিলেক্ট করা হয়নি</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 mb-4">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-2 text-sm">
                          <span className="text-[var(--color-text)] leading-snug flex-1">
                            {item.name}<span className="text-[var(--color-text-light)]"> × {item.qty}</span>
                          </span>
                          <span className="font-bold text-[var(--color-primary-dark)] shrink-0">
                            {(item.price * item.qty).toLocaleString("bn-BD")}৳
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-[var(--color-border)] pt-3 flex flex-col gap-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-light)]">সাবটোটাল</span>
                      <span className="font-semibold">{subtotal.toLocaleString("bn-BD")}.00৳</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-light)]">ডেলিভারি চার্জ</span>
                      <span className={`font-semibold ${shippingCharge === 0 ? "text-[var(--color-primary)]" : "text-gray-700"}`}>
                        {form.district ? `${shippingCharge}৳` : "জেলা সিলেক্ট করুন"}
                      </span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">🎟️ কুপন ডিসকাউন্ট</span>
                        <span className="font-semibold text-green-600">-{couponDiscount}৳</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold border-t border-[var(--color-border)] pt-2.5 mt-1">
                      <span>সর্বমোট</span>
                      <span className="text-[var(--color-primary-dark)] text-lg">{total.toLocaleString("bn-BD")}.00৳</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-[#fff8e1] border border-[#ffe082] rounded-xl px-4 py-3 mb-4">
                    <span className="text-2xl">💵</span>
                    <div>
                      <p className="font-bold text-[#7a5c00] text-sm">ক্যাশ অন ডেলিভারি</p>
                      <p className="text-[11px] text-[#a07800]">পণ্য হাতে পেয়ে পেমেন্ট করুন</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-[var(--color-text-light)] mb-4 text-center leading-relaxed">
                    অর্ডার করার মাধ্যমে আপনি আমাদের প্রাইভেসি পলিসিতে সম্মতি দিচ্ছেন।
                  </p>

                  {submitError && (
                    <p className="text-[var(--color-danger)] text-[13px] text-center mb-3 bg-red-50 px-3 py-2 rounded-lg">
                      ⚠️ {submitError}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    className="btn-primary w-full text-base"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        অর্ডার হচ্ছে...
                      </span>
                    ) : total > 0 ? (
                      `✅ অর্ডার কনফার্ম করুন — ${total.toLocaleString("bn-BD")}.00৳`
                    ) : (
                      "অর্ডার কনফার্ম করুন"
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </section>
  );
}

export default OrderForm;
