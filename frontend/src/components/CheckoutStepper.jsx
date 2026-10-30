import React, { useState, useMemo, useRef } from 'react';
import { 
  Check, 
  MapPin, 
  Clock, 
  CreditCard, 
  Gift, 
  ArrowLeft, 
  ShieldCheck, 
  ChevronRight,
  Truck,
  ShoppingBasket,
  Tag,
  AlertCircle,
  Plus,
  Minus,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateOrderFinancials, formatGBP } from '../utils/currency';
import { validateStokePostcode, normalizePostcode } from '../utils/ukLocalization';

export default function CheckoutStepper({
  cartItems,
  onUpdateQty,
  onBackToMenu,
  onOrderSuccess,
  specialNote,
  onOpenNoteModal,
  fulfillmentMode,
  setFulfillmentMode,
  onOpenAddressModal,
  userAddress
}) {
  const [currentStep, setCurrentStep] = useState(3); // Default to Step 3 (Payment) matching Screenshot 10
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [allergenAcknowledged, setAllergenAcknowledged] = useState(false);
  const [allergenError, setAllergenError] = useState(false);

  // Section Refs for smooth navigation on step click
  const fulfillmentRef = useRef(null);
  const addressRef = useRef(null);
  const paymentRef = useRef(null);
  const orderSummaryRef = useRef(null);

  // Address Editor state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressList, setAddressList] = useState([
    {
      name: "Owen Hume",
      line1: "55 Stanley Road",
      city: "Stoke-On-Trent",
      postcode: "ST4 7PW",
      phone: "07951 280623",
      isDefault: true
    },
    {
      name: "Owen Hume (Work)",
      line1: "12 Stafford Street, Hanley",
      city: "Stoke-On-Trent",
      postcode: "ST1 1JW",
      phone: "07951 280623",
      isDefault: false
    }
  ]);
  const [editForm, setEditForm] = useState({
    name: '',
    line1: '',
    city: 'Stoke-On-Trent',
    postcode: '',
    phone: ''
  });
  const [postcodeError, setPostcodeError] = useState('');

  const currentAddress = userAddress || addressList[selectedAddressIndex] || addressList[0];

  // Financial calculations using integer-pence engine
  const financials = useMemo(() => {
    return calculateOrderFinancials(cartItems, {
      fulfillmentMode,
      voucherCode: appliedCoupon
    });
  }, [cartItems, fulfillmentMode, appliedCoupon]);

  const hasFreeGift = financials.subtotal >= 30.00;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    const validCodes = ['EATS50', 'TREATS', 'GOGRILL30', 'CRISPYBOGO', 'ITALIA20', 'FREESWEET'];
    
    if (validCodes.includes(code)) {
      setAppliedCoupon(code);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setCouponError('Invalid voucher. Valid Stoke codes: TREATS, EATS50, GOGRILL30');
    }
  };

  const handleSaveCustomAddress = (e) => {
    e.preventDefault();
    setPostcodeError('');
    const norm = normalizePostcode(editForm.postcode);
    const isValid = validateStokePostcode(norm);

    if (!isValid) {
      setPostcodeError('Please enter a valid Stoke-on-Trent postcode (ST1–ST12).');
      return;
    }

    const newAddr = {
      ...editForm,
      city: 'Stoke-On-Trent',
      postcode: norm
    };

    setAddressList(prev => [newAddr, ...prev]);
    setSelectedAddressIndex(0);
    setIsEditingAddress(false);
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
    if (step === 1) {
      orderSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (step === 2) {
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (step === 3) {
      paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handlePlaceOrder = () => {
    if (!allergenAcknowledged) {
      setAllergenError(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
      onOrderSuccess({
        orderNumber: "#1 Delivery",
        orderSequence: 1,
        customerName: currentAddress.name,
        customerPhone: currentAddress.phone,
        address: currentAddress,
        fulfillmentType: fulfillmentMode,
        items: cartItems,
        freeGift: hasFreeGift ? "Free Gift Strawberry Cheesecake" : null,
        subtotal: financials.subtotal,
        deliveryCharge: financials.deliveryCharge,
        serviceCharge: financials.serviceCharge,
        discount: financials.discount,
        total: financials.total,
        paymentMethod: selectedPayment,
        specialInstructions: specialNote
      });
    }, 1200);
  };

  return (
    <div className="w-full max-w-[1440px] 2xl:max-w-[1600px] mx-auto py-6 sm:py-8 px-4 sm:px-8 animate-page-view">
      {/* Back Button */}
      <button 
        type="button"
        onClick={onBackToMenu}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 hover:text-brand-700 mb-6 transition-all active:scale-95 min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Menu</span>
      </button>

      {/* 4-Step Stepper Header (Pixel-perfect center line & segmented progress) */}
      <div className="mb-8 max-w-3xl mx-auto px-2">
        <div className="relative">
          {/* Connecting Track Line: spans strictly from Center of Step 1 (12.5%) to Center of Step 4 (87.5%) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-5 -translate-y-1/2 h-1 bg-neutral-200 z-0 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-700 via-brand-700 to-brand-800 transition-all duration-500 ease-out rounded-full"
              style={{ 
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '33.333%' : currentStep === 3 ? '66.666%' : '100%' 
              }}
            />
          </div>

          {/* Stepper Nodes and Labels */}
          <div className="grid grid-cols-4 relative z-10">
            {[
              { step: 1, label: "Your Cart", desc: "Review items" },
              { step: 2, label: "Delivery Info", desc: "Address & notes" },
              { step: 3, label: "Payment", desc: "Choose tender" },
              { step: 4, label: "Confirmation", desc: "Order placed" },
            ].map((s) => {
              const isCompleted = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <div key={s.step} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    onClick={() => handleStepClick(s.step)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm transition-all shadow-xs ${
                      isCurrent
                        ? 'bg-brand-700 text-white ring-4 ring-brand-100 shadow-md scale-105 active:scale-95 cursor-pointer'
                        : isCompleted
                        ? 'bg-brand-700 text-white ring-2 ring-brand-200 hover:ring-brand-300 active:scale-95 cursor-pointer'
                        : 'bg-white border-2 border-neutral-300 text-neutral-400 hover:border-neutral-400 cursor-pointer'
                    }`}
                    aria-label={`Go to ${s.label}`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 text-white stroke-[3]" /> : s.step}
                  </button>
                  <span className={`text-xs mt-2 font-bold whitespace-nowrap ${isCurrent ? 'text-brand-900 font-black' : isCompleted ? 'text-neutral-800 font-extrabold' : 'text-neutral-400'}`}>
                    {s.label}
                  </span>
                  <span className="hidden sm:inline text-[10px] text-neutral-500 font-medium mt-0.5">
                    {s.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column (Forms & Selection Panels) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Review & Place Order
            </h1>
            <span className="text-xs text-neutral-600 font-bold bg-neutral-100 px-3 py-1 rounded-full">
              Dispatch: Stoke-on-Trent (01782)
            </span>
          </div>

          {/* Delivery vs Collection Switcher (Screenshot 8) */}
          <div ref={fulfillmentRef} className="bg-white rounded-card p-5 border border-neutral-200/80 shadow-card">
            <h2 className="text-sm sm:text-base font-black text-neutral-900 mb-3 flex items-center justify-between">
              <span>Fulfillment Option</span>
              <span className="text-xs text-neutral-500 font-normal">Select service type</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentMode('delivery')}
                className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-98 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer ${
                  fulfillmentMode === 'delivery'
                    ? 'border-brand-700 bg-brand-50/30 text-brand-900 shadow-2xs font-extrabold'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Truck className="w-4 h-4 text-brand-700" />
                <span>Delivery (25–35m • £0.99)</span>
              </button>
              <button
                type="button"
                onClick={() => setFulfillmentMode('collection')}
                className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-98 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer ${
                  fulfillmentMode === 'collection'
                    ? 'border-brand-700 bg-brand-50/30 text-brand-900 shadow-2xs font-extrabold'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <ShoppingBasket className="w-4 h-4 text-brand-700" />
                <span>Collection (15m • Free)</span>
              </button>
            </div>
          </div>

          {/* Delivery Address Card (Screenshot 8 & 10) */}
          <div ref={addressRef} className="bg-white rounded-card p-5 border border-neutral-200/80 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-black text-neutral-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span>{fulfillmentMode === 'delivery' ? 'Delivery Address' : 'Collection Contact'}</span>
              </h2>
              <button 
                type="button"
                onClick={() => {
                  if (onOpenAddressModal) {
                    onOpenAddressModal();
                  } else {
                    setIsEditingAddress(!isEditingAddress);
                  }
                }}
                className="px-3.5 py-1.5 rounded-full bg-brand-700 text-white text-xs font-bold hover:bg-brand-800 transition-colors shadow-2xs active:scale-95 flex items-center gap-1.5 min-h-[36px] cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change Address</span>
              </button>
            </div>

            {/* Address Edit Form */}
            {isEditingAddress ? (
              <form onSubmit={handleSaveCustomAddress} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3 mb-3">
                <div className="text-xs font-bold text-neutral-800">Add or Edit Stoke-on-Trent Address:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Recipient Name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="UK Phone (e.g. 07951 280623)"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Street Address (e.g. 55 Stanley Road)"
                  value={editForm.line1}
                  onChange={(e) => setEditForm({ ...editForm, line1: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-xs text-neutral-900 outline-none focus:border-brand-700"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Stoke Postcode (e.g. ST4 7PW)"
                    value={editForm.postcode}
                    onChange={(e) => setEditForm({ ...editForm, postcode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-300 text-xs font-mono uppercase text-neutral-900 outline-none focus:border-brand-700"
                  />
                  <input
                    type="text"
                    readOnly
                    value="Stoke-on-Trent, Staffordshire"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 border border-neutral-300 text-xs text-neutral-600 outline-none cursor-not-allowed font-medium"
                  />
                </div>

                {postcodeError && (
                  <p className="text-xs font-bold text-rose-600">{postcodeError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-3 py-1.5 text-xs text-neutral-600 font-bold hover:bg-neutral-200 rounded-lg active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-brand-700 text-white rounded-lg hover:bg-brand-800 active:scale-95"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              /* Selected Address Display */
              <div className="p-4 rounded-xl border-2 border-brand-700 bg-brand-50/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-neutral-900">{currentAddress.name}</span>
                    {currentAddress.label && (
                      <span className="px-2 py-0.5 rounded-md bg-brand-100 text-brand-900 text-[10px] font-black uppercase">
                        {currentAddress.label}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-700 font-medium mt-0.5">
                    {currentAddress.line1}{currentAddress.line2 ? `, ${currentAddress.line2}` : ''}
                  </div>
                  <div className="text-xs font-black text-brand-900">{currentAddress.city}, {currentAddress.postcode}</div>
                  <div className="text-[11px] text-neutral-600 mt-1">Tel: {currentAddress.phone}</div>
                  {currentAddress.notes && (
                    <div className="text-[11px] text-amber-800 mt-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block font-medium">
                      Note: {currentAddress.notes}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-brand-800 bg-brand-100 px-3 py-1.5 rounded-full">
                  <span>Selected</span>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>
            )}
          </div>

          {/* Kitchen Preparation Special Instructions (Screenshot 7 fidelity) */}
          <div className="bg-white rounded-card p-5 border border-neutral-200/80 shadow-card flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-neutral-900">Kitchen Preparation Instructions</div>
              <div className="text-xs text-neutral-600 mt-0.5 font-medium">
                {specialNote || "No special instructions added"}
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenNoteModal}
              className="text-xs font-black text-brand-700 hover:text-brand-800 underline underline-offset-2 min-h-[44px] flex items-center active:scale-95 cursor-pointer"
            >
              {specialNote ? "Edit Note" : "+ Add Note"}
            </button>
          </div>

          {/* Payment Method Selector (Screenshot 8 & 10 fidelity) */}
          <div ref={paymentRef} className="bg-white rounded-card p-5 border border-neutral-200/80 shadow-card">
            <h2 className="text-sm sm:text-base font-black text-neutral-900 mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              {/* Credit / Debit Card (Selected) */}
              <div className={`p-4 rounded-2xl border-2 transition-all ${selectedPayment === 'card' ? 'border-brand-700 bg-brand-50/20' : 'border-neutral-200'}`}>
                <label className="flex items-center justify-between cursor-pointer mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="checkout-payment-method"
                      value="card"
                      checked={selectedPayment === 'card'}
                      onChange={() => setSelectedPayment('card')}
                      className="w-4 h-4 text-brand-700 focus:ring-brand-700"
                    />
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-neutral-700" />
                      <span className="text-sm font-extrabold text-neutral-900">Credit or Debit Card</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-mono">VISA</span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-mono">MASTERCARD</span>
                  </div>
                </label>

                {selectedPayment === 'card' && (
                  <div className="space-y-3 pt-2 animate-spring-modal">
                    <div>
                      <label htmlFor="cardholder-name" className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Cardholder Name
                      </label>
                      <input 
                        id="cardholder-name"
                        type="text" 
                        placeholder="Cardholder Name" 
                        defaultValue="Owen Hume"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 outline-none focus:border-brand-700 bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="card-number" className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Card Number
                      </label>
                      <input 
                        id="card-number"
                        type="text" 
                        placeholder="•••• •••• •••• 4321" 
                        defaultValue="•••• •••• •••• 4321"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-mono text-neutral-900 outline-none focus:border-brand-700 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="card-expiry" className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input 
                          id="card-expiry"
                          type="text" 
                          placeholder="MM/YY" 
                          defaultValue="08/28"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 outline-none focus:border-brand-700 bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="card-cvc" className="block text-[11px] font-bold text-neutral-700 mb-1">
                          CVC / CVV
                        </label>
                        <input 
                          id="card-cvc"
                          type="password" 
                          placeholder="CVC" 
                          defaultValue="982"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 outline-none focus:border-brand-700 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Apple Pay */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all min-h-[52px] active:scale-99 ${selectedPayment === 'apple_pay' ? 'border-brand-700 bg-brand-50/20 font-bold' : 'border-neutral-200'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="checkout-payment-method"
                    value="apple_pay"
                    checked={selectedPayment === 'apple_pay'}
                    onChange={() => setSelectedPayment('apple_pay')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <span className="text-sm font-extrabold text-neutral-900">Apple Pay</span>
                </div>
                <span className="text-xs font-black tracking-widest text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md">Pay</span>
              </label>

              {/* PayPal */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all min-h-[52px] active:scale-99 ${selectedPayment === 'paypal' ? 'border-brand-700 bg-brand-50/20 font-bold' : 'border-neutral-200'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="checkout-payment-method"
                    value="paypal"
                    checked={selectedPayment === 'paypal'}
                    onChange={() => setSelectedPayment('paypal')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <span className="text-sm font-extrabold text-neutral-900">PayPal</span>
                </div>
                <span className="text-xs font-black text-blue-600 italic">PayPal</span>
              </label>

              {/* Cash on Delivery */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all min-h-[52px] active:scale-99 ${selectedPayment === 'cod' ? 'border-brand-700 bg-brand-50/20 font-bold' : 'border-neutral-200'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="checkout-payment-method"
                    value="cod"
                    checked={selectedPayment === 'cod'}
                    onChange={() => setSelectedPayment('cod')}
                    className="w-4 h-4 text-brand-700"
                  />
                  <span className="text-sm font-extrabold text-neutral-900">Cash on Delivery / Pickup</span>
                </div>
                <span className="text-xs font-bold text-neutral-600">💵 Pay at door</span>
              </label>
            </div>
          </div>

          {/* Natasha's Law Allergen Declaration Checkbox */}
          <div className={`p-4 rounded-2xl border-2 transition-all ${allergenError && !allergenAcknowledged ? 'border-rose-500 bg-rose-50/40' : 'border-neutral-200 bg-white'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allergenAcknowledged}
                onChange={(e) => {
                  setAllergenAcknowledged(e.target.checked);
                  if (e.target.checked) setAllergenError(false);
                }}
                className="mt-0.5 w-5 h-5 rounded text-brand-700 focus:ring-brand-700 shrink-0 cursor-pointer"
              />
              <div className="text-xs leading-relaxed text-neutral-700">
                <strong className="text-neutral-900 font-extrabold">Natasha's Law Allergen Confirmation: </strong>
                I confirm that I have reviewed the ingredients and allergen declarations for all items in this order. If anyone in my party has severe allergies, I will call the kitchen directly at <strong className="text-brand-900">01782 698710</strong>.
              </div>
            </label>
            {allergenError && !allergenAcknowledged && (
              <p className="text-xs font-bold text-rose-600 mt-2 pl-8">
                Please acknowledge the allergen statement before proceeding with payment.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: "Your Order" Sticky Card (Screenshot 8 fidelity) */}
        <div className="lg:col-span-1">
          <div ref={orderSummaryRef} className="sticky top-28 bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/80 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">Your Order</h2>
              <span className="text-xs text-neutral-500 font-bold">{cartItems.length} items</span>
            </div>

            {/* Cart Items List or Empty Basket State */}
            {cartItems.length === 0 ? (
              <div className="py-8 text-center space-y-3 border-y border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBasket className="w-6 h-6" />
                </div>
                <p className="text-xs text-neutral-600 font-medium">Your basket is currently empty</p>
                <button
                  type="button"
                  onClick={onBackToMenu}
                  className="px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-full text-xs font-bold transition-all active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Browse Takeaways</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-neutral-100">
                {cartItems.map((item, idx) => {
                  const itemLinePrice = (item.customizedPrice || item.price) * item.quantity;
                  return (
                    <div key={idx} className="pt-2 flex items-start justify-between gap-2 text-xs">
                      <div className="flex-1">
                        <div className="font-extrabold text-neutral-900">
                          {item.quantity}x {item.name}
                        </div>
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div className="text-[11px] text-neutral-600 pl-2 mt-0.5 space-y-0.5 font-medium">
                            {item.selectedOptions.map((opt, oIdx) => (
                              <div key={oIdx}>• {opt.name} {opt.priceDelta > 0 && `(+${formatGBP(opt.priceDelta)})`}</div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <span className="font-black text-neutral-900">
                          {formatGBP(itemLinePrice)}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button 
                            type="button"
                            onClick={() => onUpdateQty(idx, -1)}
                            className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold active:scale-90 transition-all cursor-pointer"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-neutral-900 w-5 text-center">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => onUpdateQty(idx, 1)}
                            className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center font-bold active:scale-90 transition-all cursor-pointer"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Free Gift Promo Banner (Screenshot 8 fidelity) */}
            {hasFreeGift && (
              <div className="p-3 rounded-2xl bg-brand-50 border border-brand-200 flex items-center gap-2.5">
                <Gift className="w-5 h-5 text-brand-700 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-brand-900">Free Gift Unlocked: </span>
                  <span className="font-extrabold text-neutral-900">Strawberry Cheesecake (£0.00)</span>
                </div>
              </div>
            )}

            {/* Coupon Entry */}
            <div className="pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Voucher (e.g. TREATS, EATS50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono uppercase outline-none focus:border-brand-700"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors active:scale-95 min-h-[40px] cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1 font-semibold">{couponError}</p>
              )}
              {appliedCoupon && !couponError && (
                <p className="text-[11px] text-emerald-700 mt-1 font-bold">
                  ✓ Voucher {appliedCoupon} applied successfully!
                </p>
              )}
            </div>

            {/* Financial Breakdown (Matching Owen Hume receipt) */}
            <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs font-semibold text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">{formatGBP(financials.subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-neutral-900">
                  {financials.deliveryCharge > 0 ? formatGBP(financials.deliveryCharge) : 'FREE'}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Service Charge</span>
                <span className="font-bold text-neutral-900">{formatGBP(financials.serviceCharge)}</span>
              </div>

              {financials.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-extrabold">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-{formatGBP(financials.discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total</span>
                <span className="text-xl text-brand-800">{formatGBP(financials.total)}</span>
              </div>
            </div>

            {/* Confirm & Pay CTA */}
            <button
              type="button"
              onClick={cartItems.length === 0 ? onBackToMenu : handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white rounded-full font-black text-sm tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Processing Payment...</span>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex items-center gap-2">
                  <ShoppingBasket className="w-4 h-4" />
                  <span>Basket is Empty — Browse Takeaways</span>
                </div>
              ) : (
                <span>Confirm & Pay {formatGBP(financials.total)}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
