import React, { useState } from 'react';
import { Printer, X, Copy, Check, Download } from 'lucide-react';
import { formatUKPhone, normalizePostcode } from '../utils/ukLocalization';
import { useFocusTrap } from '../hooks/useFocusTrap';

export default function ThermalReceiptModal({ order, onClose }) {
  if (!order) return null;
  const [copiedRaw, setCopiedRaw] = useState(false);
  const modalRef = useFocusTrap(true, onClose);

  const isDelivery = order.fulfillmentType !== 'collection';
  const deliveryCharge = order.deliveryCharge !== undefined 
    ? Number(order.deliveryCharge) 
    : (isDelivery ? 0.99 : 0.00);
  const serviceCharge = order.serviceCharge !== undefined ? Number(order.serviceCharge) : 0.50;
  const subtotal = order.subtotal !== undefined ? Number(order.subtotal) : 38.15;
  const total = order.total !== undefined ? Number(order.total) : (subtotal + deliveryCharge + serviceCharge);
  const customerPostcode = normalizePostcode(order.address?.postcode || 'ST4 7PW');
  const customerPhone = formatUKPhone(order.customerPhone || '07951 280623');
  const takeawayPhone = formatUKPhone(order.takeawayPhone || '01782 698710');

  // Collect declared allergens across all items in order for Natasha's Law banner
  const declaredAllergens = Array.from(new Set(
    (order.items || []).flatMap(item => {
      const itemAllergens = item.allergens || [];
      const optAllergens = (item.selectedOptions || []).flatMap(o => o.allergens || []);
      return [...itemAllergens, ...optAllergens];
    })
  ));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadEscPos = () => {
    const orderId = order.id || 'ord_stk_001';
    window.open(`http://localhost:5000/api/v1/receipts/${orderId}/escpos`, '_blank');
  };

  const handleCopyTextReceipt = () => {
    const linesText = (order.items || []).map(item => {
      const itemTotal = ((item.customizedPrice !== undefined ? item.customizedPrice : item.price) * (item.quantity || 1)).toFixed(2);
      let line = `[${item.quantity || 1}] ${item.name.padEnd(25)} £${itemTotal}`;
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        const opts = item.selectedOptions.map(o => `    • ${o.name} (${o.priceDelta > 0 ? `+£${Number(o.priceDelta).toFixed(2)}` : 'Included'})`).join('\n');
        line += `\n${opts}`;
      }
      return line;
    }).join('\n');

    const allergenAlertText = declaredAllergens.length > 0
      ? `----------------------------------------\n*** NATASHA'S LAW ALLERGEN ALERT ***\nDeclared: ${declaredAllergens.join(', ').toUpperCase()}\n`
      : '';

    const textReceipt = `
========================================
             APPLE EATS UK
           tel: ${takeawayPhone}
----------------------------------------
             ${order.orderNumber || '#1 Delivery'}
           Due at ${order.dueTime || '06:53 PM'}
----------------------------------------
${order.customerName || 'Owen Hume'}
${order.address?.line1 || '55 Stanley Road'}
${order.address?.city || 'Stoke-On-Trent'}
${customerPostcode}
tel: ${customerPhone}
----------------------------------------
${allergenAlertText}${order.specialInstructions || order.notes ? `Note: ${order.specialInstructions || order.notes}\n----------------------------------------\n` : ''}${linesText}
${order.freeGift ? `${order.freeGift.padEnd(30)} £0.00\n` : ''}----------------------------------------
Subtotal:                       £${subtotal.toFixed(2)}
Delivery charge:                 £${deliveryCharge.toFixed(2)}
Service Charge:                  £${serviceCharge.toFixed(2)}
TOTAL:                          £${total.toFixed(2)}
${order.paymentMethod === 'cod' ? 'Cash' : 'Card'}:                           £${total.toFixed(2)}
----------------------------------------
               [ PAID ]
========================================
`.trim();

    navigator.clipboard.writeText(textReceipt);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="thermal-receipt-title"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div 
        ref={modalRef}
        className="relative z-10 bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-modal border border-neutral-100 flex flex-col max-h-[95dvh] animate-spring-modal"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer aria-hidden="true" className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 id="thermal-receipt-title" className="text-xs sm:text-sm font-black tracking-tight">
                80mm Kitchen Thermal Receipt
              </h2>
              <p className="text-[10px] text-neutral-400">
                Direct ESC/POS slip for Stoke Takeaway Printers
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label="Close thermal receipt dialog"
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body (Monospace font reproducing the real paper slip) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-neutral-100/70 flex justify-center">
          <div 
            id="printable-thermal-ticket"
            className="w-full max-w-[340px] bg-white p-5 shadow-sm border border-neutral-200 font-mono text-[12px] leading-tight text-neutral-900 rounded-lg select-text"
          >
            {/* Takeaway Header */}
            <div className="text-center space-y-0.5 pb-2">
              <div className="font-bold text-xs uppercase tracking-wider text-neutral-700">Apple Eats Stoke-on-Trent</div>
              <div className="text-sm font-black tracking-tight">{order.restaurantName || "Go Grill"}</div>
              <div className="text-[11px] text-neutral-600">tel: {takeawayPhone}</div>
            </div>

            <div className="border-b-2 border-dashed border-neutral-800 my-2"></div>

            {/* Order Sequence Header */}
            <div className="text-center py-1">
              <div className="text-xl font-black tracking-tight">
                {order.orderNumber || '#1 Delivery'}
              </div>
              <div className="text-xs font-bold pt-0.5">
                Due at {order.dueTime || '06:53 PM'}
              </div>
            </div>

            <div className="border-b-2 border-neutral-900 my-2"></div>

            {/* Customer Details */}
            <div className="space-y-0.5 py-1">
              <div className="font-black text-sm">{order.customerName || 'Owen Hume'}</div>
              <div>{order.address?.line1 || '55 Stanley Road'}</div>
              <div>{order.address?.city || 'Stoke-On-Trent'}</div>
              <div className="font-bold">{customerPostcode}</div>
              <div className="text-xs">tel: {customerPhone}</div>
            </div>

            {/* Natasha's Law Allergen Alert Banner */}
            {declaredAllergens.length > 0 && (
              <div className="my-2 p-2 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-900">
                <div className="font-black flex items-center gap-1 uppercase tracking-wider">
                  ⚠️ Natasha's Law Allergen Alert
                </div>
                <div className="text-[10px] pt-0.5 leading-snug">
                  Contains: <span className="font-black uppercase">{declaredAllergens.join(', ')}</span>
                </div>
              </div>
            )}

            {/* Kitchen Preparation Special Notes */}
            {(order.specialInstructions || order.notes) && (
              <div className="my-2 p-2 bg-neutral-100 border-l-4 border-neutral-900 text-xs">
                <span className="font-black">Note:</span> {order.specialInstructions || order.notes}
              </div>
            )}

            <div className="border-b-2 border-dashed border-neutral-800 my-2"></div>

            {/* Items List */}
            <div className="space-y-2 py-1">
              {(order.items || []).map((item, idx) => {
                const qty = item.quantity || 1;
                const itemPrice = item.customizedPrice !== undefined ? item.customizedPrice : item.price;
                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>[{qty}] {item.name}</span>
                      <span>£{(itemPrice * qty).toFixed(2)}</span>
                    </div>
                    {item.selectedOptions?.map((opt, oi) => (
                      <div key={oi} className="flex justify-between pl-3 text-[11px] text-neutral-700">
                        <span>• {opt.name}</span>
                        <span>{opt.priceDelta > 0 ? `+£${Number(opt.priceDelta).toFixed(2)}` : 'Included'}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Free Gift */}
            {order.freeGift && (
              <div className="pt-1 font-black flex justify-between text-brand-800">
                <span>{order.freeGift}</span>
                <span>£0.00</span>
              </div>
            )}

            <div className="border-b-2 border-neutral-900 my-2"></div>

            {/* Financial Breakdown */}
            <div className="space-y-1 pt-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery charge</span>
                <span>£{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge</span>
                <span>£{serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 border-t-2 border-neutral-900">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-0.5">
                <span>{order.paymentMethod === 'cod' ? 'Cash' : 'Card'}</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            {/* PAID Stamp (Exact reproduction of real physical ticket) */}
            <div className="pt-4 pb-2 text-center">
              <div className="inline-block border-2 border-neutral-900 px-5 py-1 font-black tracking-widest text-sm bg-neutral-50">
                [ PAID ]
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 pb-safe">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTextReceipt}
              className="px-3 py-2 rounded-full border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-brand-700 min-h-[44px]"
              aria-label="Copy plain text thermal slip to clipboard"
            >
              {copiedRaw ? (
                <>
                  <Check aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-extrabold" aria-live="polite">Copied!</span>
                </>
              ) : (
                <>
                  <Copy aria-hidden="true" className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadEscPos}
              className="px-3 py-2 rounded-full border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-brand-700 min-h-[44px]"
              aria-label="Download raw ESC/POS binary receipt file"
            >
              <Download aria-hidden="true" className="w-3.5 h-3.5 text-neutral-500" />
              <span>ESC/POS (.bin)</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-black text-white font-black text-xs rounded-full shadow-md flex items-center gap-2 transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-400 min-h-[44px]"
            aria-label="Print physical 80mm thermal kitchen slip"
          >
            <Printer aria-hidden="true" className="w-4 h-4 text-emerald-400" />
            <span>Print 80mm Slip</span>
          </button>
        </div>

      </div>
    </div>
  );
}
