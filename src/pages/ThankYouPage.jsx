import { useLocation, Link, Navigate } from "react-router-dom";
import { SHOP_PHONE } from "../data/products";

function ThankYouPage() {
  const location = useLocation();
  const orderInfo = location.state;

  if (!orderInfo) {
    return <Navigate to="/" replace />;
  }

  const { orderId, name, phone, total } = orderInfo;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-soft)] p-6">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-12 max-w-[480px] w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white text-3xl flex items-center justify-center mx-auto mb-5">
          ✓
        </div>
        <h1 className="text-2xl text-[var(--color-primary-dark)] font-bold mb-2">
          ধন্যবাদ, {name}!
        </h1>
        <p className="text-[var(--color-text-light)] mb-7">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
        </p>

        <div className="bg-[var(--color-bg-soft)] rounded-xl p-4.5 mb-6 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">অর্ডার নম্বর</span>
            <strong>{orderId.slice(-8).toUpperCase()}</strong>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">ফোন নাম্বার</span>
            <strong>{phone}</strong>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">সর্বমোট</span>
            <strong>{total.toLocaleString("bn-BD")}.00৳</strong>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-light)]">পেমেন্ট পদ্ধতি</span>
            <strong>ক্যাশ অন ডেলিভারি</strong>
          </div>
        </div>

        <p className="text-sm mb-7">
          অর্ডার কনফার্ম করতে আমাদের একজন প্রতিনিধি শীঘ্রই আপনাকে{" "}
          <strong>{phone}</strong> নম্বরে কল করবেন। কোনো প্রশ্ন থাকলে সরাসরি
          কল করুন:{" "}
          <a href={`tel:${SHOP_PHONE}`} className="text-[var(--color-primary)] font-semibold">
            {SHOP_PHONE}
          </a>
        </p>

        <Link to="/" className="btn-primary w-full">
          হোমে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default ThankYouPage;
