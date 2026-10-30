import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function SpecialInstructionsModal({ initialNote = '', onClose, onSave }) {
  const modalRef = useFocusTrap(true, onClose);
  const [note, setNote] = useState(initialNote || 'No Jalapeno on the loaded fries please');

  const quickPills = [
    "No Jalapeno",
    "Extra napkins please",
    "Sauce on the side",
    "Please knock, do not ring bell",
    "Separate packaging",
    "Allergy: Please prepare with clean utensils"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-modal-title"
        className="relative z-10 bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-modal border border-neutral-100 p-6 sm:p-7 animate-spring-modal"
      >
        {/* Header (Screenshot 7 fidelity) */}
        <div className="flex items-center justify-between mb-2">
          <h2 id="instructions-modal-title" className="text-xl font-black text-neutral-900 tracking-tight">
            Special instructions
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle guidance text from Screenshot 7 */}
        <p className="text-xs text-neutral-600 mb-4 leading-relaxed font-normal">
          Please let us know if you are allergic to anything or if we need to avoid anything.
        </p>

        {/* Allergy Warning Notice */}
        <div className="mb-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Natasha's Law Allergen Notice:</strong> For severe allergies (anaphylaxis), please phone the takeaway kitchen directly at <strong className="text-amber-900">01782 698710</strong> before placing your order.
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-3">
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={200}
            aria-label="Kitchen preparation and allergy instructions"
            placeholder="e.g. No Jalapeno on the loaded fries please, allergy information..."
            className="w-full p-4 rounded-2xl bg-neutral-50 border border-neutral-300 focus:border-brand-700 focus:bg-white focus:ring-2 focus:ring-brand-100 outline-none text-xs sm:text-sm text-neutral-900 transition-all resize-none font-medium"
          />
          <div className="flex justify-between items-center text-[11px] text-neutral-500 px-1 mt-1 font-medium">
            <span>Directly printed on 80mm kitchen receipt ticket</span>
            <span>{note.length} / 200</span>
          </div>
        </div>

        {/* Quick Tag Suggestions */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Quick Add
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setNote(prev => prev ? `${prev}, ${pill}` : pill)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-brand-50 hover:text-brand-900 text-neutral-700 transition-colors min-h-[32px]"
              >
                + {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => onSave(note)}
            className="px-7 py-3 bg-brand-700 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md transition-transform active:scale-95 min-h-[44px]"
          >
            Save Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
