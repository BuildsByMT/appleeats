import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Tag, 
  Check, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { validateUKPhone, formatUKPhone } from '../utils/ukLocalization';

export default function AuthScreen({ 
  initialMode = 'signin', 
  onBack, 
  onAuthSuccess 
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Form states
  const [signInData, setSignInData] = useState({
    identifier: 'owen@example.com',
    password: 'password123'
  });

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    referralCode: 'EATS50',
    agreeTerms: true
  });

  // Real-time password strength calculation
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-neutral-200' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score === 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-600' };
    if (score === 4) return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
    return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  };

  const pwdStrength = calculatePasswordStrength(signUpData.password);

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signInData.identifier.trim()) {
      setErrorMessage('Please enter your email or UK mobile number.');
      return;
    }
    if (!signInData.password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthSuccess({
        name: signInData.identifier.includes('@') 
          ? signInData.identifier.split('@')[0].replace('.', ' ')
          : "Owen Hume",
        email: signInData.identifier.includes('@') ? signInData.identifier : "owen@example.com",
        phone: !signInData.identifier.includes('@') ? signInData.identifier : "07951 280623"
      });
    }, 600);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signUpData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signUpData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (signUpData.phone && !validateUKPhone(signUpData.phone)) {
      setErrorMessage('Please enter a valid UK phone number (e.g. 07951 280623).');
      return;
    }
    if (signUpData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!signUpData.agreeTerms) {
      setErrorMessage('Please agree to the Terms of Service & Allergen Notice to register.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthSuccess({
        name: signUpData.fullName,
        email: signUpData.email,
        phone: signUpData.phone || "07951 280623",
        appliedPromo: signUpData.referralCode
      });
    }, 700);
  };

  const handleGuestContinue = () => {
    onAuthSuccess({
      name: "Guest Diner",
      email: "guest@appleeats.co.uk",
      phone: "07951 280623",
      isGuest: true
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900 animate-page-view">
      
      {/* Top Universal Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-40">
        <div className="max-w-[1720px] 2xl:max-w-[1840px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 hover:text-brand-800 transition-colors py-1.5 px-3 rounded-full hover:bg-neutral-100 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Takeaways</span>
            </button>
            <span className="text-neutral-300 hidden sm:inline">|</span>
            <span className="text-xs text-neutral-500 font-semibold hidden sm:inline">
              Stoke-on-Trent (ST1–ST12) Local Marketplace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src="/assets/branding/main-logo.png" 
              alt="Apple Eats" 
              className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
              onClick={onBack}
            />
          </div>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 max-w-[1560px] 2xl:max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-neutral-200/90 shadow-2xl overflow-hidden min-h-[640px]">
          
          {/* Left Visual Column: Stoke-on-Trent Brand Showcase (5 cols) */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-neutral-900 text-white overflow-hidden">
            {/* Background Photographic Feast with dark gradient */}
            <img 
              src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80" 
              alt="Apple Eats Feast in Stoke-on-Trent"
              className="absolute inset-0 w-full h-full object-cover opacity-45 transform hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-black/40" />

            {/* Top Brand Pill */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-rose-100 mb-6">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Stoke's #1 Local Takeaway App</span>
              </div>
              <h1 className="text-3xl xl:text-4xl font-black tracking-tight leading-tight text-white">
                Savor Stoke's Favorite Takeaways
              </h1>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed font-medium max-w-sm">
                Order directly from Go Grill, Fish Lounge, Crispy Chicken, and top independent eateries with zero platform commission.
              </p>
            </div>

            {/* Center Trust Proof & Verified Customer Review */}
            <div className="relative z-10 my-8 space-y-4">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-neutral-300 font-mono">ST4 (Stanley Rd)</span>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed italic">
                  "The fastest takeaway delivery in Stoke. The 50% discount code EATS50 applied instantly, and food arrived piping hot in 25 mins!"
                </p>
                <div className="text-[11px] font-black text-white flex items-center gap-1.5">
                  <span>Owen Hume</span>
                  <span className="text-emerald-400 font-bold">• Verified Stoke Diner</span>
                </div>
              </div>

              {/* Verified Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-black text-white text-[11px]">5/5 Hygiene</div>
                    <div className="text-[10px] text-neutral-400">FSA Verified</div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-black text-white text-[11px]">50% Off Voucher</div>
                    <div className="text-[10px] text-neutral-400">Code EATS50</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Coverage Notice */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span>Delivery across ST1 to ST12</span>
              <span>Fast £0.99 Flat Fee</span>
            </div>
          </div>

          {/* Right Column: High-Performance Production Auth Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 xl:p-12 flex flex-col justify-center">
            
            {/* Form Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black tracking-wider uppercase text-brand-700">
                  {mode === 'signin' ? 'Welcome Back' : 'Join Apple Eats'}
                </span>
                <span className="text-[11px] font-bold text-neutral-500">
                  Stoke-on-Trent Market
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {mode === 'signin' ? 'Sign in to your account' : 'Create your free account'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-1">
                {mode === 'signin' 
                  ? 'Access your saved favorite takeaways, addresses & exclusive discounts.'
                  : 'Get 50% off your first Stoke order and unlock free cheesecake rewards.'}
              </p>
            </div>

            {/* Mode Tab Switcher with sliding pill background */}
            <div className="flex p-1 bg-neutral-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'signin' 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  mode === 'signup' 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* One-Tap Social Logins & Fast Guest Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="py-2.5 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-2xs"
              >
                <User className="w-4 h-4 text-brand-700" />
                <span>Continue as Guest Diner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({
                    name: "Google Diner",
                    email: "diner@gmail.com",
                    provider: "google"
                  });
                }}
                className="py-2.5 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-extrabold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-2 items-center mb-5">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="flex-shrink mx-4 text-neutral-400 text-[11px] font-bold uppercase tracking-wider">
                or with email / phone
              </span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ================= MODE 1: SIGN IN FORM ================= */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="signin-identifier" className="block text-xs font-black text-neutral-800 mb-1.5">
                    Email Address or UK Mobile
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signin-identifier"
                      type="text"
                      required
                      placeholder="owen@example.com or 07951 280623"
                      value={signInData.identifier}
                      onChange={(e) => setSignInData({ ...signInData, identifier: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm text-neutral-900 outline-none focus:border-brand-700 focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="signin-password" className="block text-xs font-black text-neutral-800">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(!showForgotPassword)}
                      className="text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      className="w-full pl-10 pr-11 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm text-neutral-900 outline-none focus:border-brand-700 focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Accordion */}
                {showForgotPassword && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-2 animate-in fade-in">
                    <div className="font-extrabold text-amber-900">Password Recovery</div>
                    <p className="text-amber-800 font-medium">
                      Enter your email to receive a secure password reset link for Stoke takeaway ordering.
                    </p>
                    {resetSent ? (
                      <div className="text-emerald-700 font-black flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reset link sent to {signInData.identifier || 'your email'}!</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setResetSent(true)}
                        className="px-4 py-2 bg-brand-700 text-white rounded-xl font-bold active:scale-95 cursor-pointer"
                      >
                        Send Reset Link
                      </button>
                    )}
                  </div>
                )}

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700 cursor-pointer"
                    />
                    <span className="text-xs text-neutral-700 font-medium">
                      Remember me on this browser
                    </span>
                  </label>
                </div>

                {/* Primary Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-full font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <span>Sign In to Apple Eats</span>
                  )}
                </button>
              </form>
            )}

            {/* ================= MODE 2: SIGN UP FORM ================= */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="signup-name" className="block text-xs font-black text-neutral-800 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="signup-name"
                        type="text"
                        required
                        placeholder="Owen Hume"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-phone" className="block text-xs font-black text-neutral-800 mb-1">
                      UK Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="signup-phone"
                        type="tel"
                        placeholder="07951 280623"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all font-medium font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-xs font-black text-neutral-800 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="owen@example.com"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-xs font-black text-neutral-800 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 6 characters"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Real-Time Password Strength Meter */}
                  {signUpData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-neutral-500">Security:</span>
                        <span className={pwdStrength.score >= 3 ? 'text-emerald-700 font-extrabold' : 'text-neutral-700'}>
                          {pwdStrength.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        {[1, 2, 3, 4].map(level => (
                          <div 
                            key={level}
                            className={`h-full rounded-full transition-all duration-300 ${
                              pwdStrength.score >= level ? pwdStrength.color : 'bg-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Promo Referral Code Box with 50% discount prefill */}
                <div>
                  <label htmlFor="signup-promo" className="block text-xs font-black text-neutral-800 mb-1 flex items-center justify-between">
                    <span>Voucher Referral Code</span>
                    <span className="text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ 50% Off First Order
                    </span>
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-brand-700 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="signup-promo"
                      type="text"
                      value={signUpData.referralCode}
                      onChange={(e) => setSignUpData({ ...signUpData, referralCode: e.target.value.toUpperCase() })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 uppercase font-mono font-bold outline-none focus:border-brand-700 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Legal & Natasha's Law Allergen Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={signUpData.agreeTerms}
                    onChange={(e) => setSignUpData({ ...signUpData, agreeTerms: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-brand-700 focus:ring-brand-700 cursor-pointer shrink-0"
                  />
                  <span className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                    I agree to the <strong className="text-neutral-900">Terms of Service</strong>, <strong className="text-neutral-900">Privacy Policy</strong>, and acknowledge the <strong className="text-brand-900">Natasha's Law Allergen Guidance</strong> for food orders across Stoke-on-Trent.
                  </span>
                </label>

                {/* Primary Sign Up Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-full font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span>Create Account & Claim 50% Off</span>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Switcher Prompt */}
            <div className="text-center mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-600 font-medium">
              {mode === 'signin' ? (
                <span>
                  Don't have an Apple Eats account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMessage('');
                    }}
                    className="text-brand-700 font-black hover:underline cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </span>
              ) : (
                <span>
                  Already registered with Apple Eats?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                    }}
                    className="text-brand-700 font-black hover:underline cursor-pointer"
                  >
                    Sign In Here
                  </button>
                </span>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-400 font-semibold">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span>256-Bit SSL Encrypted • Direct Stoke Hotline: 01782 698710</span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-neutral-500 border-t border-neutral-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© 2026 Apple Eats Marketplace Ltd • Stoke-on-Trent, Staffordshire (ST1–ST12)</div>
          <div className="flex items-center gap-4 text-neutral-600 font-medium">
            <span>Natasha's Law Compliant</span>
            <span>•</span>
            <span>FSA 5-Star Rated</span>
            <span>•</span>
            <span>0% Merchant Commission</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
