import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  X, 
  Plus, 
  Check, 
  Home, 
  Briefcase, 
  Compass, 
  AlertCircle, 
  Info,
  Phone
} from 'lucide-react';
import { validateStokePostcode, normalizePostcode, getStokePostcodeDetails } from '../utils/ukLocalization';

export default function AddressModal({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
  savedAddresses = [],
  onSaveNewAddress
}) {
  const [activeView, setActiveView] = useState('list'); // 'list' | 'add'
  const [formData, setFormData] = useState({
    label: 'Home',
    name: currentAddress?.name || 'Owen Hume',
    phone: currentAddress?.phone || '07951 280623',
    line1: currentAddress?.line1 || '',
    line2: currentAddress?.line2 || '',
    city: currentAddress?.city || 'Stoke-on-Trent',
    postcode: currentAddress?.postcode || 'ST4 7PW',
    notes: currentAddress?.notes || ''
  });
  const [error, setError] = useState('');
  const [validationNote, setValidationNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto check initial postcode
      checkPostcode(formData.postcode);
    } else {
      document.body.style.overflow = '';
      setActiveView('list');
      setError('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const checkPostcode = (pc) => {
    if (!pc) {
      setValidationNote('');
      return;
    }
    const norm = normalizePostcode(pc);
    const isStoke = validateStokePostcode(norm);
    if (isStoke) {
      const details = getStokePostcodeDetails(norm);
      setValidationNote(`✓ Stoke Catchment Verified: ${details.area} (${details.district}) — Eligible for fast delivery (£0.99).`);
    } else {
      setValidationNote(`ℹ️ Outside standard Stoke-on-Trent takeaway delivery zone. Collection (pickup) is available for any address.`);
    }
  };

  const handlePostcodeChange = (e) => {
    const val = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, postcode: val }));
    checkPostcode(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.line1.trim()) {
      setError('Please enter your house number / building name and street address.');
      return;
    }
    if (!formData.postcode.trim()) {
      setError('Please enter your postcode.');
      return;
    }

    const normPostcode = normalizePostcode(formData.postcode);
    const newAddress = {
      ...formData,
      postcode: normPostcode
    };

    onSaveNewAddress(newAddress);
    onSelectAddress(newAddress);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs animate-fade-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-modal border border-neutral-200 overflow-hidden z-10 animate-spring-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 id="address-modal-title" className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                {activeView === 'list' ? 'Delivery Address' : 'Add New Address'}
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                Foodpanda-style custom address entry & delivery checking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close address modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeView === 'list' ? (
            <div className="space-y-4">
              {/* Action: Add new address button */}
              <button
                type="button"
                onClick={() => setActiveView('add')}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-brand-200 hover:border-brand-600 bg-brand-50/30 hover:bg-brand-50/70 text-brand-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add a New Delivery Address</span>
              </button>

              {/* Saved Address Cards */}
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-600 px-1">
                  Saved Addresses
                </span>

                {savedAddresses.map((addr, idx) => {
                  const isCurrent = 
                    currentAddress?.line1 === addr.line1 && 
                    currentAddress?.postcode === addr.postcode;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectAddress(addr);
                        onClose();
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isCurrent 
                          ? 'border-brand-700 bg-brand-50/20 shadow-xs' 
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isCurrent ? 'bg-brand-700 text-white' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {addr.label === 'Work' ? <Briefcase className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-neutral-900">{addr.label || 'Address'}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-brand-700 text-white text-[10px] font-black uppercase tracking-wider">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-700 font-medium mt-1">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                          </p>
                          <p className="text-xs text-neutral-500 font-semibold">
                            {addr.city}, {addr.postcode}
                          </p>
                          {addr.notes && (
                            <p className="text-[11px] text-amber-800 bg-amber-50 rounded-lg px-2 py-1 mt-1.5 border border-amber-200/60 inline-block">
                              Note: {addr.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 pt-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isCurrent ? 'border-brand-700 bg-brand-700' : 'border-neutral-300'
                        }`}>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Add New Address Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Address Label Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  Address Label
                </label>
                <div className="flex items-center gap-2">
                  {['Home', 'Work', 'Other'].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, label: lbl }))}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        formData.label === lbl 
                          ? 'bg-brand-700 text-white shadow-xs' 
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                    placeholder="e.g. Owen Hume"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                    placeholder="e.g. 07951 280623"
                    required
                  />
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Street Address & House / Flat Number *
                </label>
                <input
                  type="text"
                  value={formData.line1}
                  onChange={(e) => setFormData(prev => ({ ...prev, line1: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                  placeholder="e.g. Flat 4B, 55 Stanley Road"
                  required
                />
              </div>

              {/* Line 2 (Optional) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Apartment / Suite / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formData.line2}
                  onChange={(e) => setFormData(prev => ({ ...prev, line2: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                  placeholder="e.g. Near Hanley Park Gate"
                />
              </div>

              {/* Town & Postcode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
                    placeholder="e.g. Stoke-on-Trent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Postcode / ZIP *
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={handlePostcodeChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand-700"
                    placeholder="e.g. ST4 7PW"
                    required
                  />
                </div>
              </div>

              {/* Real-time Catchment Feedback */}
              {validationNote && (
                <div className={`p-3 rounded-xl text-xs font-medium border flex items-start gap-2 ${
                  validationNote.includes('✓') 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validationNote}</span>
                </div>
              )}

              {/* Delivery Notes for Courier */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Rider Instructions / Delivery Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none"
                  placeholder="e.g. Leave with porch security, call on arrival"
                />
              </div>

              {error && (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}

              {/* Form Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveView('list')}
                  className="w-1/3 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition-colors"
                >
                  Back to List
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Save & Use Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
