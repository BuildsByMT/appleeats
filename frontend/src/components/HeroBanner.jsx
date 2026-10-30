import React, { useState } from 'react';
import { Sparkles, Clock, Copy, Check, ArrowRight, Tag } from 'lucide-react';

export default function HeroBanner({ onSelectDeal, onExploreAll }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A0716] via-[#6B0F24] to-[#7B1127] text-white shadow-card my-4 sm:my-6 transition-all animate-page-view">
      
      {/* Appetizing Food Visual (Grilled Gourmet Burger & Feast) with smooth fade */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-7/12 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80" 
          alt="Apple Eats Feast in Stoke-on-Trent"
          className="w-full h-full object-cover object-center opacity-40 sm:opacity-55"
        />
        {/* Smooth gradient mask so the left side remains deep rich maroon for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A0716] via-[#6B0F24]/90 to-transparent sm:via-[#6B0F24]/75" />
      </div>

      <div className="relative z-10 px-5 sm:px-10 py-8 sm:py-12 lg:py-14 max-w-2xl">
        
        {/* Stoke-on-Trent Geographic Exclusive Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] sm:text-xs font-bold text-rose-100 mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Exclusive in Stoke-on-Trent</span>
          <span className="text-white/40">•</span>
          <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Ends 11:00 PM Tonight</span>
        </div>

        {/* Hero Title & Subtitle */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2 sm:mb-3">
          Feast on Favorites, Save Big!
        </h1>
        <p className="text-sm xs:text-base sm:text-lg text-rose-100 font-semibold mb-5 sm:mb-6 leading-relaxed">
          Up to 30% Off on selected takeaways • Use code:{' '}
          <button
            type="button"
            onClick={() => copyCoupon('TREATS')}
            className="font-black text-amber-300 underline underline-offset-4 hover:text-white transition-colors cursor-pointer"
            title="Click to copy TREATS coupon"
          >
            TREATS
          </button>
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
          <button 
            type="button"
            onClick={() => onSelectDeal('TREATS')}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-brand-900 hover:bg-neutral-100 rounded-full font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span>Claim Offer</span>
            <ArrowRight className="w-4 h-4 text-brand-900" />
          </button>
          
          <button 
            type="button"
            onClick={onExploreAll}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-transparent hover:bg-white/10 border-2 border-white/80 rounded-full font-extrabold text-xs sm:text-sm transition-colors text-white cursor-pointer min-h-[44px] active:scale-95"
          >
            View All Deals
          </button>

          {/* Quick Copy Coupon Pill */}
          <button
            type="button"
            onClick={() => copyCoupon('TREATS')}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-black/35 hover:bg-black/50 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px] active:scale-95"
            title="Click to copy TREATS code"
            aria-label="Copy voucher code TREATS"
          >
            {copiedCode === 'TREATS' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                <span className="text-emerald-300 font-extrabold" aria-live="polite">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white/80" />
                <span>Copy: TREATS</span>
              </>
            )}
          </button>
        </div>

        {/* First-Order 50% Off Highlight (Interactive Copy) */}
        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/20 flex flex-wrap items-center gap-2 text-xs text-rose-200">
          <button
            type="button"
            onClick={() => copyCoupon('EATS50')}
            className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black uppercase text-[10px] tracking-wide transition-transform active:scale-90 cursor-pointer flex items-center gap-1"
            title="Click to copy EATS50 code"
            aria-label="Copy voucher code EATS50"
          >
            <Tag className="w-3 h-3 text-neutral-950" />
            <span>50% OFF</span>
          </button>
          <span className="font-medium">
            New customer in Stoke? Use code{' '}
            <button
              type="button"
              onClick={() => copyCoupon('EATS50')}
              className="text-white font-black underline decoration-amber-300 hover:text-amber-200 transition-colors cursor-pointer inline-flex items-center gap-0.5"
              title="Click to copy EATS50"
            >
              <span>EATS50</span>
              {copiedCode === 'EATS50' ? (
                <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3] inline" />
              ) : (
                <Copy className="w-3 h-3 text-rose-200 inline" />
              )}
            </button>
            {' '}on your first order!
          </span>
        </div>

      </div>
    </div>
  );
}
