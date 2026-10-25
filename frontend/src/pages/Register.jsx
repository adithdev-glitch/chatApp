import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import { User, Lock, Check } from "lucide-react";

const Register = () => {
  const { login, register } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password, navigate);
      } else {
        await register(name, email, password);
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen flex flex-col md:flex-row overflow-hidden bg-white select-none font-sans">
      {/* ================= LEFT SECTION (Full Page 50% Left: Blue Gradient with 3D Spheres) ================= */}
      <div className="w-full md:w-1/2 h-full bg-gradient-to-br from-[#0066ff] via-[#0052cc] to-[#0039a6] relative overflow-hidden p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center text-white flex-shrink-0">
        {/* Top-Right Curved Sweep */}
        <div
          className="absolute -top-20 -right-28 w-[450px] h-[450px] lg:w-[540px] lg:h-[540px] rounded-full bg-[#0066ff] opacity-90 pointer-events-none"
          style={{
            boxShadow: "0 30px 80px rgba(0, 40, 150, 0.45)",
          }}
        />

        {/* Bottom-Right Floating 3D Ball */}
        <div
          className="absolute bottom-8 right-[-30px] w-72 h-72 lg:w-96 lg:h-96 rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #38bdf8 0%, #0066ff 45%, #0033aa 75%, #001d66 100%)",
            boxShadow: "-16px 25px 60px rgba(0, 15, 60, 0.5)",
          }}
        />

        {/* Bottom-Left Floating 3D Ball */}
        <div
          className="absolute -bottom-24 -left-20 w-64 h-64 lg:w-80 lg:h-80 rounded-full pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #38bdf8 0%, #0066ff 45%, #0033aa 75%, #001d66 100%)",
            boxShadow: "-12px 20px 50px rgba(0, 15, 60, 0.5)",
          }}
        />

        {/* Content Over Spheres */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider leading-tight">
            WELCOME
          </h1>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-widest mt-2 uppercase text-white/95">
            HEYCHAT
          </h2>

          <p className="text-white/80 text-sm sm:text-base leading-relaxed mt-6 max-w-md">
            Connect with friends, colleagues, and communities in real-time.
            Experience seamless instant messaging with crystal clear clarity
            and unmatched speed.
          </p>
        </div>
      </div>

      {/* ================= RIGHT SECTION (Full Page 50% Right: Form) ================= */}
      <div className="w-full md:w-1/2 h-full bg-white p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center relative overflow-y-auto">
        {/* Peeking 3D Sphere in Bottom-Right Corner of Screen */}
        <div
          className="absolute -bottom-20 -right-20 w-52 h-52 lg:w-64 lg:h-64 rounded-full pointer-events-none hidden sm:block z-0"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #38bdf8 0%, #0066ff 50%, #0033aa 85%)",
            boxShadow: "-12px 18px 45px rgba(0, 40, 150, 0.35)",
          }}
        />

        <div className="relative z-10 w-full max-w-md mx-auto my-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1e293b] tracking-tight">
              {isLogin ? "Sign in" : "Sign up"}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-2">
              {isLogin
                ? "Welcome back to HeyChat! Enter your details to continue."
                : "Join HeyChat and start connecting today."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name (Sign Up only) */}
            {!isLogin && (
              <div className="bg-[#f1f3f6] rounded-xl px-4 py-3.5 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-[#0066ff]/20">
                <User className="w-5 h-5 text-[#334155] flex-shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none"
                />
              </div>
            )}

            {/* Email / Username Input */}
            <div className="bg-[#f1f3f6] rounded-xl px-4 py-3.5 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-[#0066ff]/20">
              <User className="w-5 h-5 text-[#334155] flex-shrink-0" />
              <input
                type="email"
                required
                placeholder="User Name or Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none"
              />
            </div>

            {/* Password Input with SHOW toggle */}
            <div className="bg-[#f1f3f6] rounded-xl px-4 py-3.5 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-[#0066ff]/20">
              <Lock className="w-5 h-5 text-[#334155] flex-shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1e293b] placeholder-[#94a3b8] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-bold text-[#003e7e] hover:text-[#0066ff] transition-colors uppercase tracking-wider flex-shrink-0 focus:outline-none"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs text-[#64748b] mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    rememberMe
                      ? "bg-[#003e7e] border-[#003e7e] text-white"
                      : "border-[#94a3b8] bg-white"
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => toast("Password reset email sent!", { icon: "ℹ️" })}
                className="text-[#0066ff] hover:underline font-medium focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-[#003e7e] hover:bg-[#002f60] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : isLogin
                ? "Sing in"
                : "Sign up"}
            </button>

            {/* Divider */}
            <div className="relative my-2 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]" />
              </div>
              <span className="relative bg-white px-3 text-xs text-[#94a3b8]">
                Or
              </span>
            </div>

            {/* Secondary Sign In with Other Button */}
            <button
              type="button"
              onClick={() =>
                toast("Alternative login options coming soon!", { icon: "✨" })
              }
              className="w-full py-3 border-2 border-[#1e293b] hover:bg-[#f8fafc] text-[#1e293b] font-semibold text-sm rounded-xl transition-all active:scale-[0.99]"
            >
              Sing in with other
            </button>
          </form>

          {/* Bottom Toggle */}
          <p className="text-xs sm:text-sm text-[#64748b] text-center mt-8">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#0066ff] hover:underline font-semibold focus:outline-none"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
