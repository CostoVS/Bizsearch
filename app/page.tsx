"use client";

import { useState } from "react";
import { LogIn, EyeOff, Eye, Search, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // For the display purpose, we'll mimic the invalid states shown in screenshots
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("nicholauscostochetty@gmail.com");
  const [password, setPassword] = useState("adminpassword24");
  const [username, setUsername] = useState("unknown");
  const [tier, setTier] = useState<"free" | "premium">("premium");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, username: email, password: password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setHasError(true);
        setErrorMessage(data.message || "Invalid credentials.");
      } else {
        window.location.href = data.require2FA ? "/verify-2fa?userId=" + data.userId : "/dashboard";
      }
    } catch (err) {
      setHasError(true);
      setErrorMessage("Network error.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#faf9f6] py-12 px-4 sm:px-6">
      
      {/* Top Navigation Wrapper if needed, keeping simple like screenshot */}
      <div className="w-full max-w-md mx-auto mb-6">
        {/* Placeholder for potential header from screenshot */}
      </div>

      <motion.div 
        layout
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 p-8 pt-10 relative overflow-hidden"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-6">
            <LogIn strokeWidth={2.5} size={28} className={isLogin ? "translate-x-0.5" : ""} />
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-3 text-center">
            {isLogin ? "Log In to Bizsearch24" : "Create Your Account"}
          </h2>
          
          <p className="text-slate-500 text-center text-[15px] leading-relaxed max-w-[320px]">
            {isLogin 
              ? "Access your dashboard, manage your listings, and view your traffic analytics."
              : "Sign up to submit business listings, manage your profile, and receive analytics."}
          </p>
        </div>

        <AnimatePresence mode="popLayout">
          {hasError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50/80 border border-red-100 text-red-600 px-4 py-3.5 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle size={18} />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Main Identifier Input */}
          <div className="space-y-2">
            <label className="block text-[15px] font-bold text-slate-700">
              {isLogin ? "Email Address or Username" : "Email Address"}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setHasError(false);
              }}
              className="w-full bg-[#f0f4f8] text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-[15px]"
            />
          </div>

          {/* Registration specific fields */}
          {!isLogin && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 relative"
            >
              <div className="flex justify-between items-baseline">
                <label className="block text-[15px] font-bold text-slate-700">
                  Choose Username (Optional)
                </label>
                <span className="text-xs text-slate-400 font-medium">Default is email username</span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 transition-all font-medium text-[15px]"
              />
            </motion.div>
          )}

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="block text-[15px] font-bold text-slate-700">Password</label>
              {isLogin && (
                <a href="#" className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHasError(false);
                }}
                className="w-full border border-slate-200 text-slate-900 px-4 py-3.5 rounded-xl focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 transition-all font-medium text-[15px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Membership Tier for Registration */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2 pb-2"
            >
              <label className="block text-[15px] font-bold text-slate-700 mb-3">
                Choose Your Membership Tier
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTier("free")}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    tier === "free" 
                      ? "border-slate-200 bg-slate-50" 
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="font-bold text-slate-700 text-[15px] mb-1">Free Tier</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    Standard directory listing and search index entry
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setTier("premium")}
                  className={`text-left p-4 rounded-2xl border-2 transition-all relative overflow-hidden ${
                    tier === "premium" 
                      ? "border-[#008f60] bg-teal-50/30" 
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-slate-900 text-[15px] leading-tight">Premium<br/>Verified</div>
                    <Sparkles size={18} className="text-[#008f60]" />
                  </div>
                  <div className="text-xs text-[#008f60] font-medium leading-relaxed">
                    Get verified badge and unlock top rankings & images
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#008f60] hover:bg-[#007a52] text-white font-bold text-lg py-4 rounded-2xl transition-colors active:scale-[0.98]"
            >
              {isLogin ? "Sign In" : "Register Account"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center bg-white">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setHasError(false);
            }}
            className="text-[#008f60] font-bold text-[15px] hover:text-[#007a52] transition-colors"
          >
            {isLogin ? "Need an account? Register Now" : "Already have an account? Log In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
