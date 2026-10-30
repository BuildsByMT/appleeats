import React, { useState } from 'react';
import { X, Eye, EyeOff, Gift } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const modalRef = useFocusTrap(true, onClose);

  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    referralCode: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthSuccess({
      name: formData.fullName || "Owen Hume",
      email: formData.email || "owen@example.com"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-modal border border-neutral-100 grid grid-cols-1 md:grid-cols-2"
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-500 hover:text-neutral-900 transition-colors shadow-2xs min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Photography Banner (Screenshot 3) */}
        <div className="relative hidden md:block bg-neutral-900">
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" 
            alt="Apple Eats Fresh Takeaway Meals"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
          <div className="absolute top-8 left-8">
            <img 
              src="/assets/branding/main-logo.png" 
              alt="Apple Eats" 
              className="h-8 w-auto object-contain bg-white/90 p-1.5 rounded-xl shadow-xs" 
            />
            <p className="text-xs text-rose-100 font-medium mt-2">
              Stoke-on-Trent's Premier Takeaways
            </p>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-sm font-bold leading-snug">
              "Enjoy exclusive 50% discount vouchers and fast delivery from Go Grill and Fish Lounge."
            </p>
          </div>
        </div>

        {/* Right Side: Clean Auth Card (Screenshot 3) */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <img 
                src="/assets/branding/main-logo.png" 
                alt="Apple Eats" 
                className="h-8 sm:h-9 w-auto object-contain" 
              />
            </div>
            <h2 id="auth-modal-title" className="text-2xl font-black text-neutral-900 tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              {isSignUp ? "Sign up to explore the best local eateries in Stoke." : "Sign in to access your saved orders & favorites."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label htmlFor="auth-fullname" className="block text-xs font-bold text-neutral-800 mb-1">
                  Full Name
                </label>
                <input
                  id="auth-fullname"
                  type="text"
                  required
                  placeholder="Enter your full name (e.g. Owen Hume)"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-bold text-neutral-800 mb-1">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-bold text-neutral-800 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="auth-referral" className="block text-xs font-bold text-neutral-800 mb-1">
                  Referral Voucher Code (Optional)
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-brand-700 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-referral"
                    type="text"
                    placeholder="Enter code (e.g. EATS50)"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700 focus:bg-white transition-all uppercase font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-full font-bold text-xs shadow-md transition-transform active:scale-95 mt-2 min-h-[44px] cursor-pointer"
            >
              {isSignUp ? "Sign Up to Order" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                onAuthSuccess({
                  name: "Guest Diner",
                  email: "guest@appleeats.co.uk",
                  isGuest: true
                });
                onClose();
              }}
              className="w-full py-2.5 rounded-full border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-transform active:scale-95 cursor-pointer min-h-[44px]"
            >
              Continue as Guest
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="text-center mt-5 text-xs text-neutral-600 font-medium">
            {isSignUp ? "Already have an account? " : "Don't have an account yet? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-brand-700 font-bold hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
