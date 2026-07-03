// Coupon গুলো এখানে define করা — পরে Firebase থেকে আনা যাবে
export const COUPONS = [
  { code: "MANGO100", type: "fixed",      value: 100, minOrder: 500,  label: "১০০৳ ছাড়" },
  { code: "SAVE10",   type: "percentage", value: 10,  minOrder: 1000, label: "১০% ছাড়" },
  { code: "FRESH50",  type: "fixed",      value: 50,  minOrder: 0,    label: "৫০৳ ছাড়" },
];

export function validateCoupon(code, subtotal) {
  const coupon = COUPONS.find((c) => c.code === code.trim().toUpperCase());
  if (!coupon) return { valid: false, message: "কুপন কোডটি সঠিক নয়।" };
  if (subtotal < coupon.minOrder)
    return { valid: false, message: `এই কুপনের জন্য সর্বনিম্ন অর্ডার ${coupon.minOrder}৳ হতে হবে।` };

  const discount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  return { valid: true, coupon, discount, message: `${coupon.label} প্রযোজ্য হয়েছে! 🎉` };
}
