import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  ChevronDown, 
  Store, 
  Menu, 
  X,
  Truck,
  ShoppingBasket
} from 'lucide-react';
import { STOKE_POSTCODE_DISTRICTS, formatUKPhone } from '../utils/ukLocalization';
import { formatGBP } from '../utils/currency';

export default function Header({
  cartCount = 0,
  onOpenCart,
  onOpenAuth,
  activeTab,
  setActiveTab,
  fulfillmentMode,
  setFulfillmentMode,
  selectedPostcode,
  setSelectedPostcode,
  searchQuery,
  setSearchQuery,
  onOpenKitchen,
  currentAddress,
  onOpenAddressModal,
  cartBounce = false,
  currentUser
}) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const locationRef = useRef(null);

  const stokeAreas = STOKE_POSTCODE_DISTRICTS;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-all pt-safe">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-brand-700 text-white font-bold text-xs rounded-lg shadow-lg focus-visible:outline-none"
      >
        Skip to main content
      </a>

      <div className="w-full max-w-[1720px] 2xl:max-w-[1840px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2.5 sm:gap-4 lg:gap-6">
          
          {/* LEFT: Mobile Menu Button + Apple Eats Brand Logo + Stoke Selector */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Mobile Hamburger Button (min 44x44px tap target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 -ml-1 text-neutral-800 hover:text-brand-700 md:hidden rounded-full hover:bg-neutral-100 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-700"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
            </button>

            {/* Apple Eats Official Logo (PNG Asset Directly) */}
            <button 
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="flex items-center focus:outline-none transition-transform active:scale-95 text-left shrink-0 focus-visible:ring-2 focus-visible:ring-brand-700 rounded-xl py-1 px-1.5"
              aria-label="Apple Eats Home"
            >
              <img 
                src="/assets/branding/main-logo.png" 
                alt="Apple Eats" 
                className="h-9 sm:h-11 w-auto object-contain shrink-0"
              />
            </button>

            {/* Address & Catchment Selector Pill (Foodpanda style + Stoke ST1-ST12) */}
            <div className="relative shrink-0 hidden sm:block" ref={locationRef}>
              <button 
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-neutral-100/90 hover:bg-neutral-200/70 border border-neutral-300 px-3.5 py-2 rounded-full transition-all text-neutral-800 shadow-2xs whitespace-nowrap min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-700"
                aria-haspopup="listbox"
                aria-expanded={showLocationDropdown}
                aria-label={`Select Delivery Address, currently ${currentAddress?.postcode || selectedPostcode || 'ST1'}`}
              >
                <MapPin aria-hidden="true" className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                <span>
                  {currentAddress 
                    ? `${currentAddress.label || 'Deliver to'}: ${currentAddress.postcode}`
                    : selectedPostcode 
                    ? `Stoke (${selectedPostcode})` 
                    : "Stoke-on-Trent"}
                </span>
                <ChevronDown aria-hidden="true" className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLocationDropdown && (
                <div 
                  role="listbox"
                  className="absolute left-0 mt-2 w-88 bg-white rounded-2xl shadow-modal border border-neutral-200 py-2.5 z-50 animate-spring-modal"
                >
                  {/* Foodpanda-style Dynamic Address Trigger */}
                  <div className="p-3 border-b border-neutral-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationDropdown(false);
                        if (onOpenAddressModal) onOpenAddressModal();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-brand-50 hover:bg-brand-100/80 text-brand-700 text-xs font-black flex items-center justify-center gap-2 border border-brand-200/60 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Enter Custom Address / Add Address</span>
                    </button>
                    {currentAddress && (
                      <p className="text-[11px] text-neutral-600 font-medium mt-1.5 truncate">
                        Current: {currentAddress.line1}, {currentAddress.postcode}
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-1.5 text-[11px] font-extrabold text-neutral-600 uppercase tracking-wider flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span>Quick Stoke Districts</span>
                    <span className="text-brand-700 font-black">ST1–ST12</span>
                  </div>
                  <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto">
                    {stokeAreas.map(area => (
                      <button
                        key={area.code}
                        role="option"
                        aria-selected={selectedPostcode === area.code}
                        onClick={() => {
                          setSelectedPostcode(area.code);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-brand-50 flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-brand-700 ${
                          selectedPostcode === area.code ? 'bg-brand-50 text-brand-900 font-black' : 'text-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-neutral-900">{area.name}</div>
                          <div className="text-[11px] text-neutral-600 font-medium">Min. {formatGBP(area.minDelivery)} • ~{area.eta}</div>
                        </div>
                        <span className="text-xs font-black px-2 py-0.5 bg-brand-100 text-brand-800 rounded-md">
                          {area.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Prominent Search Bar (Always wide and comfortable) */}
          <div className="flex-1 max-w-lg min-w-[180px] hidden md:block">
            <div className="relative">
              <label htmlFor="header-desktop-search" className="sr-only">
                Search Stoke-on-Trent takeaways, pizzas, burgers and dishes
              </label>
              <Search aria-hidden="true" className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 shrink-0" />
              <input
                id="header-desktop-search"
                type="text"
                placeholder="Search Fish Lounge, Go Grill, burgers, pizzas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-9 py-2.5 bg-neutral-100 hover:bg-white focus:bg-white border border-neutral-300 focus:border-brand-700 focus:ring-2 focus:ring-brand-100 rounded-full text-xs sm:text-sm outline-none transition-all placeholder:text-neutral-500 font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 text-xs font-bold p-1 rounded-full focus-visible:ring-2 focus-visible:ring-brand-700"
                  aria-label="Clear search input"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Delivery Switch + Navigation + Cart + Profile */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            
            {/* Fulfillment Mode Switcher: visible on md (768px+) */}
            <div 
              role="radiogroup"
              aria-label="Order fulfillment mode"
              className="hidden md:flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200 shrink-0"
            >
              <button
                role="radio"
                aria-checked={fulfillmentMode === 'delivery'}
                onClick={() => setFulfillmentMode('delivery')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-full transition-all whitespace-nowrap min-h-[36px] focus-visible:ring-2 focus-visible:ring-brand-700 ${
                  fulfillmentMode === 'delivery'
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Truck aria-hidden="true" className="w-3.5 h-3.5" />
                <span>Delivery ({formatGBP(0.99)})</span>
              </button>
              <button
                role="radio"
                aria-checked={fulfillmentMode === 'collection'}
                onClick={() => setFulfillmentMode('collection')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-full transition-all whitespace-nowrap min-h-[36px] focus-visible:ring-2 focus-visible:ring-brand-700 ${
                  fulfillmentMode === 'collection'
                    ? 'bg-brand-700 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <ShoppingBasket aria-hidden="true" className="w-3.5 h-3.5" />
                <span>Collection (Free)</span>
              </button>
            </div>

            {/* Quick Navigation Links: visible on lg (1024px+) */}
            <nav className="hidden lg:flex items-center gap-4 text-xs sm:text-sm font-bold text-neutral-800" aria-label="Main Navigation">
              <button 
                onClick={() => setActiveTab('home')}
                className={`transition-colors py-1 focus-visible:ring-2 focus-visible:ring-brand-700 rounded-md px-1 ${activeTab === 'home' ? 'text-brand-700 font-black' : 'hover:text-brand-700'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab('browse')}
                className={`transition-colors py-1 focus-visible:ring-2 focus-visible:ring-brand-700 rounded-md px-1 ${activeTab === 'browse' ? 'text-brand-700 font-black' : 'hover:text-brand-700'}`}
              >
                Browse
              </button>
              <button 
                onClick={() => setActiveTab('offers')}
                className={`relative transition-colors py-1 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-brand-700 rounded-md px-1 ${activeTab === 'offers' ? 'text-brand-700 font-black' : 'hover:text-brand-700'}`}
              >
                <span>Offers</span>
                <span className="px-1.5 py-0.2 bg-brand-100 text-brand-900 text-[10px] font-black rounded-full">
                  50%
                </span>
              </button>
            </nav>

            {/* Kitchen Tablet OMS Fast Trigger */}
            <button
              onClick={onOpenKitchen}
              title="Takeaway Kitchen Tablet OMS"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-extrabold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 rounded-full transition-colors active:scale-95 shrink-0 min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-700"
              aria-label="Open Kitchen Order Management System"
            >
              <Store aria-hidden="true" className="w-3.5 h-3.5 text-brand-700" />
              <span className="hidden xl:inline">Kitchen OMS</span>
            </button>

            {/* Cart Icon Button with Count Badge (44x44px minimum tap target) */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onOpenCart) onOpenCart();
              }}
              className={`relative p-2.5 sm:p-3 bg-brand-700 hover:bg-brand-800 text-white rounded-full shadow-card transition-all active:scale-90 flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-brand-700 cursor-pointer ${
                cartBounce ? 'animate-spring-pulse scale-110' : ''
              }`}
              aria-label={`Shopping basket with ${cartCount} items`}
              title="View Shopping Basket"
              data-testid="header-cart-button"
            >
              <ShoppingBag aria-hidden="true" className="w-5 h-5 pointer-events-none" />
              {cartCount > 0 && (
                <span 
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-1 -right-1 bg-white text-brand-700 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-700 shadow-sm ${
                    cartBounce ? 'animate-spring-pulse' : ''
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar */}
            <button 
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-1 pr-1 sm:pr-3 py-1 rounded-full hover:bg-neutral-100 transition-colors shrink-0 min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-700 active:scale-95 cursor-pointer"
              aria-label={`User Account: ${currentUser?.name || 'John D.'}`}
            >
              <div aria-hidden="true" className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-800 font-black text-xs shrink-0">
                {currentUser?.initials || 'JD'}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-neutral-900 hidden md:inline whitespace-nowrap">
                {currentUser?.name || 'John D.'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Bar: Stacked on <xs (375px), Row on sm */}
        <div className="py-2.5 border-t border-neutral-100 flex flex-col xs:flex-row md:hidden items-stretch xs:items-center justify-between gap-2">
          {/* Mobile Fulfillment Toggle */}
          <div 
            role="radiogroup" 
            aria-label="Mobile fulfillment mode"
            className="flex items-center bg-neutral-100 p-0.5 rounded-full border border-neutral-200 text-xs font-bold w-full xs:max-w-[195px] shrink-0"
          >
            <button
              role="radio"
              aria-checked={fulfillmentMode === 'delivery'}
              onClick={() => setFulfillmentMode('delivery')}
              className={`flex-1 py-1.5 px-2 rounded-full transition-all text-center flex items-center justify-center gap-1 min-h-[36px] ${
                fulfillmentMode === 'delivery'
                  ? 'bg-brand-700 text-white shadow-xs font-black'
                  : 'text-neutral-700 font-semibold'
              }`}
            >
              <Truck aria-hidden="true" className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </button>
            <button
              role="radio"
              aria-checked={fulfillmentMode === 'collection'}
              onClick={() => setFulfillmentMode('collection')}
              className={`flex-1 py-1.5 px-2 rounded-full transition-all text-center flex items-center justify-center gap-1 min-h-[36px] ${
                fulfillmentMode === 'collection'
                  ? 'bg-brand-700 text-white shadow-xs font-black'
                  : 'text-neutral-700 font-semibold'
              }`}
            >
              <ShoppingBasket aria-hidden="true" className="w-3.5 h-3.5" />
              <span>Collection</span>
            </button>
          </div>

          {/* Mobile Search Input + Quick Location Chip */}
          <div className="flex-1 flex items-center gap-1.5">
            <div className="relative flex-1">
              <label htmlFor="header-mobile-search" className="sr-only">
                Search food in Stoke-on-Trent
              </label>
              <Search aria-hidden="true" className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="header-mobile-search"
                type="text"
                placeholder="Search food in Stoke..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-neutral-100 rounded-full text-xs outline-none focus:bg-white focus:border focus:border-brand-700 font-medium min-h-[38px]"
              />
            </div>
            
            {/* Quick Postcode Indicator Chip on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-full text-[11px] font-black text-brand-800 shrink-0 min-h-[38px] flex items-center gap-1"
              aria-label={`Change Stoke delivery zone, current: ${selectedPostcode || 'ST1'}`}
            >
              <MapPin aria-hidden="true" className="w-3 h-3 text-brand-700" />
              <span>{selectedPostcode || 'ST1'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="w-72 max-w-[80vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200 overflow-y-auto pb-safe">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <img src="/assets/branding/main-logo.png" alt="Apple Eats" className="h-8 w-auto object-contain" />
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-700"
                  aria-label="Close navigation menu"
                >
                  <X aria-hidden="true" className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile District Selector */}
              <div className="pt-3 pb-2 border-b border-neutral-100">
                <div className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-2">
                  Delivery Zone: <strong className="text-brand-700">{selectedPostcode || 'ST1'}</strong>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {stokeAreas.map(area => (
                    <button
                      key={area.code}
                      onClick={() => {
                        setSelectedPostcode(area.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 text-xs font-black rounded-lg text-center transition-colors min-h-[36px] ${
                        selectedPostcode === area.code
                          ? 'bg-brand-700 text-white shadow-xs'
                          : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                      }`}
                    >
                      {area.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Items */}
              <div className="py-4 space-y-1.5" role="menu">
                <button
                  role="menuitem"
                  onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl font-extrabold text-sm min-h-[44px] flex items-center ${activeTab === 'home' ? 'bg-brand-50 text-brand-900' : 'text-neutral-800 hover:bg-neutral-50'}`}
                >
                  Home Discovery
                </button>
                <button
                  role="menuitem"
                  onClick={() => { setActiveTab('browse'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl font-extrabold text-sm min-h-[44px] flex items-center ${activeTab === 'browse' ? 'bg-brand-50 text-brand-900' : 'text-neutral-800 hover:bg-neutral-50'}`}
                >
                  Browse Stoke Takeaways
                </button>
                <button
                  role="menuitem"
                  onClick={() => { setActiveTab('offers'); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-3.5 py-3 rounded-xl font-extrabold text-sm flex items-center justify-between min-h-[44px] ${activeTab === 'offers' ? 'bg-brand-50 text-brand-900' : 'text-neutral-800 hover:bg-neutral-50'}`}
                >
                  <span>Deals & Vouchers</span>
                  <span className="px-2 py-0.5 bg-brand-700 text-white text-[10px] font-black rounded-full">50% OFF</span>
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => { 
                    if (onOpenKitchen) onOpenKitchen();
                    else setActiveTab('kitchen'); 
                    setMobileMenuOpen(false); 
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl font-extrabold text-sm text-neutral-800 hover:bg-neutral-50 flex items-center gap-2 min-h-[44px]"
                >
                  <Store aria-hidden="true" className="w-4 h-4 text-brand-700" />
                  <span>Kitchen Tablet OMS</span>
                </button>

                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCart) onOpenCart();
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl font-extrabold text-sm text-neutral-800 hover:bg-neutral-50 flex items-center justify-between min-h-[44px] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag aria-hidden="true" className="w-4 h-4 text-brand-700" />
                    <span>View Shopping Basket</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 bg-brand-700 text-white text-[11px] font-black rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  role="menuitem"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-3 rounded-xl font-extrabold text-sm text-neutral-800 hover:bg-neutral-50 flex items-center gap-2.5 min-h-[44px] active:scale-95 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-800 font-black text-xs shrink-0">
                    {currentUser?.initials || 'JD'}
                  </div>
                  <span>{currentUser?.name ? `Account: ${currentUser.name}` : 'Sign In / Account'}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="font-extrabold text-neutral-900">Launch Market: Stoke-on-Trent</div>
              <div className="mt-1 font-mono">Direct Landline: {formatUKPhone("01782698710")}</div>
              <div className="mt-3 text-neutral-500 font-medium text-[11px]">
                © 2026 Apple Eats UK • ST1–ST12
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
        </div>
      )}
    </header>
  );
}
