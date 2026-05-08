import { useState } from "react";
import { InputField } from "../components/InputField";
import { EyeIcon, HouseIcon, LockIcon, MailIcon, TagIcon, UserIcon } from "../icons/authIcons";
import { loginUser ,registerUser } from "../services/authServices";

// ── Decorative blobs ────────────────────────────────────────────────────────

function BlobAccent({ className }) {
  return (
    <div
      className={`absolute rounded-full opacity-40 blur-3xl pointer-events-none ${className}`}
    />
  );
}
 
// ── Auth Page ────────────────────────────────────────────────────────────────

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [animating, setAnimating] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState("");

  function toggle() {
    setAnimating(true);
    setTimeout(() => {
      setIsLogin((v) => !v);
      setShowPassword(false);
      setAnimating(false);
    }, 180);
  }
  async function handleSubmit() {

    if (isLogin) {
      await loginUser({email, password});
      console.log("Logging in with", { email, password });
    } else {
      await registerUser({name,email,password})
      console.log("regitering user")
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ backgroundColor: "#EEF2FF" }}
    >
      {/* Decorative background blobs */}
      <BlobAccent className="w-72 h-72 bg-[#3660F9] -top-20 -left-20" />
      <BlobAccent className="w-56 h-56 bg-[#D1FD57] -bottom-12 -right-10" />
      <BlobAccent className="w-40 h-40 bg-[#3660F9] bottom-1/3 -right-10 opacity-20" />
      <BlobAccent className="w-32 h-32 bg-[#D1FD57] top-1/3 -left-10 opacity-20" />

      {/* Card */}
      <div
        className={`
          relative w-full max-w-md bg-white rounded-3xl shadow-2xl
          transition-all duration-300
          ${animating ? "opacity-0 translate-y-2 scale-[0.99]" : "opacity-100 translate-y-0 scale-100"}
        `}
        style={{ boxShadow: "0 25px 60px rgba(54, 96, 249, 0.12), 0 8px 24px rgba(0,0,0,0.08)" }}
      >
        {/* Top accent stripe */}
        <div
          className="h-1.5 w-full rounded-t-3xl"
          style={{
            background: isLogin
              ? "linear-gradient(90deg, #3660F9, #6f8fff)"
              : "linear-gradient(90deg, #D1FD57, #a8d900)",
          }}
        />

        <div className="px-7 pt-8 pb-9 sm:px-9">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: "#3660F9" }}
            >
              <HouseIcon />
            </div>
            <span className="text-xl font-bold text-[#17161A] tracking-tight">
              Home<span style={{ color: "#3660F9" }}>Flow</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17161A] leading-tight mb-1.5">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {isLogin
                ? "Track your household, together"
                : "Join HomeFlow and take control of your home finances"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {!isLogin && (
              <InputField
                icon={UserIcon}
                label="Full Name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <InputField
              icon={MailIcon}
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              icon={LockIcon}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightSlot={
                <span onClick={() => setShowPassword((v) => !v)}>
                  <EyeIcon open={showPassword} />
                </span>
              }
            />

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1">
                    Invite Code
                  </label>
                  <span className="text-[10px] text-[#3660F9] font-medium bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <TagIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. HF-XXXX-XXXX"
                    value={invite}
                    onChange={(e) => setInvite(e.target.value)}
                    className="
                      w-full bg-white border border-dashed border-gray-300 rounded-xl
                      pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400
                      outline-none transition-all duration-200
                      focus:border-[#D1FD57] focus:ring-2 focus:ring-[#D1FD57]/30
                      hover:border-gray-400
                    "
                  />
                </div>
                <p className="text-[11px] text-gray-400 pl-1 mt-0.5 flex items-center gap-1">
                  <span>🏠</span>
                  Have an invite code? Join an existing household
                </p>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end -mt-1">
                <button className="text-xs text-[#3660F9] font-semibold hover:underline transition-all">
                  Forgot password?
                </button>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            className={`
              w-full mt-7 py-3.5 rounded-full font-bold text-sm tracking-wide
              transition-all duration-200 active:scale-[0.98]
              flex items-center justify-center gap-2 group
              ${isLogin
                ? "bg-[#3660F9] text-white hover:bg-[#2a50e0] shadow-lg shadow-[#3660F9]/30"
                : "bg-[#D1FD57] text-[#17161A] hover:bg-[#bfee3a] shadow-lg shadow-[#D1FD57]/40"
              }
            `} 
            onClick={handleSubmit}
          >
            {isLogin ? "Login" : "Get Started"}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>

          {/* Divider and google signup
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            className="
              w-full py-3 rounded-full border border-gray-200 bg-white
              text-sm font-semibold text-gray-700 flex items-center justify-center gap-2.5
              hover:border-gray-300 hover:bg-gray-50 transition-all duration-200
            "
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button> */}

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500 mt-7">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={toggle}
              className="font-semibold text-[#3660F9] hover:underline transition-all"
            >
              {isLogin ? "Create an account" : "Login"} →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}