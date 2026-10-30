import React from 'react';
import { Award, Check, Sparkles, Gift } from 'lucide-react';

export default function LoyaltyTracker({ completedOrders = 3, onClaimVoucher }) {
  const currentStamps = completedOrders % 5;
  const isRewardReady = completedOrders > 0 && currentStamps === 0;

  return (
    <div className="bg-gradient-to-r from-[#4A0716] via-[#6B0F24] to-[#7B1127] text-white rounded-3xl p-5 sm:p-6 shadow-card border border-brand-900 my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
              <span>Apple Eats Stoke Loyalty Stamps</span>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 uppercase">
                {currentStamps} of 5 Earned
              </span>
            </h3>
            <p className="text-xs text-rose-100 font-medium mt-0.5">
              Order 5 times from any Stoke takeaway to unlock your <strong className="text-amber-300 font-black">£6.99 reward voucher</strong>!
            </p>
          </div>
        </div>

        {isRewardReady && (
          <button
            type="button"
            onClick={() => onClaimVoucher && onClaimVoucher('LOYALTY5-CLAIM')}
            className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs shadow-md transition-transform active:scale-95 flex items-center gap-1.5 min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
            <span>Claim £6.99 Voucher</span>
          </button>
        )}
      </div>

      {/* 5-Stamp Tracker Circles / Pills */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-1">
        {[1, 2, 3, 4, 5].map((step) => {
          const isStamped = currentStamps >= step || isRewardReady;
          const isLastReward = step === 5;

          return (
            <div
              key={step}
              className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                isStamped
                  ? 'bg-white text-brand-950 border-white shadow-xs'
                  : 'bg-black/30 border-white/20 text-white/70'
              }`}
            >
              {isStamped ? (
                <div className="w-6 h-6 rounded-full bg-brand-700 text-white flex items-center justify-center mb-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : isLastReward ? (
                <Gift className="w-5 h-5 text-amber-300 mb-1 animate-bounce" />
              ) : (
                <span className="font-mono text-xs font-bold mb-1">#{step}</span>
              )}
              <span className={`text-[10px] font-black tracking-tight ${isStamped ? 'text-brand-950' : isLastReward ? 'text-amber-300' : 'text-rose-200'}`}>
                {isLastReward ? "£6.99 GIFT" : `Order ${step}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
