import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, ArrowLeft, ArrowRight, ShieldCheck, FileText, X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { validateStokePostcode, normalizePostcode } from '../utils/ukLocalization';

export default function OnboardingWizard({ onClose, onSubmitSuccess }) {
  const modalRef = useFocusTrap(true, onClose);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    takeawayName: '',
    cuisineType: '',
    businessAddress: '',
    postcode: '',
    contactPhone: '',
    fhrsRating: 5,
    uploadedFileName: null,
    uploadedFileSize: null
  });
  const [validationError, setValidationError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setValidationError('File must be smaller than 10MB.');
        return;
      }
      setValidationError('');
      setFormData(prev => ({
        ...prev,
        uploadedFileName: file.name,
        uploadedFileSize: `${(file.size / 1024).toFixed(1)} KB`
      }));
    }
  };

  const handleNext = () => {
    setValidationError('');
    if (step === 1) {
      if (!formData.takeawayName.trim()) {
        setValidationError('Please enter your takeaway name.');
        return;
      }
      if (!formData.cuisineType) {
        setValidationError('Please select a cuisine type.');
        return;
      }
      const normPostcode = normalizePostcode(formData.postcode);
      if (!validateStokePostcode(normPostcode)) {
        setValidationError('Please enter a valid Stoke-on-Trent postal district (ST1–ST12).');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      onSubmitSuccess({
        id: `app_${Date.now()}`,
        name: formData.takeawayName,
        cuisine: formData.cuisineType,
        address: `${formData.businessAddress}, Stoke-on-Trent, ${normalizePostcode(formData.postcode)}`,
        phone: formData.contactPhone || '01782 555123',
        status: 'pending',
        fhrs: Number(formData.fhrsRating) || 5,
        uploadedFile: formData.uploadedFileName
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
        className="relative z-10 bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-modal border border-neutral-100 p-6 sm:p-8 animate-spring-modal"
      >
        {/* Stepper (Screenshot sample.jpg fidelity) */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6 pb-4 border-b border-neutral-100">
          {[
            { num: 1, label: "Business Info" },
            { num: 2, label: "Menu Setup" },
            { num: 3, label: "Verification" },
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                step === s.num
                  ? 'bg-brand-700 text-white shadow-xs'
                  : step > s.num
                  ? 'bg-brand-100 text-brand-900 font-extrabold'
                  : 'bg-neutral-100 text-neutral-400'
              }`}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span className={`text-xs font-bold ${step === s.num ? 'text-brand-950 font-black' : 'text-neutral-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img src="/assets/branding/main-logo.png" alt="Apple Eats" className="h-8 w-auto object-contain" />
          </div>
          <h2 id="onboarding-modal-title" className="text-2xl font-black text-neutral-900 tracking-tight">
            Register Takeaway Partner
          </h2>
          <p className="text-xs text-neutral-600 font-medium mt-1">
            {step === 1 && "Enter your Stoke-on-Trent takeaway information and license details"}
            {step === 2 && "Automated intake will prepare your digital takeaway storefront"}
            {step === 3 && "Submit proof of registration for 24-hour admin clearance"}
          </p>
        </div>

        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
            {validationError}
          </div>
        )}

        {/* Step 1: Business Profile */}
        {step === 1 && (
          <div className="space-y-3.5">
            <div>
              <label htmlFor="takeaway-name" className="block text-xs font-bold text-neutral-800 mb-1">
                Takeaway Trading Name <span className="text-brand-700">*</span>
              </label>
              <input
                id="takeaway-name"
                type="text"
                placeholder="e.g. Fish Lounge, Go Grill, Potteries Balti"
                value={formData.takeawayName}
                onChange={(e) => setFormData({ ...formData, takeawayName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm outline-none focus:border-brand-700 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="cuisine-type" className="block text-xs font-bold text-neutral-800 mb-1">
                  Cuisine Specialism <span className="text-brand-700">*</span>
                </label>
                <select
                  id="cuisine-type"
                  value={formData.cuisineType}
                  onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm outline-none focus:border-brand-700 focus:bg-white text-neutral-700 font-medium"
                >
                  <option value="">Select Cuisine Type</option>
                  <option value="British">British & Fish and Chips</option>
                  <option value="Grill">Grill & Gourmet Burgers</option>
                  <option value="Fried Chicken">Fried Chicken & Wings</option>
                  <option value="Pizza">Artisan Stonebaked Pizza</option>
                  <option value="Italian">Italian / Pasta</option>
                  <option value="Indian">Indian & Balti Curries</option>
                  <option value="Desserts">Waffles & Desserts</option>
                </select>
              </div>

              <div>
                <label htmlFor="fsa-rating" className="block text-xs font-bold text-neutral-800 mb-1">
                  FSA Hygiene Rating (FHRS)
                </label>
                <select
                  id="fsa-rating"
                  value={formData.fhrsRating}
                  onChange={(e) => setFormData({ ...formData, fhrsRating: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm outline-none focus:border-brand-700 focus:bg-white text-neutral-700 font-medium"
                >
                  <option value="5">5 - Very Good</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Generally Satisfactory</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="street-addr" className="block text-xs font-bold text-neutral-800 mb-1">
                Street Address
              </label>
              <input
                id="street-addr"
                type="text"
                placeholder="e.g. 24 Snow Hill, Shelton"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm outline-none focus:border-brand-700 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="stoke-postcode" className="block text-xs font-bold text-neutral-800 mb-1">
                  Stoke Postcode (ST1–ST12) <span className="text-brand-700">*</span>
                </label>
                <input
                  id="stoke-postcode"
                  type="text"
                  placeholder="e.g. ST1 4LY"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm font-mono uppercase outline-none focus:border-brand-700 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="dispatch-tel" className="block text-xs font-bold text-neutral-800 mb-1">
                  Kitchen Dispatch Tel
                </label>
                <input
                  id="dispatch-tel"
                  type="tel"
                  placeholder="e.g. 01782 283921"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs sm:text-sm outline-none focus:border-brand-700 focus:bg-white"
                />
              </div>
            </div>

            {/* Document Upload Dropzone */}
            <div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden" 
              />
              <div 
                role="button"
                tabIndex={0}
                aria-label="Upload Business Logo or Food Business Registration Document"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className="p-5 border-2 border-dashed border-neutral-300 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100 text-center cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-brand-700"
              >
                {formData.uploadedFileName ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-brand-900">
                    <FileText className="w-5 h-5 text-brand-700" />
                    <span>{formData.uploadedFileName} ({formData.uploadedFileSize})</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-neutral-800">
                      Upload Food Business License or ID
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Click to browse PDF, PNG, or JPG (max 10MB)
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Menu Profile */}
        {step === 2 && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-700 mx-auto flex items-center justify-center font-bold">
              ✓
            </div>
            <h3 className="font-extrabold text-base text-neutral-900">Initial Menu Catalog Matched</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              We have pre-configured standard takeaway categories for <strong className="text-neutral-900">{formData.takeawayName}</strong> with full Natasha's Law compliance attributes (Mains, Meal Combos, Extras, Sauces).
            </p>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 text-left space-y-1">
              <div>• <strong>City:</strong> Stoke-on-Trent (Postcode {formData.postcode.toUpperCase()})</div>
              <div>• <strong>Category:</strong> {formData.cuisineType}</div>
              <div>• <strong>Delivery Fee:</strong> Platform standard £0.99</div>
            </div>
          </div>
        )}

        {/* Step 3: Verification Notice */}
        {step === 3 && (
          <div className="p-6 text-center space-y-4">
            <ShieldCheck className="w-14 h-14 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-base text-neutral-900">Ready for Admin Clearance</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Upon submission, your application will stream straight to the hidden Apple Eats Stoke Administrative Console for owner sign-off within 24 hours.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-6">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onClose();
            }}
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 min-h-[44px] px-3"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-full font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2 min-h-[44px]"
          >
            <span>{step === 3 ? "Submit Application" : "Save & Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
