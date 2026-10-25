import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import ChathiveLogo from "../components/ChathiveLogo.jsx";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";

const Register = () => {
  const { login, register } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0e12] relative overflow-hidden px-4 select-none font-sans">
      {/* Background ambient glowing gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#38bdf8]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0284c7]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-[#131418] border border-[#21242d] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col items-center">
        {/* Brand Icon & Heading */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#191c24] border border-[#262b37] flex items-center justify-center mb-4 shadow-lg shadow-[#38bdf8]/10">
            <ChathiveLogo className="w-10 h-10" color="#38bdf8" strokeWidth={4} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            Chathive
          </h1>
          <p className="text-xs sm:text-sm text-[#777e8f] mt-1.5">
            {isLogin
              ? "Welcome back! Enter your details to continue."
              : "Create an account and start connecting today."}
          </p>
        </div>

        {/* Tab switch */}
        <div className="w-full bg-[#191b22] p-1 rounded-xl flex items-center mb-6 border border-[#222631]">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin
                ? "bg-[#252934] text-white shadow"
                : "text-[#6c7283] hover:text-gray-300"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin
                ? "bg-[#252934] text-white shadow"
                : "text-[#6c7283] hover:text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#878e9f]">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#5e6475] absolute left-3.5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#191b22] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#262a36] focus:outline-none focus:border-[#38bdf8] transition-colors placeholder-[#4e5464]"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#878e9f]">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#5e6475] absolute left-3.5" />
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#191b22] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#262a36] focus:outline-none focus:border-[#38bdf8] transition-colors placeholder-[#4e5464]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#878e9f]">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#5e6475] absolute left-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#191b22] text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#262a36] focus:outline-none focus:border-[#38bdf8] transition-colors placeholder-[#4e5464]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#0f1115] font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#38bdf8]/15 active:scale-[0.98] disabled:opacity-50"
          >
            <span>{isLogin ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Footer Toggle text */}
        <p className="text-xs text-[#6e7586] text-center mt-6">
          {isLogin ? "Don't have an account yet?" : "Already registered?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#38bdf8] hover:underline font-semibold ml-1 focus:outline-none"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
