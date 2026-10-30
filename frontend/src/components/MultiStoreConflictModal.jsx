import React from 'react';
import { AlertCircle, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function MultiStoreConflictModal({
  currentRestaurantName = 'Go Grill',
  newRestaurantName = 'Fish Lounge',
  onConfirmClear,
  onCancel
}) {
  const modalRef = useFocusTrap(true, onCancel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onCancel} />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="conflict-modal-title"
        className="relative z-10 bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-modal border border-neutral-100 p-6 sm:p-7 animate-spring-modal text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 mx-auto mb-4 flex items-center justify-center border border-amber-200">
          <AlertCircle className="w-7 h-7 stroke-[2.5]" />
        </div>

        <h2 id="conflict-modal-title" className="text-xl font-black text-neutral-900 tracking-tight mb-2">
          Start a new basket?
        </h2>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium mb-6">
          Your basket contains items from <strong className="text-neutral-900">{currentRestaurantName}</strong>. 
          Each Stoke takeaway prepares and dispatches orders separately. Do you want to clear your current basket and start ordering from <strong className="text-brand-900">{newRestaurantName}</strong>?
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onConfirmClear}
            className="w-full py-3.5 px-4 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Basket & Add New Item</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Keep Current Basket ({currentRestaurantName})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
