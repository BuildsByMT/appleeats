import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX,
  Printer, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle, 
  PlayCircle, 
  Truck, 
  ShoppingBasket, 
  ChefHat,
  LayoutGrid,
  Kanban,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { formatGBP } from '../utils/currency';

export default function KitchenDashboard({ orders, onUpdateStatus, onOpenReceipt, onBack }) {
  const [isPaused, setIsPaused] = useState(false);
  const [pauseMinutesLeft, setPauseMinutesLeft] = useState(30);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'grid'
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [adjustedPrepTimes, setAdjustedPrepTimes] = useState({});
  const prevOrdersCountRef = useRef(orders.length);

  // Audio Chime synthesizer
  const playAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  };

  // Play chime on incoming orders if audio is enabled
  useEffect(() => {
    if (orders.length > prevOrdersCountRef.current && audioEnabled) {
      playAudioChime();
    }
    prevOrdersCountRef.current = orders.length;
  }, [orders, audioEnabled]);

  // Busy countdown timer
  useEffect(() => {
    let timer = null;
    if (isPaused) {
      timer = setInterval(() => {
        setPauseMinutesLeft(prev => {
          if (prev <= 1) {
            setIsPaused(false);
            return 30;
          }
          return prev - 1;
        });
      }, 60000);
    } else {
      setPauseMinutesLeft(30);
    }
    return () => timer && clearInterval(timer);
  }, [isPaused]);

  const handleAdjustPrepTime = (orderId, minutes) => {
    setAdjustedPrepTimes(prev => ({
      ...prev,
      [orderId]: (prev[orderId] || 0) + minutes
    }));
  };

  // Kanban Columns
  const incomingOrders = orders.filter(o => o.orderStatus === 'placed');
  const cookingOrders = orders.filter(o => o.orderStatus === 'accepted' || o.orderStatus === 'preparing');
  const readyOrders = orders.filter(o => o.orderStatus === 'ready' || o.orderStatus === 'out_for_delivery');
  const completedOrders = orders.filter(o => o.orderStatus === 'delivered');

  const renderOrderCard = (order) => {
    const isPlaced = order.orderStatus === 'placed';
    const isAccepted = order.orderStatus === 'accepted' || order.orderStatus === 'preparing';
    const isReady = order.orderStatus === 'ready' || order.orderStatus === 'out_for_delivery';
    const isDelivered = order.orderStatus === 'delivered';

    return (
      <div 
        key={order.id}
        className={`bg-white rounded-2xl p-4 sm:p-5 border-2 transition-all shadow-card flex flex-col justify-between ${
          isPlaced ? 'border-brand-700 ring-2 ring-brand-100 bg-brand-50/10' : 'border-neutral-200'
        }`}
      >
        <div>
          {/* Header: Order Number & Due Time */}
          <div className="flex items-start justify-between pb-3 border-b border-neutral-100 mb-3">
            <div>
              <div className="text-base sm:text-lg font-black text-neutral-900">
                {order.orderNumber || "#1 Delivery"}
              </div>
              <div className="text-xs font-black text-brand-700 flex items-center gap-1 mt-0.5">
                {order.fulfillmentType === 'delivery' ? (
                  <>
                    <Truck className="w-3.5 h-3.5" />
                    <span>Delivery (£0.99)</span>
                  </>
                ) : (
                  <>
                    <ShoppingBasket className="w-3.5 h-3.5" />
                    <span>Collection (Pickup)</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-900 font-mono text-xs font-black">
                {order.dueTime || "06:53 PM"}
              </span>
              <div className="text-[10px] text-neutral-500 mt-1 font-bold">
                {order.paymentMethod === 'cod' ? 'Cash at Door' : 'Paid by Card [PAID]'}
              </div>
            </div>
          </div>

          {/* Customer Address & Contact */}
          <div className="mb-3 text-xs space-y-0.5">
            <div className="font-black text-sm text-neutral-900">{order.customerName}</div>
            <div className="text-neutral-700 font-medium">{order.address?.line1 || order.deliveryAddress?.line1}</div>
            <div className="font-black text-neutral-800">{order.address?.city || "Stoke-On-Trent"}, {order.address?.postcode || order.deliveryAddress?.postcode}</div>
            <div className="text-neutral-600 font-mono font-bold">Tel: {order.customerPhone}</div>
          </div>

          {/* Special Instructions Note (Screenshot 7 & Real Receipt) */}
          {order.specialInstructions && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 mb-3">
              <strong className="font-black">Chef Note: </strong>
              <span className="font-bold">{order.specialInstructions}</span>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-2 mb-4 border-t border-neutral-100 pt-3 max-h-52 overflow-y-auto">
            {order.items?.map((item, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between font-black text-neutral-900">
                  <span>[{item.quantity || 1}] {item.name}</span>
                  <span>{formatGBP((item.customizedPrice || item.price) * (item.quantity || 1))}</span>
                </div>
                {item.selectedOptions?.map((opt, oi) => (
                  <div key={oi} className="pl-3 text-[11px] text-neutral-600 font-semibold">
                    • {opt.name} {opt.priceDelta > 0 && `(+${formatGBP(opt.priceDelta)})`}
                  </div>
                ))}
              </div>
            ))}
            {order.freeGift && (
              <div className="text-xs font-black text-brand-700 flex justify-between pt-1">
                <span>{order.freeGift}</span>
                <span>£0.00</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons & Thermal Print Trigger */}
        <div className="pt-3 border-t border-neutral-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-neutral-900 mb-2">
            <span>Total:</span>
            <span className="text-lg text-brand-900">{formatGBP(order.total)}</span>
          </div>

          {/* Prep Time Quick Bump Buttons (Incoming / Cooking) */}
          {(isPlaced || isAccepted) && (
            <div className="flex items-center gap-1.5 pb-1">
              <span className="text-[10px] font-bold text-neutral-500">Delay +:</span>
              <button 
                type="button"
                onClick={() => handleAdjustPrepTime(order.id, 10)}
                className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px] font-bold text-neutral-700 active:scale-95 transition-transform"
                title="Add 10 minutes buffer"
              >
                +10m
              </button>
              <button 
                type="button"
                onClick={() => handleAdjustPrepTime(order.id, 20)}
                className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px] font-bold text-neutral-700 active:scale-95 transition-transform"
                title="Add 20 minutes buffer"
              >
                +20m
              </button>
              {adjustedPrepTimes[order.id] && (
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px] animate-in fade-in">
                  +{adjustedPrepTimes[order.id]}m delay
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* View/Print Receipt Slip */}
            <button
              type="button"
              onClick={() => onOpenReceipt(order)}
              className="py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 min-h-[44px]"
            >
              <Printer className="w-3.5 h-3.5 text-brand-700" />
              <span>Print Slip</span>
            </button>

            {/* Advance Status Button */}
            {isPlaced && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'accepted')}
                className="py-2.5 px-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-black text-xs transition-colors shadow-xs active:scale-95 min-h-[44px]"
              >
                Accept & Cook
              </button>
            )}

            {isAccepted && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'ready')}
                className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs transition-colors shadow-xs active:scale-95 min-h-[44px]"
              >
                Mark Ready
              </button>
            )}

            {isReady && (
              <button
                type="button"
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-xs active:scale-95 min-h-[44px]"
              >
                Complete
              </button>
            )}

            {isDelivered && (
              <div className="py-2.5 text-center text-xs font-black text-emerald-700 flex items-center justify-center gap-1 min-h-[44px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Done</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-4 sm:py-6 max-w-7xl mx-auto px-2 sm:px-6">
      {/* Kitchen Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-card mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center font-bold shadow-sm">
              <ChefHat className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Go Grill & Takeaway Kitchen OMS
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Live Stoke dispatch line: <strong className="text-neutral-900 font-black">01782 698710</strong> • High-performance kitchen display
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Back to Customer Marketplace */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-2.5 rounded-2xl border border-neutral-300 text-neutral-800 hover:text-brand-900 hover:bg-neutral-50 text-xs font-extrabold flex items-center gap-1.5 min-h-[44px] transition-transform active:scale-95 shadow-2xs cursor-pointer"
              title="Exit Kitchen OMS and return to main store"
            >
              <ArrowLeft className="w-4 h-4 text-brand-700" />
              <span>Back to Store</span>
            </button>
          )}

          {/* Audio Chime Gate */}
          <button
            type="button"
            onClick={() => {
              if (!audioEnabled) {
                setAudioEnabled(true);
                playAudioChime();
              } else {
                setAudioEnabled(false);
              }
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[44px] active:scale-95 ${
              audioEnabled 
                ? 'bg-brand-50 border border-brand-200 text-brand-900 font-black' 
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
            title={audioEnabled ? "Kitchen Bell Active" : "Enable Kitchen Audio Bell"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-brand-700" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            <span>{audioEnabled ? "Bell Active" : "Enable Bell"}</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 min-h-[36px] ${
                viewMode === 'kanban' ? 'bg-white text-brand-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 min-h-[36px] ${
                viewMode === 'grid' ? 'bg-white text-brand-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          {/* Emergency Kitchen Pause Switch */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`px-4 py-2.5 rounded-full font-black text-xs flex items-center gap-2 transition-all shadow-xs active:scale-95 min-h-[44px] ${
              isPaused 
                ? 'bg-amber-500 text-white animate-pulse' 
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
            }`}
          >
            {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4 text-amber-600" />}
            <span>{isPaused ? `Kitchen Paused (${pauseMinutesLeft}m left)` : "Busy? Pause Kitchen"}</span>
          </button>
        </div>
      </div>

      {/* Concurrent 4-Column Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Column 1: Incoming */}
          <div className="bg-neutral-100/70 p-3.5 rounded-2xl border border-neutral-200/80 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <span className="font-black text-xs uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-700"></span>
                <span>Incoming</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-700 text-white text-[11px] font-black">
                {incomingOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1">
              {incomingOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 font-medium">No incoming orders</div>
              ) : (
                incomingOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Column 2: In Kitchen */}
          <div className="bg-neutral-100/70 p-3.5 rounded-2xl border border-neutral-200/80 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <span className="font-black text-xs uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>In Kitchen / Cooking</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-black">
                {cookingOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1">
              {cookingOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 font-medium">No active cooking orders</div>
              ) : (
                cookingOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Column 3: Ready / Out */}
          <div className="bg-neutral-100/70 p-3.5 rounded-2xl border border-neutral-200/80 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <span className="font-black text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Ready / Dispatched</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[11px] font-black">
                {readyOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1">
              {readyOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 font-medium">No ready orders</div>
              ) : (
                readyOrders.map(renderOrderCard)
              )}
            </div>
          </div>

          {/* Column 4: Completed */}
          <div className="bg-neutral-100/70 p-3.5 rounded-2xl border border-neutral-200/80 flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200">
              <span className="font-black text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Completed</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black">
                {completedOrders.length}
              </span>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1">
              {completedOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 font-medium">No completed orders yet</div>
              ) : (
                completedOrders.map(renderOrderCard)
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {orders.map(renderOrderCard)}
        </div>
      )}
    </div>
  );
}
