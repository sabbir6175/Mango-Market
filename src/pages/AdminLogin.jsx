import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-soft)] p-6">
      <form
        className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-[380px] w-full"
        onSubmit={handleLogin}
      >
        <h1 className="text-[22px] text-[var(--color-primary-dark)] font-bold text-center mb-1">
          Admin Login
        </h1>
        <p className="text-center text-[var(--color-text-light)] text-sm mb-6">
          অর্ডার দেখতে লগইন করুন
        </p>

        <div className="flex flex-col gap-1.5 mb-4">
          <label htmlFor="email" className="font-semibold text-sm">
            ইমেইল
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-[var(--color-border)] rounded-md px-3.5 py-3 text-[15px] focus:outline-2 focus:outline-[var(--color-primary-light)] focus:outline-offset-1"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-4">
          <label htmlFor="password" className="font-semibold text-sm">
            পাসওয়ার্ড
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-[var(--color-border)] rounded-md px-3.5 py-3 text-[15px] focus:outline-2 focus:outline-[var(--color-primary-light)] focus:outline-offset-1"
          />
        </div>

        {error && <p className="text-[var(--color-danger)] text-[13px]">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
