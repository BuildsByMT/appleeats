import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Plus, Minus, Sparkles, AlertCircle, Info } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { toPence, toPounds, formatGBP } from '../utils/currency';

export default function CustomizationModal({ item, onClose, onComplete }) {
  if (!item) return null;

  const modalRef = useFocusTrap(true, onClose);

  // Groups extraction or fallback to GoGrill Pizza spec
  const sizeGroup = useMemo(() => {
    return item.customizationGroups?.find(g => g.name === 'Size') || {
      name: 'Size',
      required: true,
      options: [
        { id: 'opt-sz-7', name: '7 Inch Classic', priceDelta: 0.00 },
        { id: 'opt-sz-12', name: '12 Inch Large', priceDelta: 4.50 }
      ]
    };
  }, [item]);

  const toppingsGroup = useMemo(() => {
    return item.customizationGroups?.find(g => g.name === 'Add Extra Toppings' || g.name === 'Toppings') || {
      name: 'Add Extra Toppings',
      maxSelections: 6,
      options: [
        { id: 'opt-top-tuna', name: 'Tuna', priceDelta: 0.80, allergen: 'Fish' },
        { id: 'opt-top-corn', name: 'Sweetcorn', priceDelta: 0.80 },
        { id: 'opt-top-cheese', name: 'Extra Mozzarella', priceDelta: 1.20, allergen: 'Milk' },
        { id: 'opt-top-jalapeno', name: 'Jalapenos', priceDelta: 0.50 },
        { id: 'opt-top-pepp', name: 'Halal Pepperoni', priceDelta: 1.30 },
        { id: 'opt-top-mush', name: 'Mushrooms', priceDelta: 0.80 }
      ]
    };
  }, [item]);

  // Selected options state
  const [selectedSize, setSelectedSize] = useState(() => sizeGroup.options[0]?.id || '');
  const [selectedToppings, setSelectedToppings] = useState(() => {
    // If the item specifically has pre-seeded toppings (e.g. gg-p1 with Tuna and Sweetcorn)
    if (item.id === 'gg-p1') {
      return {
        'opt-top-tuna': true,
        'opt-top-corn': true
      };
    }
    return {};
  });
  const [itemQuantity, setItemQuantity] = useState(1);
  const [validationError, setValidationError] = useState('');

  // Maximum selections limit
  const maxToppings = toppingsGroup.maxSelections || 6;
  const currentToppingsCount = Object.values(selectedToppings).filter(Boolean).length;

  const toggleTopping = (optId) => {
    setValidationError('');
    setSelectedToppings(prev => {
      const willBeChecked = !prev[optId];
      if (willBeChecked && currentToppingsCount >= maxToppings) {
        setValidationError(`You can select up to ${maxToppings} extra toppings.`);
        return prev;
      }
      return {
        ...prev,
        [optId]: willBeChecked
      };
    });
  };

  // Live integer-pence price calculations
  const basePence = toPence(item.price);
  const sizeOption = sizeGroup.options?.find(o => o.id === selectedSize);
  const sizeDeltaPence = sizeOption ? toPence(sizeOption.priceDelta) : 0;

  const toppingsDeltaPence = (toppingsGroup.options || []).reduce((acc, opt) => {
    if (selectedToppings[opt.id]) {
      return acc + toPence(opt.priceDelta);
    }
    return acc;
  }, 0);

  const singleItemPence = basePence + sizeDeltaPence + toppingsDeltaPence;
  const totalPence = singleItemPence * itemQuantity;

  const singleItemPrice = toPounds(singleItemPence);
  const calculatedTotal = toPounds(totalPence);

  const handleFinish = () => {
    const selectedOptionsList = [];
    if (sizeOption) {
      selectedOptionsList.push({ name: sizeOption.name, priceDelta: sizeOption.priceDelta });
    }
    (toppingsGroup.options || []).forEach(opt => {
      if (selectedToppings[opt.id]) {
        selectedOptionsList.push({ name: opt.name, priceDelta: opt.priceDelta });
      }
    });

    onComplete({
      ...item,
      quantity: itemQuantity,
      price: item.price,
      customizedPrice: singleItemPrice,
      selectedOptions: selectedOptionsList
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Bottom Sheet Box */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-customization"
        className="relative z-10 bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-modal border border-neutral-100 flex flex-col max-h-[92vh] sm:max-h-[85vh] animate-sheet-up sm:animate-spring-modal"
      >
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header (Screenshot 6 fidelity) */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 id="modal-title-customization" className="text-sm sm:text-base font-extrabold text-neutral-900">
              Customize Your Meal
            </h2>
            <p className="text-[11px] text-neutral-500 font-medium">
              GoGrill Build-Your-Own Customization Engine • Stoke-on-Trent
            </p>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: 2 Columns on Tablet/Desktop, 1 Column on Mobile */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* Left Column: Food Photo & Summary */}
          <div>
            <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-3 shadow-xs relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-black">
                Base {formatGBP(item.price)}
              </div>
            </div>

            <h3 className="font-black text-lg sm:text-xl text-neutral-900 mb-1">{item.name}</h3>
            
            <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-3">
              {item.description}
            </p>

            {/* Natasha's Law Allergen Note */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Natasha's Law Allergen Notice:</span>
                </div>
                <div className="text-[11px] font-semibold text-amber-800">
                  Contains: {item.allergens.join(', ')}
                </div>
              </div>
            )}

            {/* Live selected options recap pill */}
            <div className="p-3 rounded-xl bg-brand-50/70 border border-brand-100 text-xs">
              <div className="font-bold text-brand-900 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-700" />
                <span>Selected Modifiers:</span>
              </div>
              <div className="text-neutral-700 space-y-0.5 text-[11px]">
                <div>• Size: <strong>{sizeOption?.name || "7 Inch"}</strong></div>
                {(toppingsGroup.options || []).filter(o => selectedToppings[o.id]).map(t => (
                  <div key={t.id}>• Extra: {t.name} (+{formatGBP(t.priceDelta)})</div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Customization Groups */}
          <div className="space-y-5">
            {/* Size Radio Group */}
            {sizeGroup && (
              <fieldset role="radiogroup" aria-labelledby="legend-size" className="space-y-2">
                <legend id="legend-size" className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs sm:text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                    Select Size <span className="text-brand-700">*</span>
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500">Required (1)</span>
                </legend>

                <div className="space-y-2">
                  {sizeGroup.options.map(opt => (
                    <label 
                      key={opt.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all min-h-[48px] ${
                        selectedSize === opt.id 
                          ? 'border-brand-700 bg-brand-50/50 text-brand-950 font-bold' 
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="customization-size"
                          value={opt.id}
                          checked={selectedSize === opt.id}
                          onChange={() => setSelectedSize(opt.id)}
                          className="w-4 h-4 text-brand-700 focus:ring-brand-700"
                        />
                        <span className="text-xs sm:text-sm">{opt.name}</span>
                      </div>
                      <span className="text-xs font-black text-neutral-700">
                        {opt.priceDelta > 0 ? `+${formatGBP(opt.priceDelta)}` : 'Included'}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Extra Toppings Checkboxes */}
            {toppingsGroup && toppingsGroup.options?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                    Add Extra Toppings
                  </h4>
                  <span className="text-[10px] font-bold text-neutral-500">
                    {currentToppingsCount} of {maxToppings} selected
                  </span>
                </div>

                {validationError && (
                  <p className="text-[11px] font-bold text-amber-700 mb-2">
                    {validationError}
                  </p>
                )}

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {toppingsGroup.options.map(opt => {
                    const isChecked = !!selectedToppings[opt.id];
                    return (
                      <label 
                        key={opt.id}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all min-h-[44px] ${
                          isChecked 
                            ? 'border-brand-700 bg-brand-50/40 text-brand-950 font-bold' 
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleTopping(opt.id)}
                            className="w-4 h-4 rounded text-brand-700 focus:ring-brand-700"
                          />
                          <div>
                            <span className="text-xs sm:text-sm">{opt.name}</span>
                            {opt.allergen && (
                              <span className="ml-1.5 text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                {opt.allergen}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-black text-neutral-700">
                          +{formatGBP(opt.priceDelta)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 min-h-[50px]">
              <span className="text-xs font-bold text-neutral-700">Item Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-neutral-300 flex items-center justify-center font-bold text-neutral-800 hover:bg-neutral-100 active:scale-95 transition-all shadow-2xs"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-base text-neutral-900 w-8 text-center">
                  {itemQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white border border-neutral-300 flex items-center justify-center font-bold text-neutral-800 hover:bg-neutral-100 active:scale-95 transition-all shadow-2xs"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Footer: Total & CTA (Screenshot 6 fidelity) */}
        <div className="px-5 sm:px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between pb-safe">
          <div>
            <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">
              Total Price
            </div>
            <div className="text-xl sm:text-2xl font-black text-neutral-900">
              {formatGBP(calculatedTotal)}
            </div>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="px-7 sm:px-9 py-3 sm:py-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-full font-black text-xs sm:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2 min-h-[44px]"
          >
            <span>Add to Basket</span>
            <span>({formatGBP(calculatedTotal)})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
