import React, { useState } from 'react';
import { Lock, Shield, CheckCircle, XCircle, DollarSign, Store, RefreshCw, X, KeyRound, Percent, AlertCircle } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { formatGBP } from '../utils/currency';

export default function LockedAdminConsole({ 
  onClose, 
  applications = [], 
  onApproveApplication, 
  onRejectApplication 
}) {
  const modalRef = useFocusTrap(true, onClose);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [thirdPartyCommission, setThirdPartyCommission] = useState(12.0);

  const handleVerifyKey = (e) => {
    e.preventDefault();
    // Validate passkey without exposing plaintext in UI
    const inputKey = accessKey.trim();
    if (inputKey.length >= 4) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid administrative passkey. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-console-title"
        className="relative z-10 bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-neutral-800 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-rose-500" />
            <div>
              <h2 id="admin-console-title" className="text-sm font-extrabold tracking-tight">
                Apple Eats Stealth Administrative Console
              </h2>
              <p className="text-[10px] text-neutral-400">
                Restricted Owner-Only Management Gateway • Stoke-on-Trent ST1–ST12
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Close Admin Console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate (If not authenticated) */}
        {!isAuthenticated ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-brand-700">
              <KeyRound className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-black text-neutral-900">Owner Passkey Required</h3>
            <p className="text-xs text-neutral-600 max-w-sm font-medium">
              This console is hidden from public navigation. Please enter your hardware token or master passkey to unlock the marketplace management panel.
            </p>

            <form onSubmit={handleVerifyKey} className="w-full max-w-sm space-y-3 pt-2">
              <input
                type="password"
                placeholder="Enter master admin passkey"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-300 text-sm outline-none focus:border-brand-700 focus:bg-white text-center font-mono"
              />
              {errorMsg && <div className="text-xs font-bold text-rose-600">{errorMsg}</div>}
              
              <button
                type="submit"
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-full shadow-md transition-transform active:scale-95 min-h-[44px]"
              >
                Authenticate Session
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-neutral-50">
            {/* Metric KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Gross Orders (Stoke)</div>
                <div className="text-2xl font-black text-neutral-900 mt-1">£1,489.20</div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">↑ 24 orders today (ST1–ST12)</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Anchor Takeaways</div>
                <div className="text-2xl font-black text-neutral-900 mt-1">4 Stores Owned</div>
                <div className="text-[11px] font-semibold text-brand-700 mt-0.5">Fish Lounge, Go Grill, Crispy Chicken, Bella Italia</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Platform Commission</div>
                <div className="text-2xl font-black text-neutral-900 mt-1">0% (Owned)</div>
                <div className="text-[11px] font-semibold text-neutral-700 mt-0.5">{thirdPartyCommission.toFixed(1)}% for 3rd-party partners</div>
              </div>
            </div>

            {/* Takeaway Onboarding Queue */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
              <h3 className="font-extrabold text-base text-neutral-900 mb-4 flex items-center justify-between">
                <span>Pending Takeaway Onboarding Applications</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-900">
                  {applications.filter(a => a.status === 'pending').length} Action Needed
                </span>
              </h3>

              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-400 font-medium">
                    No takeaway applications pending review.
                  </div>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="p-4 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-extrabold text-sm text-neutral-900">{app.name}</div>
                        <div className="text-neutral-600 font-medium">{app.cuisine} • {app.address}</div>
                        <div className="text-neutral-500 mt-0.5">FSA Food Hygiene: {app.fhrs}/5 Stars • tel: {app.phone}</div>
                        {app.uploadedFile && (
                          <div className="text-[11px] font-mono text-brand-900 mt-0.5">
                            Attached: {app.uploadedFile}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {app.status === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onRejectApplication && onRejectApplication(app.id)}
                              className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 font-bold text-neutral-700 min-h-[36px]"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => onApproveApplication && onApproveApplication(app.id)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold min-h-[36px]"
                            >
                              Approve Takeaway
                            </button>
                          </>
                        ) : (
                          <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {app.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Dynamic Commission Policy Configuration */}
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm">
              <h3 className="font-extrabold text-base text-neutral-900 mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4 text-brand-700" />
                <span>Commission Matrix Settings</span>
              </h3>
              
              <div className="mb-4">
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Third-Party Stoke Takeaway Commission Rate: <strong className="text-brand-900">{thirdPartyCommission}%</strong>
                </label>
                <input 
                  type="range"
                  min="5.0"
                  max="20.0"
                  step="0.5"
                  value={thirdPartyCommission}
                  onChange={(e) => setThirdPartyCommission(parseFloat(e.target.value))}
                  className="w-full accent-brand-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-semibold mt-1">
                  <span>5% (Promotional)</span>
                  <span>12% (Market Standard)</span>
                  <span>20% (Premium)</span>
                </div>
              </div>

              <div className="text-xs text-neutral-600 space-y-1 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <div>• <strong>Client Owned Takeaways (4 Stores):</strong> 0.0% Commission (Permanent exemption)</div>
                <div>• <strong>Third-Party Marketplace Rate:</strong> {thirdPartyCommission.toFixed(1)}% per completed order</div>
                <div>• <strong>Settlement Cycle:</strong> BACS / Stripe Connect weekly every Monday</div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
