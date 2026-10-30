import React, { useState } from 'react';
import { Tag, Sparkles, Percent, Gift, Check, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { dealsList } from '../data/mockData';
import { formatGBP } from '../utils/currency';

export default function DealsHub({ onSelectRestaurant, restaurants = [] }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filters = [
    { id: 'all', label: 'All Offers' },
    { id: 'first_order', label: 'New Customer (50% Off)' },
    { id: 'free_gift', label: 'Free Cheesecake' },
    { id: 'percentage', label: 'Percentage Discounts' }
  ];

  const filteredDeals = dealsList.filter(d => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'first_order') return d.isFirstOrderOnly;
    if (selectedFilter === 'free_gift') return d.type === 'free_gift';
    if (selectedFilter === 'percentage') return d.type === 'percentage';
    return true;
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 animate-page-view">
      
      {/* Deals Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-brand-700 text-white p-6 sm:p-10 mb-8 shadow-card">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-rose-100 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Stoke-on-Trent Promotional Vouchers</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
            Verified Deals & Exclusive Discounts
          </h1>
          <p className="text-sm sm:text-base text-rose-100 leading-relaxed font-medium mb-6">
            Save up to 50% on Go Grill, Fish Lounge, and popular Stoke takeaways. Applied automatically at checkout!
          </p>

          {/* Quick First-Order Voucher Callout */}
          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-amber-300 uppercase tracking-wide">First Order Exclusive</div>
              <div className="text-sm font-bold text-white">50% Off up to £15 with voucher EATS50</div>
            </div>

            <button
              type="button"
              onClick={() => copyCode('EATS50')}
              className="px-4 py-2 bg-white text-brand-900 font-black text-xs rounded-full shadow-xs hover:bg-neutral-100 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              {copiedCode === 'EATS50' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-black" aria-live="polite">Copied EATS50!</span>
                </>
              ) : (
                <>
                  <Tag className="w-3.5 h-3.5 text-brand-700" />
                  <span>Copy Code EATS50</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {filters.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSelectedFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border min-h-[44px] active:scale-95 cursor-pointer ${
              selectedFilter === f.id
                ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredDeals.map((deal) => {
          const matchedRestaurant = restaurants.find(r => r.id === deal.restaurantId) || restaurants[0];

          return (
            <div 
              key={deal.id}
              className="bg-white rounded-3xl border border-neutral-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                
                {/* Header: Badge & Expiration */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 text-[11px] font-extrabold border border-brand-200">
                    <Percent className="w-3 h-3 text-brand-700" />
                    <span>{deal.badgeText}</span>
                  </div>

                  <div className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>{deal.expiresIn}</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-neutral-900 tracking-tight mb-1">
                  {deal.title}
                </h3>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-4">
                  {deal.description}
                </p>

                {/* Terms / Minimum Spend */}
                <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 space-y-1 mb-4">
                  <div className="flex justify-between font-bold text-neutral-800">
                    <span>Minimum Spend:</span>
                    <span>{deal.minSpend > 0 ? `£${deal.minSpend.toFixed(2)}` : 'No minimum'}</span>
                  </div>
                  {deal.maxDiscount && (
                    <div className="flex justify-between font-medium">
                      <span>Maximum Discount:</span>
                      <span>£{deal.maxDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {deal.applicableTo && (
                    <div className="flex justify-between text-[11px] text-neutral-500">
                      <span>Valid at:</span>
                      <span className="font-semibold">{deal.applicableTo}</span>
                    </div>
                  )}
                </div>

                {/* Dashed Code Box */}
                <button
                  type="button"
                  onClick={() => copyCode(deal.code)}
                  className="w-full p-2.5 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 hover:bg-brand-100 text-center text-xs font-mono font-black text-brand-950 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] active:scale-95"
                  title="Click to copy voucher code"
                  aria-label={`Copy voucher code ${deal.code}`}
                >
                  <Tag className="w-3.5 h-3.5 text-brand-700" />
                  <span>CODE: {deal.code}</span>
                  {copiedCode === deal.code ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  ) : (
                    <span className="text-[10px] text-brand-700 font-sans font-bold ml-1">(Click to Copy)</span>
                  )}
                </button>
              </div>

              {/* Order Now CTA */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectRestaurant) {
                      onSelectRestaurant(matchedRestaurant);
                    }
                  }}
                  className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-full font-black text-xs shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                  aria-label={`Order now from ${matchedRestaurant?.name || 'Takeaway'} using deal`}
                >
                  <span>Order Now at {matchedRestaurant?.name || 'Takeaways'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
