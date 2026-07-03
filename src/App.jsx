import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase/config";
import HomePage from "./pages/HomePage";
import ThankYouPage from "./pages/ThankYouPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TrackOrderPage from "./pages/TrackOrderPage";
import NotFoundPage from "./pages/NotFoundPage";
import PageTransition from "./components/PageTransition";
import { BackToTop, StickyCTA } from "./components/FloatingUI";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setStatus(user ? "auth" : "unauth");
    });
    return unsub;
  }, []);

  if (status === "checking") return null;
  if (status === "unauth") return <Navigate to="/admin" replace />;
  return children;
}

function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            fontFamily: "Hind Siliguri, sans-serif",
            fontSize: "14px",
            fontWeight: "600",
          },
          success: {
            style: { background: "#2e7d32", color: "#fff" },
            iconTheme: { primary: "#fff", secondary: "#2e7d32" },
          },
          error: {
            style: { background: "#c62828", color: "#fff" },
            iconTheme: { primary: "#fff", secondary: "#c62828" },
          },
        }}
      />

      <BackToTop />
      <StickyCTA />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/thank-you" element={<PageTransition><ThankYouPage /></PageTransition>} />
          <Route path="/track-order" element={<PageTransition><TrackOrderPage /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition><AdminDashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
