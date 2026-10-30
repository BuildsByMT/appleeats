import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Gift, 
  FileText,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { formatGBP } from '../utils/currency';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  specialNote,
  onOpenNoteModal,
  financials = {}
}) {
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Escape key listener for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Mobile Touch Swipe-to-Dismiss handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    // If swiped right by more than 60px, close smoothly
    if (touchEndXRef.current - touchStartXRef.current > 60) {
      onClose();
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = financials.subtotal || 0;
  const freeGiftThreshold = 30.00;
  const progressToFreeGift = Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100));
  const remainingForFreeGift = Math.max(0, freeGiftThreshold - subtotal);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'
      }`} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop with fade in / fade out */}
      <div 
        className={`fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300 ease-out cursor-pointer ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Panel Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pointer-events-none">
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`w-screen max-w-md bg-white shadow-2xl border-l border-neutral-200 flex flex-col pointer-events-auto transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="cart-drawer-title" className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                    Your Basket
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-900 text-[10px] font-black uppercase">
                    Stoke
                  </span>
                </div>
                <span className="text-xs text-neutral-500 font-semibold">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-lg hover:bg-neutral-200/60 transition-colors hidden xs:inline-block cursor-pointer active:scale-95"
              >
                Keep Shopping
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/60 transition-colors cursor-pointer active:scale-90 min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close basket"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Swipe Handle Notice */}
          <div className="xs:hidden w-full flex justify-center pt-1.5 pb-0.5 bg-neutral-50/80">
            <div className="w-10 h-1 rounded-full bg-neutral-300" />
          </div>

          {/* Free Gift Unlock Bar (Subtotal >= £30) */}
          <div className="bg-brand-50/60 border-b border-brand-100/70 px-5 py-3">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-1.5">
              <span className="flex items-center gap-1.5 text-brand-900">
                <Gift className="w-4 h-4 text-brand-700 shrink-0" />
                <span>
                  {progressToFreeGift >= 100 
                    ? "🎉 Free Gift Strawberry Cheesecake Unlocked!" 
                    : `Add ${formatGBP(remainingForFreeGift)} more for Free Cheesecake!`}
                </span>
              </span>
              <span className="text-neutral-600 font-mono text-[11px] font-black">{progressToFreeGift}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-brand-700 to-brand-800 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressToFreeGift}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-neutral-800 mb-1">Your basket is empty</h3>
                <p className="text-xs text-neutral-500 mb-6 max-w-xs font-medium">
                  Explore fresh pizzas, gourmet burgers, and authentic dishes from top-rated Stoke takeaways.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-brand-700 text-white font-extrabold text-xs shadow-md hover:bg-brand-800 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Browse Stoke Takeaways</span>
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => {
                const itemTotal = (item.customizedPrice || item.price) * item.quantity;
                return (
                  <div 
                    key={`${item.id}-${index}`}
                    className="p-3.5 rounded-2xl border border-neutral-200/90 hover:border-neutral-300 transition-all bg-white shadow-card space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-xs sm:text-sm font-black text-neutral-900 leading-snug">
                          {item.name}
                        </h4>
                        <span className="text-xs font-black text-brand-700">
                          {formatGBP(itemTotal)}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-neutral-100 rounded-full p-1 border border-neutral-200/70">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.quantity <= 1) {
                              onRemoveItem(index);
                            } else {
                              onUpdateQuantity(index, item.quantity - 1);
                            }
                          }}
                          className="w-7 h-7 rounded-full bg-white hover:bg-neutral-200 flex items-center justify-center text-neutral-700 shadow-2xs transition-transform active:scale-90 cursor-pointer min-h-[28px] min-w-[28px]"
                          aria-label="Decrease quantity"
                        >
                          {item.quantity <= 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Minus className="w-3.5 h-3.5" />}
                        </button>
                        <span className="w-5 text-center text-xs font-black text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-neutral-200 flex items-center justify-center text-neutral-700 shadow-2xs transition-transform active:scale-90 cursor-pointer min-h-[28px] min-w-[28px]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Customization Details (Options snapshot) */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <div className="pt-1.5 border-t border-dashed border-neutral-100 flex flex-wrap gap-1">
                        {item.selectedOptions.map((opt, i) => (
                          <span 
                            key={i}
                            className="inline-block px-2 py-0.5 rounded-md bg-neutral-50 text-[10px] text-neutral-700 font-semibold border border-neutral-200/60"
                          >
                            + {opt.name} {opt.priceDelta > 0 ? `(${formatGBP(opt.priceDelta)})` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Special Preparation Instructions Note */}
            {cartItems.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-amber-950 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    Kitchen Preparation Note
                  </span>
                  <button
                    type="button"
                    onClick={onOpenNoteModal}
                    className="text-[11px] font-bold text-brand-700 hover:text-brand-900 hover:underline cursor-pointer active:scale-95"
                  >
                    {specialNote ? 'Edit Note' : '+ Add Note'}
                  </button>
                </div>
                <p className="text-amber-900 text-[11px] italic font-medium leading-relaxed">
                  {specialNote || "No allergy or special preparation instructions added yet."}
                </p>
              </div>
            )}
          </div>

          {/* Drawer Footer with Financial Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50/90 space-y-3 pb-safe">
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-600">
                <span>Subtotal</span>
                <span className="font-black text-neutral-900">{formatGBP(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Delivery (£0.99) & service calculated at checkout</span>
                <span className="font-bold text-neutral-700">GBP (£)</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3.5 px-3 rounded-2xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-xs transition-transform active:scale-95 cursor-pointer text-center"
                >
                  Add More Dishes
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCheckout();
                  }}
                  className="py-3.5 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
